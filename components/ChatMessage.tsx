'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/chat';

interface Props {
  message: ChatMessageType;
  onCopy?: (content: string) => void;
}

export function ChatMessage({ message, onCopy }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-[75%] ${
          isUser
            ? 'bg-brand-primary text-white'
            : 'border border-emerald-100 bg-white text-slate-800'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`mt-2 flex items-center justify-between gap-3 text-xs ${isUser ? 'text-emerald-100' : 'text-brand-muted'}`}>
          <time dateTime={message.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
          {!isUser && onCopy && (
            <button
              type="button"
              onClick={() => onCopy(message.content)}
              className="rounded px-2 py-0.5 hover:bg-emerald-50"
              aria-label="Copy assistant message"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
