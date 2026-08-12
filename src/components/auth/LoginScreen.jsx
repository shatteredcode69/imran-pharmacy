import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Pill, TriangleAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen() {
  const unlock = useAuthStore((s) => s.unlock);
  const forgotPasswordReset = useAuthStore((s) => s.forgotPasswordReset);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const success = await unlock(password);
    setSubmitting(false);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Incorrect password. Try again.');
      setPassword('');
    }
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
          <h1 className="font-display font-semibold text-lg">Imran Pharmacy</h1>
          <p className="text-xs text-pharma-500 dark:text-pharma-300">Enter the password to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-pharma-100 dark:border-pharma-700 bg-paper-light dark:bg-paper-dark px-3 py-2.5 text-sm outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500"
            placeholder="Password"
          />

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rx-amber">
              <TriangleAlert size={13} />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl2 bg-pharma-500 py-2.5 text-sm font-medium text-white hover:bg-pharma-600 disabled:opacity-50 transition-colors"
          >
            <Lock size={15} />
            Unlock
          </button>
        </div>

        <div className="mt-5 border-t border-pharma-100 dark:border-pharma-700 pt-4 text-center">
          {!confirmingReset ? (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="text-xs text-pharma-500 hover:underline"
            >
              Forgot password?
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-pharma-500 dark:text-pharma-300">
                This clears the saved password on this device only (your catalog, orders, and
                history stay intact). You&apos;ll set a new password right after.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-pharma-600 dark:text-pharma-300 hover:bg-pharma-50 dark:hover:bg-pharma-700/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={forgotPasswordReset}
                  className="rounded-lg bg-rx-amberSoft px-3 py-1.5 text-xs font-medium text-rx-amber hover:bg-rx-amber/20"
                >
                  Reset password
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}