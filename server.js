const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, ".env");
    const source = fsSync.readFileSync(envPath, "utf8");
    source.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index <= 0) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch {
    // No .env file present; continue with existing env vars.
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 8000);
const ROOT_DIR = __dirname;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function sanitizePath(urlPath) {
  const normalized = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  return normalized;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

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

async function handleBuddyChat(req, res) {
  if (!ANTHROPIC_API_KEY) {
    sendJson(res, 500, {
      error: "ANTHROPIC_API_KEY is missing. Add it to your environment before starting the server.",
    });
    return;
  }

  try {
    const raw = await readRequestBody(req);
    const parsed = raw ? JSON.parse(raw) : {};
    const messages = toAnthropicMessages(parsed.messages);

    if (!messages.length) {
      sendJson(res, 400, { error: "No valid messages provided." });
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
      sendJson(res, 502, { error: message });
      return;
    }

    const reply =
      Array.isArray(result?.content) && typeof result.content[0]?.text === "string"
        ? result.content[0].text
        : "";

    sendJson(res, 200, { reply });
  } catch (error) {
    sendJson(res, 500, { error: "Chat server error." });
  }
}

async function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = sanitizePath(requestPath.split("?")[0]);
  const absolutePath = path.join(ROOT_DIR, safePath);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(absolutePath);
    const filePath = stat.isDirectory() ? path.join(absolutePath, "index.html") : absolutePath;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const body = await fs.readFile(filePath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  if (req.url === "/api/buddy-chat" && req.method === "POST") {
    await handleBuddyChat(req, res);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Pigeon server running at http://localhost:${PORT}`);
});
