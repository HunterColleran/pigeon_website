const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

function toAnthropicMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, 1200),
    }))
    .slice(-12);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!ANTHROPIC_API_KEY) {
    res.status(500).json({
      error: "ANTHROPIC_API_KEY is missing. Add it to your Vercel environment variables.",
    });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const messages = toAnthropicMessages(payload.messages);

    if (!messages.length) {
      res.status(400).json({ error: "No valid messages provided." });
      return;
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 220,
        temperature: 0.8,
        system:
          "You are a friendly internet chat buddy with an early-2000s vibe. Be light and conversational, ask simple follow-up questions, joke around a little, and keep messages short (1-3 sentences). Use plain language and avoid modern corporate tone. Do not mention being an AI. Never reference AIM or AOL. Do not use roleplay/action formatting such as *smiles*, *sends a hug*, or stage directions. Do not pretend to send emojis, stickers, gifts, or reactions. Do not suggest games or activities; stay focused on direct text conversation only.",
        messages,
      }),
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      const message = result?.error?.message || "Anthropic request failed.";
      res.status(502).json({ error: message });
      return;
    }

    const reply =
      Array.isArray(result?.content) && typeof result.content[0]?.text === "string"
        ? result.content[0].text
        : "";

    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "Chat server error." });
  }
};
