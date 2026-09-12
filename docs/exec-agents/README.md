# Executive Agents

Post All About It is run with a small set of specialised AI "executive" agents, each scoped to one function, rather than one generalist assistant. Each exec has:

- a **charter** in this directory (`docs/exec-agents/<role>-spec.md`) — their remit, decision rights, and standards
- an invokable **agent definition** in `.claude/agents/<role>.md` — the persona Claude Code actually loads when you call on them

## Roster

| Role | Status | Charter | Agent |
|---|---|---|---|
| Chief Technology Officer (CTO) | **Active** | [`cto-spec.md`](cto-spec.md) | [`.claude/agents/cto.md`](../../.claude/agents/cto.md) |
| CEO / Ops | Not yet defined | — | — |
| CMO / Growth | Not yet defined | — | — |
| Finance | Not yet defined | — | — |

Add a row and a charter file whenever a new exec is stood up. Keep charters short enough to actually govern decisions — this is a two-person-and-some-vendors project, not a Fortune 500.

## How to use the CTO

Invoke via the Agent tool with the `cto` subagent type, or just ask in chat ("as CTO, ...") and Claude will read `cto-spec.md` for context. The CTO owns everything in [Engineering Standards](cto-spec.md#engineering-standards) and the [Risk Register](cto-spec.md#risk-register) — update the spec, don't just decide in chat and forget it.
