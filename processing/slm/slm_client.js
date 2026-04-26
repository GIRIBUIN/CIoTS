const SLM_ENDPOINT = process.env.SLM_ENDPOINT || "http://localhost:11434";
const SLM_MODEL    = process.env.SLM_MODEL    || "gemma4:e4b";
const SLM_TIMEOUT  = Number(process.env.SLM_TIMEOUT_MS) || 30000;

async function callSlm(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SLM_TIMEOUT);
  try {
    const res = await fetch(`${SLM_ENDPOINT}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: SLM_MODEL, prompt, stream: false }),
      signal: controller.signal
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text = (json?.response ?? "").trim();
    return text.length > 0 ? text : null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { callSlm };
