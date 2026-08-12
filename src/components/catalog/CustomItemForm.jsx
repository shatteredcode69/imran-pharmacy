import { useState } from 'react';
import { PackagePlus, Plus, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import QuantityStepper from '../common/QuantityStepper';

export default function CustomItemForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const addMedicine = useCatalogStore((s) => s.addMedicine);
  const addQuantity = useCartStore((s) => s.addQuantity);

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const addedMedicine = addMedicine(trimmedName);
    if (addedMedicine) {
      addQuantity(addedMedicine, qty);
    }

    setName('');
    setQty(1);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-pharma-300 bg-white/70 px-4 py-3 text-sm font-medium text-pharma-700 transition-colors hover:bg-pharma-50 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-200"
      >
        <PackagePlus size={16} />
        Can&apos;t find a medicine? Add a new catalog entry
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 p-3 sm:items-center">
          <div className="w-full max-w-xl rounded-2xl border border-pharma-100 bg-surface-light p-4 shadow-xl dark:border-pharma-700 dark:bg-surface-dark">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-pharma-900 dark:text-pharma-50">
                  <PackagePlus size={16} className="text-pharma-500" />
                  Add a medicine to the catalog
                </p>
                <p className="mt-1 text-xs text-pharma-500 dark:text-pharma-300">
                  New medicines are added to the main list and can be added to the cart immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-pharma-500 transition-colors hover:bg-pharma-50 dark:hover:bg-pharma-700/40"
                aria-label="Close form"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Type medicine name..."
                className="flex-1 rounded-lg border border-pharma-100 bg-paper-light px-3 py-2.5 text-sm text-pharma-900 outline-none transition-colors focus:border-pharma-500 focus:ring-2 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-paper-dark dark:text-pharma-100"
              />
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <QuantityStepper
                  qty={qty}
                  onIncrement={() => setQty((q) => q + 1)}
                  onDecrement={() => setQty((q) => Math.max(1, q - 1))}
                  onSetQty={(nextQty) => setQty(Math.max(1, nextQty))}
                  size="sm"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!name.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-pharma-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-pharma-600 disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
