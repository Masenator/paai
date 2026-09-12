# WhatsApp Business API Automation (Make.com + 360dialog)

## 1. Objective

Set up an automated WhatsApp messaging workflow in Make.com using 360dialog (WhatsApp Business API BSP) to send automated outbound messages.

## 2. Tech Stack

- **Automation:** Make.com (Airtable → Gemini → 360dialog)
- **WhatsApp API Provider:** 360dialog
- **Phone Provider:** Twilio (UK number)

## 3. Key Issues Resolved

### Meta Error #131037 (Display Name Block)

Meta blocks fake `555` test numbers from sending messages until display names are manually approved. Switching to a real phone number bypasses this restriction and unlocks immediate outbound messaging.

### Twilio SMS Delivery Failure

A2P 10DLC and carrier regulatory bundles blocked SMS verification texts from reaching Twilio.

### Voice Intercept Trap Implementation

Bypassed SMS requirements by configuring a Twilio TwiML Bin to automatically answer and record Meta's verification phone call:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Record maxLength="20" />
</Response>
```

**Twilio UI configuration:** Communications → Numbers & Senders → Inventory → Voice Configuration (Edit details) → map "Handling for incoming calls" to the TwiML Bin above.

**Number selection:** Selected a UK Twilio number (`+44`) for local trust and branding for the UK market.

## 4. Current Active State & Next Steps

1. **Retrieve verification PIN** — Listen to the recorded voice call in Twilio → Monitor → Call Logs.
2. **Verify number** — Submit the 6-digit PIN into 360dialog / Meta.
3. **Generate API key** — Copy the newly generated 360dialog API key.
4. **Update Make.com** — Create a new 360dialog connection in the Make scenario using the new API key and run the test scenario.
