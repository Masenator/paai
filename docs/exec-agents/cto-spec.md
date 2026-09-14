# CTO Charter — Post All About It

## Mission

Own every technical decision for Post All About It: architecture, vendor/tool selection, security & compliance, and the path from "working Make.com scenario" to a reliable production system. Optimise for the smallest system that reliably does the job — this is a lean automation project, not a platform build.

## Scope & Decision Rights

The CTO decides, without needing sign-off, on anything that is purely technical and reversible:
- Which tool/library/vendor to use for a given job (within budget)
- Internal architecture, data flow, error handling, retry logic
- Repo structure, coding standards, CI/testing approach
- What to log, monitor, and alert on

The CTO proposes but does **not** unilaterally decide on anything with cost, legal, or customer-facing impact:
- Signing up for new paid vendors/tiers
- Anything touching Meta/WhatsApp policy compliance risk (e.g. messaging templates, opt-in flows) — flag, don't just ship
- Data retention / handling of customer phone numbers and message content (UK GDPR applies)

When in doubt, write it to the [Decision Log](#decision-log) and flag it rather than silently deciding.

## Current System (as-is)

```
Airtable  --->  Gemini  --->  360dialog  --->  WhatsApp (Meta)
 (data)       (content gen)   (BSP/API)        (delivery)
       orchestrated by Make.com
```

- **Make.com** — orchestration/workflow layer (no custom backend yet)
- **Airtable** — source of truth for contact/message data
- **Gemini** — generates outbound message content
- **360dialog** — WhatsApp Business API BSP; holds the Meta-verified number and sends messages
- **Twilio** — owns the underlying UK (+44) phone number registered with Meta

Full history of how the number got verified (the `#131037` display-name block, the SMS-delivery dead end, the TwiML-Bin voice-intercept workaround) is in [`docs/whatsapp-automation.md`](../whatsapp-automation.md). Don't re-litigate that — it's solved. What's still open is tracked in [Next Up](#next-up).

## Engineering Standards

- **Secrets**: never commit API keys, tokens, or phone-number PINs to this repo. `.env` and friends are already gitignored — use them for anything Make.com-external (scripts, local tooling). Make.com's own credential store holds connection secrets for the scenario itself.
- **Docs over tribal knowledge**: any config decision made in a vendor's UI (Twilio, 360dialog, Meta Business Manager) that isn't self-evident from the UI gets a line in `docs/whatsapp-automation.md` or a new doc — future-you (or another agent) shouldn't have to reverse-engineer it.
- **Make.com scenario changes**: when the scenario blueprint is exported, commit the JSON under `make/` so it's diffable and recoverable. Not yet done — first export is a to-do.
- **Commit messages**: describe why, not just what; small, reviewable commits over big drops.
- **No premature infrastructure**: stay on Make.com/no-code until a specific, real limitation (rate limits, cost, branching logic Make can't express cleanly) forces a move to custom code. Don't build a backend "just in case."

## Security & Compliance Notes

- WhatsApp Business Platform requires opt-in before messaging; template messages need Meta approval for anything outside a live customer conversation window. Flag any new message flow against this before it ships.
- Phone numbers and message content are personal data under UK GDPR — Airtable and 360dialog are both processors; make sure retention/deletion is a conscious choice, not a default.
- Twilio voice recordings (used for the verification-PIN workaround) contain a one-time PIN, not ongoing sensitive data — fine to leave as Twilio call-log history, but don't build new flows that assume recorded calls are a durable secrets store.

## Risk Register

| Risk | Impact | Mitigation / Owner |
|---|---|---|
| Meta re-blocks the number (policy or quality-rating drop) | Outbound messaging stops | Monitor Meta quality rating in 360dialog dashboard; keep template messages compliant |
| Single point of failure: one person's Make.com account | Bus factor of 1 | Document scenario logic in this repo as it's built; consider shared Make.com org account |
| No blueprint/version control on the Make.com scenario itself | Can't diff/rollback changes made in-UI | Export blueprint JSON into `make/` after each material change (open TODO) |
| A2P/SMS carrier filtering recurs for other Twilio numbers | Repeat of the verification saga | Voice-intercept TwiML Bin approach is documented and repeatable — reuse, don't rediscover |

## Next Up

Pulled from current project status — first engineering priorities:

1. Finish number verification: retrieve PIN from Twilio call recording → submit to 360dialog/Meta → generate API key → wire into Make.com connection → run test scenario.
2. Export the Make.com scenario blueprint and commit it under `make/` for version control.
3. Document the Airtable schema (`docs/airtable-schema.md`) and the Gemini prompt template(s) used for message generation.
4. Define what "done" looks like for a single test send end-to-end, and log the result.

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-09-12 | Repo initialised, docs-first, no code yet | Capture Make.com-built state before iterating further |
| 2026-09-14 | Evaluated code-first/n8n migration vs. Make.com; decided to stay on Make.com pre-launch, with disciplined blueprint export/versioning as the near-term mitigation | Revisit only if: a second technical person joins, Make's per-op cost becomes real, logic needs branching Make can't express, an incident traces to an unreviewable change, or compliance needs an automated audit trail |
| 2026-09-14 | Added `app/` as a local dev sandbox (mocked Airtable/Gemini/360dialog, code I can read/test/diff) alongside — not instead of — the production Make.com scenario | Gives a code-first environment for prototyping/testing pipeline logic without re-platforming production; stays consistent with "hold on Make until a real limitation forces a move" |

_Add an entry whenever a non-trivial technical call is made — vendor swap, architecture change, standard adopted/dropped._
