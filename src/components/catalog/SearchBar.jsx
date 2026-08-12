import { useEffect, useRef, useState } from 'react';
import { Search, Plus, Check, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const DROPDOWN_LIMIT = 8;

function DropdownRow({ medicine, onPick }) {
  const qty = useCartStore((s) => s.cart[`m-${medicine.id}`]?.qty || 0);
  const [justAdded, setJustAdded] = useState(false);

  const handlePick = () => {
    onPick(medicine);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <button
      type="button"
      onClick={handlePick}
      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-pharma-50 dark:hover:bg-pharma-700/30"
    >
      <span className="min-w-0 flex-1 truncate text-sm text-pharma-900 dark:text-pharma-50">
        {medicine.name}
      </span>
      <span
        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors ${
          justAdded
            ? 'bg-pharma-500 text-white'
            : qty > 0
              ? 'bg-pharma-50 text-pharma-700 dark:bg-pharma-700/20 dark:text-pharma-100'
              : 'bg-pharma-500/10 text-pharma-600 dark:text-pharma-300'
        }`}
      >
        {justAdded ? <Check size={12} /> : <Plus size={12} />}
        {justAdded ? 'Added' : qty > 0 ? `In order · ${qty}` : 'Add'}
      </span>
    </button>
  );
}

export default function SearchBar({ query, setQuery, resultCount, matches }) {
  const [isFocused, setIsFocused] = useState(false);
  const increment = useCartStore((s) => s.increment);
  const containerRef = useRef(null);

  const showDropdown = isFocused && query.trim().length > 0 && matches.length > 0;
  const dropdownItems = matches.slice(0, DROPDOWN_LIMIT);
  const remaining = matches.length - dropdownItems.length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-[65px] z-20 border-b border-pharma-100 bg-paper-light/95 backdrop-blur dark:border-pharma-700 dark:bg-paper-dark/95">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div ref={containerRef} className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-pharma-500/70"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => e.key === 'Escape' && setIsFocused(false)}
            placeholder="Search by name or medicine ID..."
            className="w-full rounded-lg border border-pharma-100 bg-surface-light py-2.5 pl-10 pr-9 text-sm text-pharma-900 outline-none transition-colors placeholder:text-pharma-500/50 focus:border-pharma-500 focus:ring-2 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pharma-400 hover:text-pharma-600 dark:hover:text-pharma-200"
            >
              <X size={15} />
            </button>
          )}

          {/* Live dropdown — instant matches as you type, click to quick-add */}
          {showDropdown && (
            <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl2 border border-pharma-100 bg-surface-light shadow-card dark:border-pharma-700 dark:bg-surface-dark">
              <ul className="max-h-80 divide-y divide-pharma-100 overflow-y-auto dark:divide-pharma-700">
                {dropdownItems.map((medicine) => (
                  <li key={medicine.id}>
                    <DropdownRow medicine={medicine} onPick={increment} />
                  </li>
                ))}
              </ul>
              {remaining > 0 && (
                <p className="border-t border-pharma-100 px-4 py-2 text-center text-[11px] text-pharma-500 dark:border-pharma-700 dark:text-pharma-300">
                  +{remaining} more below in the catalog
                </p>
              )}
            </div>
          )}
        </div>

        {query && (
          <p className="mt-1.5 text-[11px] font-mono text-pharma-500 dark:text-pharma-300">
            {resultCount} match{resultCount === 1 ? '' : 'es'}
          </p>
        )}
      </div>
    </div>
  );
}
