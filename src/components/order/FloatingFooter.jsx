import { useState } from 'react';
import { FileDown, X, Trash2, ClipboardList, ChevronUp } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { generateOrderPdf } from '../../lib/pdfGenerator';
import QuantityStepper from '../common/QuantityStepper';

function OrderDrawer({ onClose, onCheckout }) {
  const cart = useCartStore((s) => s.cart);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const setItemNote = useCartStore((s) => s.setItemNote);
  const removeItem = useCartStore((s) => s.removeItem);
  const items = Object.values(cart);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-pharma-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-t-xl2 bg-paper-light dark:bg-paper-dark shadow-card">
        <div className="flex items-center justify-between border-b border-pharma-100 dark:border-pharma-700 px-5 py-4">
          <p className="flex items-center gap-2 font-display font-semibold text-base">
            <ClipboardList size={18} className="text-pharma-500" />
            Review order
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order review"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-pharma-50 dark:hover:bg-pharma-700/40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-pharma-500">Your order is empty.</p>
          ) : (
            <ul className="flex flex-col gap-4 py-2">
              {items.map((item) => (
                <li key={item.key} className="rounded-xl border border-pharma-100 dark:border-pharma-700 bg-surface-light dark:bg-surface-dark shadow-sm">
                  <div className="flex items-center justify-between gap-3 px-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      {item.isCustom && (
                        <span className="text-[10px] font-mono uppercase tracking-wide text-rx-amber">
                          Custom item
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <QuantityStepper
                        qty={item.qty}
                        onIncrement={() =>
                          item.isCustom
                            ? null
                            : increment({ id: item.id, name: item.name })
                        }
                        onDecrement={() => decrement(item.key)}
                        onSetQty={(nextQty) => setQuantity(item.key, nextQty)}
                        size="sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-pharma-500 hover:bg-rx-amberSoft hover:text-rx-amber transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-pharma-100 dark:border-pharma-700 px-3 py-3">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.18em] text-pharma-500 dark:text-pharma-300">
                      Prescription note
                    </label>
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => setItemNote(item.key, e.target.value)}
                      placeholder="Add a note for this item"
                      className="mt-2 w-full rounded-xl border border-pharma-100 bg-paper-light px-3 py-2 text-sm text-pharma-900 outline-none transition-colors focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-paper-dark dark:text-pharma-100"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-pharma-100 dark:border-pharma-700 px-5 py-4">
          <button
            type="button"
            onClick={onCheckout}
            disabled={items.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl2 bg-pharma-500 py-3 text-sm font-medium text-white disabled:opacity-40 hover:bg-pharma-600 transition-colors"
          >
            <FileDown size={16} />
            Checkout &amp; Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FloatingFooter() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useHistoryStore((s) => s.addOrder);
  const nextOrderNumber = useHistoryStore((s) => s.nextOrderNumber);

  const items = Object.values(cart);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    const orderNumber = nextOrderNumber;
    addOrder(items);
    generateOrderPdf({ orderNumber, dateISO: new Date().toISOString(), items });
    clearCart();
    setDrawerOpen(false);
    setConfirmation(`Order #${orderNumber} saved and PDF downloaded`);
    setTimeout(() => setConfirmation(null), 3500);
  };

  return (
    <>
      {confirmation && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
          <div className="rounded-full bg-pharma-500 px-4 py-2 text-xs font-medium text-white shadow-card">
            {confirmation}
          </div>
        </div>
      )}

      {drawerOpen && (
        <OrderDrawer onClose={() => setDrawerOpen(false)} onCheckout={handleCheckout} />
      )}

      {totalItems > 0 && !drawerOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex w-full items-center justify-between rounded-xl2 bg-pharma-500 text-white shadow-card px-5 py-3.5 hover:bg-pharma-600 transition-colors"
            >
              <span className="leading-tight text-left">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-pharma-100/80">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in order
                </span>
                <span className="block font-display font-semibold text-base">
                  Review &amp; checkout
                </span>
              </span>
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
