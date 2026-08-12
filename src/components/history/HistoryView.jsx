import { useState } from 'react';
import { FileDown, Trash2, PackageOpen, ChevronDown } from 'lucide-react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { generateOrderPdf } from '../../lib/pdfGenerator';
import { formatOrderDate } from '../../lib/formatDate';

function OrderCard({ order, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="rounded-xl2 border border-pharma-100 dark:border-pharma-700 bg-surface-light dark:bg-surface-dark shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm">Order #{order.orderNumber}</p>
          <p className="font-mono text-[11px] text-pharma-500 dark:text-pharma-300">
            {formatOrderDate(order.dateISO)} · {order.totalItems} items
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-pharma-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-pharma-100 dark:border-pharma-700 px-4 py-3">
          <ul className="flex flex-col gap-1.5">
            {order.items.map((item, i) => (
              <li key={i} className="flex flex-col gap-1 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">
                    {item.name}
                    {item.isCustom && (
                      <span className="ml-1.5 text-[10px] font-mono uppercase text-rx-amber">
                        Custom
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-pharma-500 dark:text-pharma-300 shrink-0 ml-3">
                    x{item.qty}
                  </span>
                </div>
                {item.note && (
                  <p className="text-[11px] text-pharma-500 dark:text-pharma-300">
                    Note: {item.note}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => generateOrderPdf(order)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-pharma-500 px-3 py-2 text-xs font-medium text-white hover:bg-pharma-600 transition-colors"
            >
              <FileDown size={14} />
              Download PDF again
            </button>
            <button
              type="button"
              onClick={() => onDelete(order.id)}
              aria-label={`Delete order #${order.orderNumber}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-pharma-500 hover:bg-rx-amberSoft hover:text-rx-amber transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default function HistoryView() {
  const orders = useHistoryStore((s) => s.orders);
  const deleteOrder = useHistoryStore((s) => s.deleteOrder);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center text-pharma-500">
        <PackageOpen size={32} className="opacity-50" />
        <p className="text-sm">No orders yet. Checkout an order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-pharma-500">
          {orders.length} saved order{orders.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all order history? This cannot be undone.')) clearHistory();
          }}
          className="text-xs text-pharma-500 hover:text-rx-amber hover:underline"
        >
          Clear all
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onDelete={deleteOrder} />
        ))}
      </ul>
    </div>
  );
}
