import { useState } from 'react';
import { Lock, Pill } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function SetPasswordScreen() {
  const setPassword = useAuthStore((s) => s.setPassword);
  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 4) {
      setError('Use at least 4 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    await setPassword(password);
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-light dark:bg-paper-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl2 border border-pharma-100 dark:border-pharma-700 bg-surface-light dark:bg-surface-dark p-6 shadow-card"
      >
        <div className="mb-5 flex flex-col items-center text-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pharma-500 text-white">
            <Pill size={20} strokeWidth={2.25} />
          </span>
          <h1 className="font-display font-semibold text-lg">Set up a password</h1>
          <p className="text-xs text-pharma-500 dark:text-pharma-300">
            This protects Imran Pharmacy on this device. You&apos;ll need this password every time the app is opened.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-pharma-600 dark:text-pharma-300">
              New password
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
              placeholder="At least 4 characters"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-pharma-600 dark:text-pharma-300">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
              placeholder="Type it again"
            />
          </div>

          {error && <p className="text-xs font-medium text-rx-amber">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl2 bg-pharma-500 py-2.5 text-sm font-medium text-white hover:bg-pharma-600 disabled:opacity-50 transition-colors"
          >
            <Lock size={15} />
            Set password &amp; continue
          </button>

          <p className="text-center text-[11px] text-pharma-500 dark:text-pharma-300">
            Choose something Imran will remember — there&apos;s no email recovery, only a full local reset.
          </p>
        </div>
      </form>
    </div>
  );
}
