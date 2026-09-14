const { DIALOG360_API_KEY, DIALOG360_BASE_URL } = process.env;

export function isLive() {
  return Boolean(DIALOG360_API_KEY);
}

// Sends a WhatsApp message via 360dialog. Falls back to a simulated send
// (no network call, no real message) when no API key is configured.
export async function sendMessage(contact, message) {
  if (!isLive()) {
    await new Promise((resolve) => setTimeout(resolve, 300)); // simulate network latency
    return {
      mode: "mock",
      status: "simulated_sent",
      to: contact.phone,
      message,
    };
  }

  const baseUrl = DIALOG360_BASE_URL || "https://waba-v2.360dialog.io";
  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "D360-API-KEY": DIALOG360_API_KEY,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: contact.phone,
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    throw new Error(`360dialog request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { mode: "live", status: "sent", to: contact.phone, message, response: data };
}
