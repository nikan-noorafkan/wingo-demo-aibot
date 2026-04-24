'use client';

import { useMemo, useState } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useChatWebhook } from '@/hooks/useChatWebhook';
import type { ChatMessage as ChatMessageType } from '@/lib/chat';
import { createId } from '@/lib/chat';

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    sendMessage,
    isLoading,
    error,
    clearError,
    lastUserMessage,
    retryAvailable,
    sessionId,
    webhookUrl,
    webhookOverride,
    setWebhookOverride,
    lastPayload,
    lastResponse,
    debugEnabled,
    toggleDebug
  } = useChatWebhook();

  const envWebhookUrl = process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL?.trim() || '';
  const missingPublicWebhook = !webhookUrl;
  const statusText = useMemo(() => 'Demo mode', []);

  const pushAssistantMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: 'assistant', content, timestamp: new Date().toISOString() }
    ]);
  };

  const handleSend = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessageType = {
      id: createId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);

    const result = await sendMessage({ text: message, history: nextHistory });
    if (result?.reply) {
      pushAssistantMessage(result.reply);
    }
  };

  const resetChat = () => {
    setMessages([]);
    clearError();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-4 md:p-8">
      <header className="mb-6 rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Support AI Demo</h1>
            <p className="mt-1 text-sm text-brand-muted">Webhook-connected chatbot for testing n8n workflows</p>
          </div>
          <span className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-semibold text-slate-700">{statusText}</span>
        </div>
      </header>

      <section className="flex flex-1 flex-col rounded-2xl border border-emerald-100 bg-white p-4 shadow-card md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs text-brand-muted">Session: {sessionId || 'initializing...'}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium hover:bg-emerald-50"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium hover:bg-emerald-50"
            >
              Clear chat
            </button>
          </div>
        </div>

        {missingPublicWebhook && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            No public override is configured. Requests are sent through <code>/api/chat</code>, which can use server-side <code>CHAT_WEBHOOK_URL</code> or return mock replies.
          </div>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-emerald-50/30 p-3">
          {messages.length === 0 && (
            <div className="rounded-xl border border-dashed border-emerald-200 bg-white p-6 text-center text-sm text-brand-muted">
              Start a conversation by sending a message to your n8n webhook.
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onCopy={(content) => navigator.clipboard.writeText(content)}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
              Assistant is typing...
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <div className="font-semibold">Webhook request failed</div>
            <div className="mt-1">{error}</div>
            {retryAvailable && (
              <button
                type="button"
                onClick={() => handleSend(lastUserMessage)}
                disabled={isLoading}
                className="mt-2 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >
                Retry last message
              </button>
            )}
          </div>
        )}

        <footer className="mt-4 border-t border-emerald-100 pt-4">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </footer>

        {debugEnabled && (
          <aside className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <div className="font-semibold">Debug panel</div>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded bg-white p-2">
{JSON.stringify({ webhookUrl, lastPayload, lastResponse }, null, 2)}
            </pre>
          </aside>
        )}
      </section>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        webhookOverride={webhookOverride}
        onChangeWebhook={setWebhookOverride}
        envWebhookUrl={envWebhookUrl}
        debugEnabled={debugEnabled}
        onToggleDebug={toggleDebug}
      />
    </main>
  );
}
