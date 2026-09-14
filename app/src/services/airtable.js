import { mockContacts } from "../mockData.js";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;

export function isLive() {
  return Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

// Fetches contacts. Falls back to mock data when Airtable credentials aren't set.
export async function listContacts() {
  if (!isLive()) {
    return { mode: "mock", contacts: mockContacts };
  }

  const table = encodeURIComponent(AIRTABLE_TABLE_NAME || "Contacts");
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const contacts = data.records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    phone: record.fields.Phone,
    topic: record.fields.Topic,
    lastContacted: record.fields.LastContacted || null,
  }));

  return { mode: "live", contacts };
}
