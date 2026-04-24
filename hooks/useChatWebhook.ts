'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatMessage, ChatRequestPayload } from '@/lib/chat';
import { createId, parseWebhookResponse } from '@/lib/chat';

const SESSION_STORAGE_KEY = 'support-ai-demo-session-id';
const WEBHOOK_OVERRIDE_KEY = 'support-ai-demo-webhook-override';
const DEBUG_ENABLED_KEY = 'support-ai-demo-debug';

interface SendMessageArgs {
  text: string;
  history: ChatMessage[];
}

export function useChatWebhook() {
  const [sessionId, setSessionId] = useState('');
  const [webhookOverride, setWebhookOverrideState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [lastPayload, setLastPayload] = useState<ChatRequestPayload | null>(null);
  const [lastResponse, setLastResponse] = useState<unknown>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      setSessionId(existing);
    } else {
      const id = createId();
      localStorage.setItem(SESSION_STORAGE_KEY, id);
      setSessionId(id);
    }

    const override = localStorage.getItem(WEBHOOK_OVERRIDE_KEY);
    if (override) setWebhookOverrideState(override);

    setDebugEnabled(localStorage.getItem(DEBUG_ENABLED_KEY) === 'true');
  }, []);

  const webhookUrl = useMemo(
    () => webhookOverride.trim() || process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL?.trim() || '',
    [webhookOverride]
  );

  const setWebhookOverride = useCallback((value: string) => {
    setWebhookOverrideState(value);
    if (value.trim()) {
      localStorage.setItem(WEBHOOK_OVERRIDE_KEY, value.trim());
      return;
    }
    localStorage.removeItem(WEBHOOK_OVERRIDE_KEY);
  }, []);

  const toggleDebug = useCallback((value: boolean) => {
    setDebugEnabled(value);
    localStorage.setItem(DEBUG_ENABLED_KEY, String(value));
  }, []);

  const sendMessage = useCallback(
    async ({ text, history }: SendMessageArgs) => {
      const message = text.trim();
      if (!message) return null;

      const activeSessionId =
        sessionId ||
        (() => {
          const id = createId();
          localStorage.setItem(SESSION_STORAGE_KEY, id);
          setSessionId(id);
          return id;
        })();

      setError(null);
      setIsLoading(true);
      setLastUserMessage(message);

      const payload: ChatRequestPayload = {
        sessionId: activeSessionId,
        message,
        history: history.map(({ role, content }) => ({ role, content })),
        metadata: {
          source: 'demo-chat-ui',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href
        }
      };

      setLastPayload(payload);
      console.log('[Support AI Demo] Sending webhook request', payload); // n8n webhook call payload log

      try {
        // n8n webhook is called here (or mock fallback if no URL is configured)
        if (!webhookUrl) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          const mock = { reply: `Mock mode reply: you said \"${message}\".` };
          setLastResponse(mock);
          return { reply: parseWebhookResponse(mock), raw: mock };
        }

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        let data: unknown;

        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          console.error('[Support AI Demo] Webhook error response', response.status, data);
          throw new Error(`Webhook returned ${response.status}.`);
        }

        setLastResponse(data);
        console.log('[Support AI Demo] Webhook success', data);

        return { reply: parseWebhookResponse(data), raw: data };
      } catch (err) {
        const message =
          err instanceof TypeError
            ? 'Failed to fetch webhook. Check URL, CORS, network access, and whether the n8n workflow is active.'
            : err instanceof Error
              ? err.message
              : 'Unexpected webhook error.';
        setError(message);
        console.error('[Support AI Demo] Failed to call webhook', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, webhookUrl]
  );

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null),
    lastUserMessage,
    retryAvailable: Boolean(lastUserMessage),
    sessionId,
    webhookUrl,
    webhookOverride,
    setWebhookOverride,
    lastPayload,
    lastResponse,
    debugEnabled,
    toggleDebug
  };
}
