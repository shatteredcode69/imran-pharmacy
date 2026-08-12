import { useState } from 'react';
import { Star, Plus, Save, RefreshCcw, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function TemplateManager() {
  const [templateName, setTemplateName] = useState('');
  const favorites = useCartStore((s) => s.favorites);
  const toggleFavorite = useCartStore((s) => s.toggleFavorite);
  const templates = useCartStore((s) => s.templates);
  const saveTemplate = useCartStore((s) => s.saveTemplate);
  const applyTemplate = useCartStore((s) => s.applyTemplate);
  const deleteTemplate = useCartStore((s) => s.deleteTemplate);

  return (
    <section className="rounded-xl2 border border-pharma-100 bg-surface-light dark:bg-surface-dark dark:border-pharma-700 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-pharma-900 dark:text-pharma-50">Favorites & templates</p>
          <p className="text-xs text-pharma-500 dark:text-pharma-300">Mark medicines as favorites and reuse saved orders quickly.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-pharma-100 bg-pharma-50/80 p-3 text-sm text-pharma-800 dark:border-pharma-700 dark:bg-pharma-700/10 dark:text-pharma-100">
          <p className="font-semibold">Quick favorites</p>
          <p className="mt-2 text-xs text-pharma-600 dark:text-pharma-300">
            Use the star icon on catalog medicines to pin common items to the top.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-full border border-pharma-100 bg-white px-3 py-1.5 text-xs text-pharma-700 dark:bg-surface-dark dark:text-pharma-200">
              <Star size={12} /> Mark favorite
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-pharma-100 p-3 dark:border-pharma-700">
          <p className="font-semibold text-sm text-pharma-900 dark:text-pharma-50">Order templates</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name"
              className="flex-1 rounded-xl border border-pharma-100 bg-paper-light px-3 py-2 text-sm text-pharma-900 outline-none transition-colors focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500/20 dark:border-pharma-700 dark:bg-paper-dark dark:text-pharma-100"
            />
            <button
              type="button"
              onClick={() => {
                saveTemplate(templateName);
                setTemplateName('');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-pharma-500 px-3 py-2 text-xs font-semibold text-white hover:bg-pharma-600 transition-colors"
            >
              <Save size={14} /> Save
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="mt-3 text-xs text-pharma-500 dark:text-pharma-300">No saved templates yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-pharma-700 dark:text-pharma-200">
              {templates.map((template) => (
                <li key={template.id} className="flex items-center justify-between gap-3 rounded-xl border border-pharma-100 bg-surface-light px-3 py-2 dark:border-pharma-700 dark:bg-surface-dark">
                  <span>{template.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className="rounded-xl bg-pharma-500 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-pharma-600 transition-colors"
                    >
                      <RefreshCcw size={12} /> Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTemplate(template.id)}
                      className="rounded-xl bg-pharma-100 px-2.5 py-1.5 text-[11px] text-pharma-700 hover:bg-rx-amberSoft hover:text-rx-amber transition-colors dark:bg-pharma-700/10 dark:text-pharma-200"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
