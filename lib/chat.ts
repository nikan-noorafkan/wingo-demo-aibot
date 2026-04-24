export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface ChatRequestPayload {
  sessionId: string;
  message: string;
  history: Array<Pick<ChatMessage, 'role' | 'content'>>;
  metadata: {
    source: 'demo-chat-ui';
    timestamp: string;
    userAgent: string;
    pageUrl: string;
  };
}

export interface ChatResult {
  reply: string;
  raw: unknown;
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function parseWebhookResponse(data: unknown): string {
  if (typeof data === 'string') return data;

  if (data && typeof data === 'object') {
    const candidate = data as Record<string, unknown>;
    const fields = ['reply', 'answer', 'message'];
    for (const field of fields) {
      if (typeof candidate[field] === 'string') {
        return candidate[field] as string;
      }
    }
  }

  return 'I received a response, but it did not include a usable message.';
}
