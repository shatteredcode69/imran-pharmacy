import { useMemo, useState } from 'react';
import { ChevronDown, Star, Rows3, Rows4 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import MedicineCard from './MedicineCard';

function groupByLetter(medicines) {
  const groups = {};
  for (const medicine of medicines) {
    const firstChar = medicine.name.trim()[0] || '#';
    const letter = /[a-zA-Z]/.test(firstChar) ? firstChar.toUpperCase() : '#';
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(medicine);
  }
  const sortedLetters = Object.keys(groups).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });
  return sortedLetters.map((letter) => ({
    letter,
    items: groups[letter].sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

function LetterSection({ letter, items, expanded, onToggle, favorites, onToggleFavorite, onSetQtyForMedicine }) {
  return (
    <li className="overflow-hidden rounded-xl2 border border-pharma-100 bg-surface-light shadow-card dark:border-pharma-700 dark:bg-surface-dark">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pharma-500 font-display text-sm font-semibold text-white">
            {letter}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
            {items.length} {items.length === 1 ? 'medicine' : 'medicines'}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-pharma-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-pharma-100 px-4 py-3 dark:border-pharma-700">
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {items.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                favorite={!!favorites[medicine.id]}
                onToggleFavorite={onToggleFavorite}
                onSetQtyForMedicine={onSetQtyForMedicine}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function MedicineCatalog({ medicines, isSearching }) {
  const favorites = useCartStore((s) => s.favorites);
  const toggleFavorite = useCartStore((s) => s.toggleFavorite);
  const setQuantityForMedicine = useCartStore((s) => s.setQuantityForMedicine);
  const [expandedLetters, setExpandedLetters] = useState({});

  const favoriteMedicines = useMemo(
    () => medicines.filter((m) => favorites[m.id]).sort((a, b) => a.name.localeCompare(b.name)),
    [medicines, favorites]
  );

  const groups = useMemo(() => groupByLetter(medicines), [medicines]);
  const allExpanded = groups.length > 0 && groups.every((g) => expandedLetters[g.letter]);

  const toggleLetter = (letter) => {
    setExpandedLetters((prev) => ({ ...prev, [letter]: !prev[letter] }));
  };

  const toggleAll = () => {
    const next = {};
    if (!allExpanded) groups.forEach((g) => (next[g.letter] = true));
    setExpandedLetters(next);
  };

  if (medicines.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-pharma-200 bg-white/70 py-12 text-center text-sm text-pharma-600 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-300">
        No medicines match your search. Try a different name or add a new medicine.
      </div>
    );
  }

  // While actively searching, the list is already narrowed — show a plain,
  // elegant card grid instead of the alphabetical accordion.
  if (isSearching) {
    return (
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {medicines
          .slice()
          .sort((a, b) => {
            const favA = !!favorites[a.id];
            const favB = !!favorites[b.id];
            if (favA !== favB) return favA ? -1 : 1;
            return a.name.localeCompare(b.name);
          })
          .map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              favorite={!!favorites[medicine.id]}
              onToggleFavorite={toggleFavorite}
              onSetQtyForMedicine={setQuantityForMedicine}
            />
          ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {favoriteMedicines.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
            <Star size={12} className="fill-pharma-500 text-pharma-500" />
            Favorites
          </p>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {favoriteMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                favorite
                onToggleFavorite={toggleFavorite}
                onSetQtyForMedicine={setQuantityForMedicine}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
          Full catalog · A–Z
        </p>
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs font-medium text-pharma-600 hover:text-pharma-700 dark:text-pharma-300 dark:hover:text-pharma-100"
        >
          {allExpanded ? <Rows3 size={13} /> : <Rows4 size={13} />}
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <ul className="flex flex-col gap-2.5">
        {groups.map((group) => (
          <LetterSection
            key={group.letter}
            letter={group.letter}
            items={group.items}
            expanded={!!expandedLetters[group.letter]}
            onToggle={() => toggleLetter(group.letter)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSetQtyForMedicine={setQuantityForMedicine}
          />
        ))}
      </ul>
    </div>
  );
}
