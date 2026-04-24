# Support AI Demo Chatbot (Next.js)

A production-ready demo chatbot UI for testing an AI support agent wired to n8n webhooks.

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Set your webhook URL:

```env
NEXT_PUBLIC_CHAT_WEBHOOK_URL=https://your-n8n-domain.com/webhook/support-ai-demo
```

You can also override the webhook URL from the in-app **Settings** panel for local testing.

## 3) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4) Example n8n payload received from UI

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

## 5) Example n8n response formats supported

```json
{ "reply": "Hello, this is the bot response." }
```

Also supported:

- `{ "answer": "..." }`
- `{ "message": "..." }`
- plain text response body

## 6) Test with a mock webhook

If `NEXT_PUBLIC_CHAT_WEBHOOK_URL` is missing and no URL override is set, the UI enters **Mock mode** automatically and generates fake assistant replies. This lets you test UX states without backend connectivity.

## Features included

- Responsive modern SaaS-style chat UI
- Empty state, loading state, success, error, and retry
- Stable `sessionId` persisted in `localStorage`
- Local conversation state management
- Clear chat/reset control
- Settings modal to override webhook URL
- Input validation + disabled send while loading
- Keyboard shortcuts (Enter to send, Shift+Enter newline)
- Optional debug panel showing last request/response
- Assistant message copy action
- Console logs for webhook debugging

## Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — run production build
- `npm run lint` — lint code
- `npm run typecheck` — run TypeScript checks
