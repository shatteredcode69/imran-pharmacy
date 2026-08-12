import { useState } from 'react';
import { ArrowLeft, KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function SettingsPage({ onBack }) {
  const changePassword = useAuthStore((s) => s.changePassword);
  const lock = useAuthStore((s) => s.lock);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text }
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (next.length < 4) {
      setMessage({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }
    if (next !== confirm) {
      setMessage({ type: 'error', text: "New passwords don't match." });
      return;
    }

    setSubmitting(true);
    const success = await changePassword(current, next);
    setSubmitting(false);

    if (success) {
      setCurrent('');
      setNext('');
      setConfirm('');
      setMessage({ type: 'success', text: 'Password updated.' });
    } else {
      setMessage({ type: 'error', text: 'Current password is incorrect.' });
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-pharma-100 bg-surface-light px-3 py-2 text-sm font-medium text-pharma-700 transition-colors hover:bg-pharma-50 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-200"
      >
        <ArrowLeft size={14} />
        Back to app
      </button>

      <section className="rounded-xl2 border border-pharma-100 bg-surface-light p-5 shadow-card dark:border-pharma-700 dark:bg-surface-dark">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pharma-50 text-pharma-700 dark:bg-pharma-700/10 dark:text-pharma-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-pharma-900 dark:text-pharma-50">Security</p>
            <p className="text-xs text-pharma-500 dark:text-pharma-300">
              Manage the password that protects this app on this device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-pharma-600 dark:text-pharma-300">
              Current password
            </label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-pharma-600 dark:text-pharma-300">
              New password
            </label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
              placeholder="At least 4 characters"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-pharma-600 dark:text-pharma-300">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
            />
          </div>

          {message && (
            <p
              className={`text-xs font-medium ${
                message.type === 'error' ? 'text-rx-amber' : 'text-pharma-600 dark:text-pharma-300'
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-pharma-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-pharma-600 disabled:opacity-50 transition-colors"
          >
            <KeyRound size={15} />
            Update password
          </button>
        </form>
      </section>

      <section className="rounded-xl2 border border-pharma-100 bg-surface-light p-5 shadow-card dark:border-pharma-700 dark:bg-surface-dark">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pharma-900 dark:text-pharma-50">Lock now</p>
            <p className="text-xs text-pharma-500 dark:text-pharma-300">
              Immediately require the password again — useful before handing the device to someone else.
            </p>
          </div>
          <button
            type="button"
            onClick={lock}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-pharma-100 dark:border-pharma-700 px-3 py-2 text-sm font-medium text-pharma-700 dark:text-pharma-200 hover:bg-pharma-50 dark:hover:bg-pharma-700/40 transition-colors"
          >
            <LogOut size={15} />
            Lock
          </button>
        </div>
      </section>

      <p className="text-center text-[11px] text-pharma-500 dark:text-pharma-300">
        This password protects the app screen on this device. It's stored locally and isn't
        connected to a server, so treat it as a privacy lock rather than bank-grade security.
      </p>
    </div>
  );
}
