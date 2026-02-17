# Pigeon Website

Marketing site for Pigeon Group Co. and the Pigeon smart pager.

## Quick Start

Open `index.html` in a browser, or run a local server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit [http://localhost:8000](http://localhost:8000).

## Buddy Chat (Anthropic)

The AOL-style Buddy Chat now supports real responses via an API proxy.

1. Create a local env file:

```bash
cp .env.example .env
```

2. Add your Anthropic key in `.env`:

```bash
ANTHROPIC_API_KEY=your_real_key_here
```

3. Start the built-in server:

```bash
npm start
```

4. Visit [http://localhost:8000](http://localhost:8000) and open the Buddy Chat section.

Notes:
- The key is read on the server side only (`server.js`) and is not exposed in browser JS.
- The chat endpoint is `POST /api/buddy-chat`.
- For Vercel deployments, the endpoint is implemented as `api/buddy-chat.js`.

## Structure

- `index.html` — Single-page site
- `css/styles.css` — Design system + layout (Pigeon brand colors, Helvetica Neue)
- `js/main.js` — Scroll animations, mobile menu
- `Pigeon Logos/` — Brand assets

## Design

Based on `pigeon-design-guide.md` — Char (#2A2E31), Concrete (#D3D6DA), Signal Orange (#E87A2F).
