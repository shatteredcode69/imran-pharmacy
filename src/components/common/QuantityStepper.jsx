import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ qty, onIncrement, onDecrement, onSetQty, size = 'md' }) {
  const [inputValue, setInputValue] = useState(String(qty));
  const btnSize = size === 'sm' ? 'h-10 w-10 min-w-10' : 'h-11 w-11 min-w-11';

  useEffect(() => {
    setInputValue(String(qty));
  }, [qty]);

  const commitValue = (value) => {
    const nextQty = Number(value);
    if (!Number.isFinite(nextQty) || nextQty < 0) {
      setInputValue(String(qty));
      return null;
    }

    const normalizedQty = Math.max(0, Math.min(nextQty, 999));
    if (onSetQty) {
      onSetQty(normalizedQty);
    }
    return normalizedQty;
  };

  const handleStep = (delta) => {
    const currentValue = Number(inputValue);
    const baseQty = Number.isFinite(currentValue) && currentValue >= 0 ? currentValue : qty;
    const nextQty = Math.max(0, Math.min(baseQty + delta, 999));
    if (onSetQty) {
      onSetQty(nextQty);
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono">
      <button
        type="button"
        onClick={() => handleStep(-1)}
        disabled={qty === 0}
        aria-label="Decrease quantity"
        className={`flex ${btnSize} items-center justify-center rounded-lg border border-pharma-100 text-pharma-600 transition-colors hover:bg-pharma-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-pharma-700 dark:text-pharma-100 dark:hover:bg-pharma-700/40`}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        min="0"
        max="999"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={(e) => commitValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commitValue(e.currentTarget.value);
          }
        }}
        className="w-14 rounded-lg border border-pharma-100 bg-surface-light px-2 py-1.5 text-center text-sm font-medium text-pharma-900 outline-none transition-colors focus:border-pharma-500 focus:ring-2 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-100"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => handleStep(1)}
        aria-label="Increase quantity"
        className={`flex ${btnSize} items-center justify-center rounded-lg border border-pharma-100 text-pharma-600 transition-colors hover:bg-pharma-50 dark:border-pharma-700 dark:text-pharma-100 dark:hover:bg-pharma-700/40`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
