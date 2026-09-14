const { GEMINI_API_KEY, GEMINI_MODEL } = process.env;

export function isLive() {
  return Boolean(GEMINI_API_KEY);
}

function mockMessage(contact) {
  return `Hi ${contact.name.split(" ")[0]}, this is Post All About It reaching out about ${contact.topic}. Let us know if you'd like a hand with anything!`;
}

// Generates outbound WhatsApp copy for a contact. Falls back to a templated
// mock message when no Gemini API key is configured.
export async function generateMessage(contact) {
  if (!isLive()) {
    return { mode: "mock", message: mockMessage(contact) };
  }

  const model = GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Write a short, friendly WhatsApp message (2-3 sentences max) from "Post All About It" to ${contact.name} about ${contact.topic}. No emojis, no markdown, just the message text.`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!message) {
    throw new Error("Gemini response had no usable message text");
  }

  return { mode: "live", message };
}
