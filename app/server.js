import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as airtable from "./src/services/airtable.js";
import * as gemini from "./src/services/gemini.js";
import * as dialog360 from "./src/services/dialog360.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    airtable: airtable.isLive() ? "live" : "mock",
    gemini: gemini.isLive() ? "live" : "mock",
    dialog360: dialog360.isLive() ? "live" : "mock",
  });
});

app.get("/api/contacts", async (req, res) => {
  try {
    const result = await airtable.listContacts();
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) return res.status(400).json({ error: "contact is required" });
    const result = await gemini.generateMessage(contact);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post("/api/send", async (req, res) => {
  try {
    const { contact, message } = req.body;
    if (!contact || !message) {
      return res.status(400).json({ error: "contact and message are required" });
    }
    const result = await dialog360.sendMessage(contact, message);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Runs the full pipeline for one contact: Airtable lookup (already in hand from
// the client) -> Gemini generate -> 360dialog send. Mirrors the Make.com scenario.
app.post("/api/run", async (req, res) => {
  const { contact } = req.body;
  if (!contact) return res.status(400).json({ error: "contact is required" });

  const steps = [];
  try {
    const generated = await gemini.generateMessage(contact);
    steps.push({ step: "generate", ...generated });

    const sent = await dialog360.sendMessage(contact, generated.message);
    steps.push({ step: "send", ...sent });

    res.json({ ok: true, steps });
  } catch (err) {
    steps.push({ step: "error", error: err.message });
    res.status(502).json({ ok: false, steps });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`paai sandbox running at http://localhost:${port}`);
});
