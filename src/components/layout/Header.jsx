import { Sun, Moon, Pill, History, LayoutList, Wrench, Settings, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ theme, setTheme, orderCount, onCatalog, onHistory, onTools, onSettings, onLock }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-30 border-b border-pharma-100 bg-paper-light/90 backdrop-blur dark:border-pharma-700 dark:bg-paper-dark/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pharma-500 text-white shadow-card">
            <Pill size={18} strokeWidth={2.25} />
          </span>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate font-display text-lg font-semibold tracking-tight">
              Imran Pharmacy
            </h1>
            <p className="text-[11px] font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
              Order Manager
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <nav className="flex items-center rounded-full border border-pharma-100 p-0.5 text-xs font-medium dark:border-pharma-700">
            <button
              type="button"
              onClick={onCatalog}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                currentPath === '/'
                  ? 'bg-pharma-500 text-white'
                  : 'text-pharma-600 hover:bg-pharma-50 dark:text-pharma-300 dark:hover:bg-pharma-700/40'
              }`}
            >
              <LayoutList size={14} />
              <span className="hidden sm:inline">Catalog</span>
            </button>
            <button
              type="button"
              onClick={onHistory}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                currentPath === '/history'
                  ? 'bg-pharma-500 text-white'
                  : 'text-pharma-600 hover:bg-pharma-50 dark:text-pharma-300 dark:hover:bg-pharma-700/40'
              }`}
            >
              <History size={14} />
              <span className="hidden sm:inline">History</span>
              {orderCount > 0 && (
                <span className="ml-0.5 rounded-full bg-rx-amber px-1.5 text-[10px] font-mono text-white">
                  {orderCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onTools}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                currentPath === '/tools'
                  ? 'bg-pharma-500 text-white'
                  : 'text-pharma-600 hover:bg-pharma-50 dark:text-pharma-300 dark:hover:bg-pharma-700/40'
              }`}
            >
              <Wrench size={14} />
              <span className="hidden sm:inline">Tools</span>
            </button>
            <button
              type="button"
              onClick={onSettings}
              aria-label="Settings"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                currentPath === '/settings'
                  ? 'bg-pharma-500 text-white'
                  : 'text-pharma-600 hover:bg-pharma-50 dark:text-pharma-300 dark:hover:bg-pharma-700/40'
              }`}
            >
              <Settings size={14} />
            </button>
            <button
              type="button"
              onClick={onLock}
              aria-label="Lock app"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Lock size={14} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-pharma-100 transition-colors hover:bg-pharma-50 dark:border-pharma-700 dark:hover:bg-pharma-700/40"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}