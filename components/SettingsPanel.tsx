'use client';

interface Props {
  open: boolean;
  onClose: () => void;
  webhookOverride: string;
  onChangeWebhook: (value: string) => void;
  envWebhookUrl: string;
  debugEnabled: boolean;
  onToggleDebug: (enabled: boolean) => void;
}

export function SettingsPanel({
  open,
  onClose,
  webhookOverride,
  onChangeWebhook,
  envWebhookUrl,
  debugEnabled,
  onToggleDebug
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm text-brand-muted hover:bg-slate-100">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="webhook-url" className="text-sm font-medium">
              Override webhook URL
            </label>
            <input
              id="webhook-url"
              type="url"
              value={webhookOverride}
              onChange={(event) => onChangeWebhook(event.target.value)}
              placeholder="https://your-n8n-domain.com/webhook/support-ai-demo"
              className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
            <p className="text-xs text-brand-muted">Leave empty to use NEXT_PUBLIC_CHAT_WEBHOOK_URL from environment.</p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-xs text-brand-muted">
            <div className="font-medium text-slate-700">Environment webhook URL</div>
            <div className="mt-1 break-all">{envWebhookUrl || 'Not configured'}</div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={debugEnabled}
              onChange={(event) => onToggleDebug(event.target.checked)}
              className="h-4 w-4 rounded border-emerald-200"
            />
            Enable debug panel
          </label>
        </div>
      </div>
    </div>
  );
}
