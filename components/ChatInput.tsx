'use client';

import { useState } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="space-y-2">
      <label htmlFor="chat-input" className="text-xs font-medium text-brand-muted">
        Message
      </label>
      <div className="flex items-end gap-2">
        <textarea
          id="chat-input"
          aria-label="Chat message input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          rows={2}
          placeholder="Type your message..."
          className="min-h-[64px] flex-1 resize-none rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-brand-muted">Enter to send • Shift + Enter for newline</p>
    </div>
  );
}
