# Post All About It

Automated WhatsApp Business messaging for Post All About It, built on Make.com with 360dialog as the WhatsApp Business API provider (BSP).

## Tech Stack

- **Automation:** [Make.com](https://www.make.com) (Airtable → Gemini → 360dialog)
- **WhatsApp API Provider:** [360dialog](https://www.360dialog.com/) (WhatsApp Business API BSP)
- **Phone Provider:** [Twilio](https://www.twilio.com/) (UK number)

## Architecture

```
Airtable  --->  Gemini  --->  360dialog  --->  WhatsApp (Meta)
 (data)       (content gen)   (BSP/API)        (delivery)
```

Twilio provides and hosts the UK phone number used to register with 360dialog/Meta for WhatsApp Business API access.

## Project Status

See [`docs/whatsapp-automation.md`](docs/whatsapp-automation.md) for the current setup log, issues resolved, and next steps.

The Make.com scenario itself is built and maintained directly in Make.com; this repository tracks project documentation, configuration notes, and any supporting code/scripts.

## Local Sandbox

[`app/`](app/README.md) is a local, runnable version of the pipeline (Airtable → Gemini → 360dialog) for development and testing — mocked by default, no credentials required. It's a dev tool, not a replacement for the production Make.com scenario.

## Executive Agents

The project is run with specialised AI executive agents rather than one generalist assistant — see [`docs/exec-agents/`](docs/exec-agents/README.md). Currently active: a **CTO** ([charter](docs/exec-agents/cto-spec.md), [agent](.claude/agents/cto.md)) owning architecture, tooling, and security/compliance calls.
