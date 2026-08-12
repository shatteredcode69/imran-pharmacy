import { useMemo, useState } from 'react';
import { PackagePlus, Trash2, Search } from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';

export default function CatalogManager() {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const medicines = useCatalogStore((state) => state.medicines);
  const addMedicine = useCatalogStore((state) => state.addMedicine);
  const deleteMedicine = useCatalogStore((state) => state.deleteMedicine);

  const filteredMedicines = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return medicines;

    return medicines.filter((medicine) => medicine.name.toLowerCase().includes(trimmed));
  }, [medicines, query]);

  const handleAdd = () => {
    addMedicine(name);
    setName('');
  };

  return (
    <section className="rounded-xl2 border border-pharma-100 bg-surface-light p-5 shadow-card dark:border-pharma-700 dark:bg-surface-dark">
      <div className="mb-4">
        <p className="text-xs font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
          Add or remove entries
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-pharma-100 bg-paper-light p-3 dark:border-pharma-700 dark:bg-paper-dark sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleAdd()}
          placeholder="Add a new medicine"
          className="flex-1 rounded-xl border border-pharma-100 bg-white px-3 py-2 text-sm text-pharma-900 outline-none transition-colors focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-100"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pharma-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-pharma-600 disabled:opacity-40"
        >
          <PackagePlus size={14} />
          Add medicine
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-pharma-100 bg-paper-light px-3 py-2 dark:border-pharma-700 dark:bg-paper-dark">
        <Search size={14} className="text-pharma-500" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search catalog"
          className="flex-1 bg-transparent text-sm text-pharma-900 outline-none dark:text-pharma-100"
        />
      </div>

      <div className="mt-4 max-h-72 overflow-auto rounded-2xl border border-pharma-100 dark:border-pharma-700">
        <ul className="divide-y divide-pharma-100 dark:divide-pharma-700">
          {filteredMedicines.map((medicine) => (
            <li key={medicine.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-pharma-700 dark:text-pharma-200">
              <span className="min-w-0 truncate">{medicine.name}</span>
              <button
                type="button"
                onClick={() => deleteMedicine(medicine.id)}
                className="inline-flex items-center gap-1 rounded-full bg-rx-amberSoft px-2.5 py-1 text-[11px] font-medium text-rx-amber transition-colors hover:bg-rx-amber/20"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
