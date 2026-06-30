---
title: Kai (AI Assistant)
permalink: /cli/commands/kai/
---

* TOC
{:toc}

Requires the project to be added with its **master ('owner') Storage API token** -- the auto-generated owner token, not a custom one. Custom tokens cannot access Kai. Also requires the `agent-chat` feature flag on the project. Use `kai preflight` to verify both conditions without raising.
## kai ping

```
kbagent kai ping [--project NAME]
```

check Kai server health and MCP connection status. Fails with KAI_NOT_ENABLED if the agent-chat feature is missing or the token is not a master token

## kai preflight

```
kbagent kai preflight [--project NAME]
```

inspect token readiness WITHOUT raising. Returns `{ok, is_master_token, has_agent_chat_feature, token_description, error}`. Use this in UIs and automation pre-flight checks instead of `ping`

## kai ask

```
kbagent kai ask --message "question" [--project NAME]
```

one-shot question to Kai, collects full response

## kai chat

```
kbagent kai chat --message "msg" [--chat-id ID] [--project NAME]
```

send message in a chat session, returns chat_id for continuation

## kai chat-detail

```
kbagent kai chat-detail --chat-id ID [--project NAME]
```

fetch full transcript of one chat as a flat `[{role, content, created_at}]` list. Tool calls and non-text parts skipped. Use to restore / export a conversation

## kai history

```
kbagent kai history [--project NAME] [--limit N]
```

list recent Kai chat sessions (default limit: 10)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [kai workflow](/cli/guides/kai-workflow/)
