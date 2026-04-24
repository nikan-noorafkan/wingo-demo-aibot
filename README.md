# Support AI Demo Chatbot

A production-ready **Next.js + TypeScript + Tailwind CSS** chatbot UI for testing support-agent flows via an **n8n webhook**.

The frontend sends chat messages to `NEXT_PUBLIC_CHAT_WEBHOOK_URL` and renders the webhook response (JSON or plain text). It does **not** call OpenAI directly.

## Project overview

- Modern SaaS-style chat UI with branded colors and responsive layout
- Chat states: empty, loading, success, error, retry
- Stable browser `sessionId` persisted in `localStorage`
- Local chat history sent with each webhook request
- Settings modal to override webhook URL during testing
- Automatic **mock mode** fallback when webhook URL is missing
- Debug panel (optional) showing last request payload and last response

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
NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-n8n-domain.com/webhook/support-ai-demo
```

Production webhook example:

```env
NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://nikan-n8n-f57748e24e-performance.apps.ir-central1.arvancaas.ir/webhook/support-ai-demo
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

- Confirm the URL in `.env.local` or Settings override is correct
- Confirm webhook endpoint is reachable from your browser/network
- Check browser devtools for CORS or blocked network errors

### `webhook-test` vs `webhook`

- n8n test URLs are temporary and often only work while editing/running tests
- Use the production-style path (`/webhook/...`) for stable deployment

### n8n workflow not activated

- Ensure workflow is active/published in n8n
- Confirm `Respond to Webhook` node is present and returns a response

### CORS/network issues

- Ensure your n8n instance allows requests from your frontend origin
- Check reverse proxy, firewall, TLS certificate, and DNS issues

### Missing webhook URL / mock mode

- If no webhook is configured, UI enters mock mode automatically
- This is expected and helps validate UI behavior before backend connectivity

## Deployment (Vercel)

1. Import the GitHub repository into Vercel
2. In Project Settings → Environment Variables, set:
   - `NEXT_PUBLIC_CHAT_WEBHOOK_URL=<your production n8n webhook>`
3. Deploy

## Scripts

- `pnpm dev` — start local development server
- `pnpm lint` — run lint checks
- `pnpm build` — create production build
- `pnpm start` — run production build
