const modeBar = document.getElementById("modeBar");
const tbody = document.querySelector("#contactsTable tbody");
const selectedContactEl = document.getElementById("selectedContact");
const logEl = document.getElementById("log");

async function loadHealth() {
  const health = await fetch("/api/health").then((r) => r.json());
  modeBar.innerHTML = Object.entries(health)
    .map(([service, mode]) => `<span class="badge ${mode}">${service}: ${mode}</span>`)
    .join("");
}

async function loadContacts() {
  const { contacts } = await fetch("/api/contacts").then((r) => r.json());
  tbody.innerHTML = contacts
    .map(
      (c) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.topic}</td>
        <td>${c.lastContacted || "—"}</td>
        <td><button data-id="${c.id}">Run pipeline</button></td>
      </tr>`
    )
    .join("");

  tbody.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contact = contacts.find((c) => c.id === btn.dataset.id);
      runPipeline(contact, btn);
    });
  });
}

function renderStep(step) {
  const div = document.createElement("div");
  div.className = "log-step" + (step.step === "error" ? " error" : "");
  const title = step.step === "error" ? "Error" : `${step.step} (${step.mode})`;
  div.innerHTML = `<div class="step-title"><span>${title}</span></div><pre></pre>`;
  div.querySelector("pre").textContent = JSON.stringify(step, null, 2);
  return div;
}

async function runPipeline(contact, btn) {
  btn.disabled = true;
  selectedContactEl.textContent = `Running pipeline for ${contact.name}...`;
  logEl.innerHTML = "";

  try {
    const result = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    }).then((r) => r.json());

    result.steps.forEach((step) => logEl.appendChild(renderStep(step)));
    selectedContactEl.textContent = result.ok
      ? `Done — pipeline completed for ${contact.name}.`
      : `Pipeline failed for ${contact.name}.`;
  } catch (err) {
    logEl.appendChild(renderStep({ step: "error", error: err.message }));
    selectedContactEl.textContent = `Pipeline failed for ${contact.name}.`;
  } finally {
    btn.disabled = false;
  }
}

loadHealth();
loadContacts();
