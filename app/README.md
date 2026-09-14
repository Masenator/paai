# Pipeline Sandbox

A local, runnable version of the Make.com scenario (Airtable → Gemini → 360dialog),
built so the logic can be read, tested, and iterated on as code — something the
Make.com scenario itself doesn't allow. This is a **dev sandbox, not a replacement**
for the production Make.com pipeline; see the CTO decision log for why.

Each of the three services (Airtable, Gemini, 360dialog) runs in **mock mode** by
default — no credentials required, no real messages sent. Set the matching
environment variable(s) in `.env` to switch any single service to live mode; the
others stay mocked independently.

## Run it

```bash
cd app
npm install
npm run dev      # or: npm start
```

Open http://localhost:3000. The mode badges at the top show which services are
live vs. mocked. Pick a contact and click "Run pipeline" to see each stage
(generate → send) execute and log its output.

## Going live

Copy `.env.example` to `.env` and fill in whichever credentials you have:

- `AIRTABLE_API_KEY` + `AIRTABLE_BASE_ID` (+ `AIRTABLE_TABLE_NAME`, default `Contacts`)
- `GEMINI_API_KEY` (+ `GEMINI_MODEL`, default `gemini-2.5-flash`)
- `DIALOG360_API_KEY` (+ `DIALOG360_BASE_URL` if not using the default)

`.env` is gitignored — never commit real keys. Going live on 360dialog will send
a real WhatsApp message, so make sure the contact's opt-in status and message
content are actually compliant before flipping that one on.

## Structure

```
server.js               Express app, wires up the API routes
src/services/
  airtable.js            listContacts() — live/mock switch on AIRTABLE_* vars
  gemini.js               generateMessage() — live/mock switch on GEMINI_API_KEY
  dialog360.js            sendMessage() — live/mock switch on DIALOG360_API_KEY
src/mockData.js          Stand-in contacts used when Airtable isn't live
public/                  Static frontend (vanilla HTML/CSS/JS, no build step)
```
