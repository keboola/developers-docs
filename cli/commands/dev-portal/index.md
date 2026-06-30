---
title: Developer Portal
permalink: /cli/commands/dev-portal/
---

* TOC
{:toc}

Talks to `apps-api.keboola.com`. **Reads are unrestricted; writes always require a human to type a random hex code on a real TTY (no `--yes`, no env bypass, exit 6 on non-TTY).** Use `--dry-run` for the agent-safe preview path.

`--role-hint` is **load-bearing** for `dev-portal patch` (since v0.51.1): `vendor` (default) → `PATCH /vendors/{vendor}/apps/{app}` (restricted schema, the common case); `admin` → `PATCH /admin/apps/{app}` (permissive schema, the only way to set `complexity`, `categories`, `category`, `features`, `forwardToken`, `forwardTokenDetails`, `injectEnvironment`, `processTimeout`, `requiredMemory`). A `vendor` identity with any of those 9 fields in the payload fails fast at preflight with the exact command to switch.

`--password-stdin` (since v0.51.1) works in both TTY mode (hidden line-based prompt, Enter to confirm) and pipe mode (`echo $PASS | … --password-stdin`, reads to EOF).

MFA login (since v0.51.1) sends `challenge: SOFTWARE_TOKEN_MFA` explicitly to fix a 404 on personal-account TOTP logins where the apps-api server silently rejects missing-challenge requests despite the spec calling it optional. Single attempt only; failure surfaces the actual server body with a stale-TOTP hint.

### Identity management
## dev-portal identity add

```
kbagent dev-portal identity add --alias A --username U [--password P | --password-stdin] [--role-hint vendor|admin] [--vendor V] [--portal-url URL]
```

store a portal login credential per-alias in `config.json` (0600 perms). `--role-hint` is validated (`vendor`/`admin`, case-folded) since v0.51.1.

## dev-portal identity list

```
kbagent dev-portal identity list
```

list stored portal identities (no passwords shown).

## dev-portal identity remove

```
kbagent dev-portal identity remove --alias A
```

delete an identity alias.

## dev-portal identity edit

```
kbagent dev-portal identity edit --alias A [--username U] [--password P|--password-stdin] [--role-hint H] [--vendor V] [--new-alias N]
```

update fields of an identity.

## dev-portal identity use

```
kbagent dev-portal identity use ALIAS
```

set the default identity for subsequent commands.

## dev-portal identity current

```
kbagent dev-portal identity current
```

show the active default identity alias.

## dev-portal identity verify

```
kbagent dev-portal identity verify [--identity A]
```

test credentials against the portal (login + logout).


### Read commands (unrestricted; agent-friendly)
## dev-portal list

```
kbagent dev-portal list --vendor V [--identity A]
```

list all apps registered under a vendor. Useful for peer-config research.

## dev-portal get

```
kbagent dev-portal get --app VENDOR.APP_ID [--identity A]
```

fetch the full portal entry for one component (uiOptions, encryption, defaultBucket, configurationSchema, icon, etc.).


### Write commands (require TTY random-code confirm; use `--dry-run` first)
## dev-portal create

```
kbagent dev-portal create --vendor V --data FILE [--identity A] [--dry-run]
```

register a new component from a JSON payload file.

## dev-portal patch

```
kbagent dev-portal patch --app VENDOR.APP_ID (--data FILE | --property KEY (--value V | --value-file F)) [--identity A] [--dry-run]
```

update portal properties. Endpoint depends on the identity's `role_hint`: vendor → vendor endpoint, admin → admin endpoint.

## dev-portal upload-icon

```
kbagent dev-portal upload-icon --app VENDOR.APP_ID --file PATH [--identity A] [--dry-run]
```

upload a PNG/SVG icon.

## dev-portal publish

```
kbagent dev-portal publish --app VENDOR.APP_ID [--identity A] [--dry-run]
```

publish the component (makes it visible in the UI).

## dev-portal deprecate

```
kbagent dev-portal deprecate --app VENDOR.APP_ID [--identity A] [--dry-run]
```

mark the component as deprecated.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [dev-portal workflow](/cli/guides/dev-portal-workflow/)
