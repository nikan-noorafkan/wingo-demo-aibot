import { NextResponse } from 'next/server';

function normalizeReply(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.reply === 'string') return candidate.reply;
    if (typeof candidate.answer === 'string') return candidate.answer;
    if (typeof candidate.message === 'string') return candidate.message;
  }

  return 'I received a response, but it did not include a usable message.';
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const headerOverride = req.headers.get('x-chat-webhook-override')?.trim() || '';
    const webhookUrl = headerOverride || process.env.CHAT_WEBHOOK_URL?.trim() || '';

    if (!webhookUrl) {
      const fallbackMessage = typeof payload?.message === 'string' ? payload.message : '';
      return NextResponse.json({ reply: `Mock mode reply: you said "${fallbackMessage}".` });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let parsed: unknown = rawText;

    if (rawText.trim()) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = rawText;
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Webhook upstream returned an error.',
          status: response.status,
          details: typeof parsed === 'string' ? parsed : parsed
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: normalizeReply(parsed) });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to process chat request through API proxy.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
