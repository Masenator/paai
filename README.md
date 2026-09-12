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
