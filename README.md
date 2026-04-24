# Support AI Demo Chatbot

A production-ready **Next.js + TypeScript + Tailwind CSS** chatbot UI for testing support-agent flows via an **n8n webhook**.

The frontend sends chat messages to a local Next.js API route (`/api/chat`), and that server route forwards requests to n8n via `CHAT_WEBHOOK_URL`. This avoids direct browser→n8n CORS issues.

## Project overview

- Modern SaaS-style chat UI with branded colors and responsive layout
- Chat states: empty, loading, success, error, retry
- Stable browser `sessionId` persisted in `localStorage`
- Local chat history sent with each webhook request
- Settings modal to override webhook URL during testing
- Automatic **mock mode** fallback when `CHAT_WEBHOOK_URL` is missing
- Debug panel (optional) showing last request payload and last response

## Local architecture

```text
Browser UI  ->  Next.js API route (/api/chat)  ->  n8n webhook
```

This proxy architecture keeps webhook credentials/config server-side and prevents common local CORS failures.

## Local setup

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

Create a local env file:

```bash
cp .env.example .env.local
```

Then set your webhook URL in `.env.local`:

```env
CHAT_WEBHOOK_URL=https://your-n8n-domain.com/webhook/support-ai-demo
```

Production webhook example:

```env
CHAT_WEBHOOK_URL=https://nikan-n8n-f57748e24e-performance.apps.ir-central1.arvancaas.ir/webhook/support-ai-demo
```

### 3) Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## n8n workflow expectation

Recommended n8n flow:

1. **Webhook** (receives chat payload from UI)
2. **Arvan AI Gateway** (processes user message)
3. **Respond to Webhook** (returns final text/JSON reply)

## Request payload sent by UI

```json
{
  "sessionId": "1713966646405-k39af0nd",
  "message": "Hi, I need help with billing",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" },
    { "role": "user", "content": "Hi, I need help with billing" }
  ],
  "metadata": {
    "source": "demo-chat-ui",
    "timestamp": "2026-04-24T12:00:00.000Z",
    "userAgent": "Mozilla/5.0 ...",
    "pageUrl": "http://localhost:3000/"
  }
}
```

## Supported response formats

The UI supports:

- JSON: `{ "reply": "..." }`
- JSON: `{ "answer": "..." }`
- JSON: `{ "message": "..." }`
- Plain text response body

## Troubleshooting

### Failed to fetch

- Confirm `CHAT_WEBHOOK_URL` is set in `.env.local`
- Confirm webhook endpoint is reachable from your Next.js server/network
- Check browser devtools for CORS or blocked network errors

### `webhook-test` vs `webhook`

- n8n test URLs are temporary and often only work while editing/running tests
- Use the production-style path (`/webhook/...`) for stable deployment

### n8n workflow not activated

- Ensure workflow is active/published in n8n
- Confirm `Respond to Webhook` node is present and returns a response

### CORS/network issues

- Direct browser calls to n8n are avoided by default via `/api/chat` proxy
- Ensure your n8n instance is reachable from the Next.js runtime environment
- Check reverse proxy, firewall, TLS certificate, and DNS issues

### Missing webhook URL / mock mode

- If `CHAT_WEBHOOK_URL` is not configured, `/api/chat` returns a mock reply automatically
- This is expected and helps validate UI behavior before backend connectivity

## Deployment (Vercel)

1. Import the GitHub repository into Vercel
2. In Project Settings → Environment Variables, set:
   - `CHAT_WEBHOOK_URL=<your production n8n webhook>`
3. Deploy

## Scripts

- `pnpm dev` — start local development server
- `pnpm lint` — run lint checks
- `pnpm build` — create production build
- `pnpm start` — run production build
