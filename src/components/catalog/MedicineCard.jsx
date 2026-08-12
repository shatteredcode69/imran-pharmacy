import { Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import QuantityStepper from '../common/QuantityStepper';

export default function MedicineCard({ medicine, favorite, onToggleFavorite, onSetQtyForMedicine }) {
  const qty = useCartStore((s) => s.cart[`m-${medicine.id}`]?.qty || 0);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  return (
    <li
      className={`rounded-xl2 border bg-surface-light px-4 py-3 shadow-card transition-colors dark:bg-surface-dark ${
        qty > 0
          ? 'border-pharma-500/60 bg-pharma-50/60 dark:bg-pharma-700/10'
          : 'border-pharma-100 dark:border-pharma-700'
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-pharma-900 dark:text-pharma-50">
            {medicine.name}
          </p>
          <button
            type="button"
            onClick={() => onToggleFavorite(medicine.id)}
            aria-label={favorite ? 'Remove favorite' : 'Mark favorite'}
            className="shrink-0 rounded-full p-1 text-pharma-500 transition-colors hover:text-pharma-700 dark:hover:text-pharma-100"
          >
            <Star size={14} className={favorite ? 'fill-pharma-500 text-pharma-500' : 'text-pharma-300'} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-pharma-500 dark:text-pharma-300">
            {medicine.isCustom ? 'custom' : 'catalog'}
          </p>
          <QuantityStepper
            qty={qty}
            onIncrement={() => increment(medicine)}
            onDecrement={() => decrement(`m-${medicine.id}`)}
            onSetQty={(nextQty) => onSetQtyForMedicine(medicine, nextQty)}
            size="sm"
          />
        </div>
      </div>
    </li>
  );
}
