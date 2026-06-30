---
title: "`kbagent serve` — HTTP server + agent host + Web UI"
permalink: /cli/web-server/
---

* TOC
{:toc}

{% raw %}
## TL;DR

`kbagent serve` is the kbagent **kernel exposed as an HTTP API**, plus a
local **agent host** that schedules background tasks (cron + AI CLIs +
MCP tools), plus a **React web UI** that drives both. Single Python
process, localhost-only, bearer-auth, scoped to one config directory.

```
┌─────────────────────────────────────────────────────────────┐
│ Browser ── React SPA (web/frontend, Vite :5173)             │
│   │                                                         │
│   │  REST + SSE  via /api/*                                 │
│   ▼                                                         │
│ Node BFF (web/backend, Fastify :8000)                       │
│   │  injects bearer token                                   │
│   ▼                                                         │
│ kbagent serve (Python FastAPI :8001)                        │
│   ├─ 150+ REST endpoints over every kbagent service         │
│   ├─ asyncio cron scheduler (agent_runner)                  │
│   └─ subprocesses: kbagent CLI / claude / codex / gemini    │
│       └─ they call back via `kbagent http` to *this* serve  │
│   │                                                         │
│   ▼                                                         │
│ Keboola APIs (Storage, Queue, Manage, AI, MCP)              │
└─────────────────────────────────────────────────────────────┘
```

## Why this exists

Three stages, each adds capability over the previous one.

### Stage 1 — API for programmatic access (today)

The CLI is fine when a human types `kbagent project list`. It is awkward
when something *programmatic* — a different tool, a Streamlit app, a
notebook, a webhook — wants to ask "what configs are in project X?"
Forking a CLI per question is slow, swallows logs, and re-parses JSON
output.

`kbagent serve` solves that by exposing the same Python services as a
proper HTTP API with an OpenAPI schema. Anyone can build apps on top,
in any language. The CLI itself stays unchanged; the server is a
parallel surface.

### Stage 2 — Local agent host (today, in progress)

Once you have a long-running serve with a token, the obvious next step
is "let me schedule things to run inside it". Three flavours:

- `cli_command` — periodic `kbagent <cmd>` runs (the *cron-for-kbagent* use case).
- `mcp_tool` — periodic MCP tool invocations across all projects.
- `ai_agent` — periodic prompts to a **local AI CLI** (`claude`, `codex`,
  `gemini`). The AI can use its own tools (file ops, web search, MCP)
  to satisfy the prompt, *and* it can call back into this serve via
  `kbagent http get /…` because the scheduler injects the serve URL +
  bearer token into the subprocess environment.

The result is a local control plane: agents that wake up on a cron,
do work using the user's own AI subscription, and write the result back
to a run history that the UI displays.

### Stage 3 — Replace the Keboola UI for everyday work (vision)

The endgame: the operator's daily Keboola interaction happens **here**,
not on `connection.keboola.com`. They open the local UI in the morning,
see overnight agent results, ask Kai a question, run a SQL workspace,
review job failures — without ever opening the official UI. Power users
keep the official UI for the things this UI doesn't cover; everyone
else lives here, with their own agents that know their projects.

## Capabilities

### REST API (`/api/*` after BFF, `/` directly on serve)

150+ endpoints, one router per kbagent service area:

| Surface | Routes | What it covers |
|---|---|---|
| `/projects` | CRUD, status, `use`, info, description | All `kbagent project *` commands |
| `/configs` | list, search, detail, update (dry-run / merge / set-paths), variables, metadata, rows, OAuth URL | All `kbagent config *` commands |
| `/components` | list (AI-assisted), detail, scaffold | Component catalog browsing |
| `/storage/{buckets,tables,files,…}` | CRUD, upload, **synchronous data preview**, async download, swap, describe, columns | All `kbagent storage *` commands |
| `/jobs` | list, detail, run (with `--wait`), terminate, **SSE log stream** | All `kbagent job *` commands |
| `/branches` | lifecycle (create/use/reset/delete/merge), metadata | All `kbagent branch *` commands |
| `/workspaces` | CRUD, password reset, load tables, **SQL query** | All `kbagent workspace *` commands |
| `/flows` `/schedules` | CRUD, schedules, find by cron / inactivity | All `kbagent flow|schedule *` |
| `/lineage` | sharing graph, deep-lineage `build` + `show` | `lineage *` + `sync pull` wrapper |
| `/sharing` | share/unshare/link/unlink | `kbagent sharing *` |
| `/data-apps` | CRUD, deploy, start/stop, **secrets** | `kbagent data-app *` |
| `/mcp/tools` | list, schema, **call** (multi-project) | `kbagent tool *` |
| `/kai/*` | ping, ask, chat, history | `kbagent kai *` |
| `/encrypt` | encrypt secret values | `kbagent encrypt values` |
| `/search` | textual + config-based cross-project search | `kbagent search` |
| `/org` `/members` | bulk org setup, invite, remove, role (manage token) | `kbagent org|project member-* *` |
| `/agents` | **scheduled tasks** CRUD, run-now, history, cron preview, ad-hoc test | NEW (no CLI counterpart yet) |
| `/health` `/version` `/changelog` `/doctor` | readiness, version info, doctor checks | Top-level CLI commands |

Auto-generated OpenAPI spec at `/openapi.json`, Swagger UI at `/docs`.

### Streaming endpoints (Server-Sent Events)

- `/jobs/{project}/{job_id}/stream` — live job status transitions + log tail.
- (designed-for, not yet wired) `/branches/{project}/reset/stream`,
  `/lineage/build/stream`, `/kai/chat/stream`.

### Agent scheduler

A single asyncio coroutine, started on FastAPI lifespan, that ticks
every minute and dispatches due tasks. State lives in the resolved
config directory:

- `<config_dir>/agents.json` — task definitions (mode 0600).
- `<config_dir>/agent_runs/<task_id>.jsonl` — append-only run history.

croniter parses the cron expression. Each task records `last_run_at`
and `next_run_at` so re-runs after restarts pick up where they left off.

### Web UI (`web/frontend`)

A NERD-themed React SPA that drives the API:

- **Dashboard** — greeting, big Kai chat input, stat tiles (projects /
  agents / doctor / recent jobs), scheduled-agent activity, suggested
  next steps, recent jobs panel.
- **Projects, Branches, Doctor, Changelog** — manage local config and
  health.
- **Configs, Components (AI search), Storage (with per-column data
  preview), Jobs (cards layout + SSE log stream), Search** — browse a
  selected project.
- **SQL Workspaces** — info Drawer with credentials + actions sidebar;
  Open SQL Editor opens a Monaco editor with a clickable Storage
  Explorer tree on the left.
- **Flows** — visual Mermaid builder of phase DAG + per-phase task list.
- **Schedules** — cross-project cron list + find-by-window query.
- **Data Apps** — list, start/stop, secrets, validate-repo.
- **Lineage** — Sharing graph (live, cross-project) + Deep lineage (UI
  triggers `sync pull` + `lineage build`, then renders the JSON cache).
- **MCP Tools** — tile grid; click a tool to open a runner Drawer with
  pre-filled required-param skeleton from the tool's input schema.
- **Kai Chat** — chat history scoped to the current project.
- **Agent Tasks** — cron-scheduled tasks (CLI / MCP / AI agent), with
  run-now, run history with AI-response/stdout panels, and an ad-hoc
  "Test now" button on the create form (runs through `/agents/test`,
  same code path as the scheduler, no persistence).
- **Org Setup, Members, Encrypt** — admin / write actions that need a
  Manage API token. The UI prompts for it per-action via a hidden modal,
  forwards as `X-Manage-Token` for that one request, never persists.

## Architecture

Three processes, three languages, one HTTP/JSON contract between each
pair. The boundary is intentional — you can swap any tier without
touching the others.

### Tier 1 — `kbagent serve` (Python, FastAPI)

`src/keboola_agent_cli/server/`:

```
__init__.py        FastAPI app factory, lifespan that starts the scheduler
auth.py            BearerAuthMiddleware (random token on startup)
dependencies.py    ServiceRegistry — singleton holding every kbagent service
agents_store.py    AgentTask / AgentRun + JSON file persistence
agent_runner.py    cron loop + per-action-type dispatch + subprocess env
sse.py             SSE helpers
routers/           one file per service area (jobs.py, storage.py, …)
```

Reuses *every* existing kbagent service unchanged — services already
return JSON-friendly dicts because the CLI's `--json` mode demanded it.

### Tier 2 — Node BFF (TypeScript, Fastify)

`web/backend/`:

```
src/server.ts      Fastify entry — listens on :8000
src/proxy.ts       /api/* → kbagent serve, attaches Bearer token, SSE pass-through
src/config.ts      reads KBAGENT_SERVE_URL + KBAGENT_SERVE_TOKEN from env
```

No business logic. The Bearer token never leaves this process; the
browser never sees it.

### Tier 3 — React UI (TypeScript, Vite)

`web/frontend/`:

```
src/api/client.ts          fetch wrapper + SSE subscriber
src/state.tsx              React Context for active project / branch / page
src/types.ts               TypeScript shapes mirroring server responses
src/layout/                Shell, Sidebar, TopBar (project + branch picker), StatusBar
src/components/            Drawer, DataTable, JsonView, Empty, ManageTokenModal
src/pages/                 one file per area (Dashboard, Storage, Jobs, …)
src/App.tsx                state-driven router (no react-router)
```

Tailwind for styling, TanStack Query for fetching, Monaco for SQL,
Mermaid for graphs.

## How to run

### Requirements

- Python 3.12+ with the optional `server` extra:
  ```bash
  uv pip install -e ".[server]"
  ```
- Node 20+ for the BFF and frontend:
  ```bash
  make web-install
  ```

### One command (recommended for development)

```bash
CONFIG_DIR=/path/to/.kbagent make web-dev
```

Spawns kbagent serve, the Node BFF, and Vite in a single foreground
process. Output is line-prefixed (`[serve]`, `[bff]`, `[vite]`); Ctrl+C
stops everything. Open <http://localhost:5173>.

### Three terminals (HMR per tier)

```bash
# Terminal 1 — kernel
uv run kbagent serve --port 8001 --config-dir /path/to/.kbagent
# copy the printed token

# Terminal 2 — BFF
cd web/backend
KBAGENT_SERVE_TOKEN=<token> PORT=8000 npm run dev

# Terminal 3 — frontend
cd web/frontend
npm run dev
```

### Production-ish (no Vite)

```bash
make web-build
uv run kbagent serve --port 8001 --config-dir ~/.config/keboola-agent-cli &
cd web/backend
STATIC_DIR=../frontend/dist KBAGENT_SERVE_TOKEN=<token> PORT=8000 npm start
```

The BFF then serves the React build statically and proxies `/api/*`.

## Key concepts

### Bearer token at startup

`kbagent serve` mints a random 32-byte URL-safe token on every start
(unless `KBAGENT_SERVE_TOKEN` is pre-exported), prints it once to
stdout, and refuses any request that does not present it as
`Authorization: Bearer <token>`. Public paths: `/health/ping`,
`/health/auth-info`, `/openapi.json`, `/docs`, `/redoc`.

### Manage tokens are per-request

Operations that need a Keboola Manage API token (`org setup`,
`project invite`, `member-set-role`) read it from an `X-Manage-Token`
header, use it for that single request, and discard it. The token is
never logged, never stored, and the env-var fallback that the CLI has
(`--allow-env-manage-token`) is not exposed by the server.

### Agents call back via `kbagent http`

When the scheduler spawns an AI agent (`claude -p …`), it overlays
three env vars onto the child process:

- `KBAGENT_CONFIG_DIR` — same config the serve uses, so any `kbagent
  <cmd>` the AI runs sees the same projects + tokens + active branches.
- `KBAGENT_SERVE_URL` — `http://127.0.0.1:8001`.
- `KBAGENT_SERVE_TOKEN` — the bearer token.

Plus a short instruction prefix is prepended to the user's prompt
telling the AI: "you can call this serve via `kbagent http get /…` —
that is the preferred path because it shares state with this very
process, instead of forking a CLI tree against possibly stale config."

This is what lets a midnight agent task do meaningful work: it has
the same view of Keboola the operator does, it can call any of the
150 endpoints, and its full response (including any tools it called)
is captured into the run history.

### State on disk

Everything the server persists lives under one config directory
(resolved via `--config-dir`, `KBAGENT_CONFIG_DIR`, or the standard
walk-up rules from `config_store.py`):

```
<config_dir>/
  config.json                projects + tokens + permissions (mode 0600)
  agents.json                scheduled tasks (mode 0600)
  agent_runs/
    <task_id>.jsonl          append-only run history
```

Nothing else. No database, no cache that survives restart, no shared
state with other serve instances. Multiple serves on different ports
(or different config dirs) are independent — no leader election, no
coordination. That is intentional for now: the singleton model fits
the personal-control-plane vision; multi-tenant comes later if at all.

## Where to look next

- `src/keboola_agent_cli/commands/serve.py` — CLI entry point, argv parsing.
- `src/keboola_agent_cli/server/__init__.py` — `create_app()` + lifespan.
- `src/keboola_agent_cli/server/agent_runner.py` — scheduler + dispatch.
- `src/keboola_agent_cli/server/routers/agents.py` — agent-tasks API.
- `src/keboola_agent_cli/commands/http_client.py` — `kbagent http` subcommand
  used by AI subprocesses to call the live serve.
- `web/README.md` — frontend-specific quickstart.
- `tests/test_server_smoke.py` — minimal end-to-end check that the
  app builds and routes resolve.
{% endraw %}
