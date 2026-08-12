import { ArrowLeft, PackagePlus, Upload, Zap, ArrowRight } from 'lucide-react';
import CatalogManager from '../catalog/CatalogManager';
import CsvImport from '../catalog/CsvImport';
import TemplateManager from '../order/TemplateManager';

const heroTools = [
  {
    icon: PackagePlus,
    title: 'Catalog Manager',
    blurb: 'Permanently add or remove medicines from the master catalog.',
    anchor: '#catalog-manager',
  },
  {
    icon: Upload,
    title: 'Batch Import Orders',
    blurb: 'Upload a CSV of name,qty rows to add many items in one go.',
    anchor: '#batch-import',
  },
  {
    icon: Zap,
    title: 'Quick Add',
    blurb: 'Start typing in the search bar — pick a match from the dropdown to add it instantly.',
    anchor: null,
  },
];

function HeroCard({ tool, onNavigate }) {
  const Icon = tool.icon;
  const isLinkOut = tool.anchor === null;

  const content = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pharma-500 text-white shadow-card">
        <Icon size={20} />
      </div>
      <p className="mt-3 font-display text-base font-semibold text-pharma-900 dark:text-pharma-50">
        {tool.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-pharma-600 dark:text-pharma-300">
        {tool.blurb}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-pharma-500">
        {isLinkOut ? 'Go to catalog' : 'Jump to tool'}
        <ArrowRight size={13} />
      </span>
    </>
  );

  if (isLinkOut) {
    return (
      <button
        type="button"
        onClick={onNavigate}
        className="flex flex-col items-start rounded-xl2 border border-pharma-100 bg-surface-light p-5 text-left shadow-card transition-colors hover:border-pharma-500 dark:border-pharma-700 dark:bg-surface-dark"
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={tool.anchor}
      className="flex flex-col items-start rounded-xl2 border border-pharma-100 bg-surface-light p-5 text-left shadow-card transition-colors hover:border-pharma-500 dark:border-pharma-700 dark:bg-surface-dark"
    >
      {content}
    </a>
  );
}

export default function ToolsPage({ onBack }) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-pharma-100 bg-surface-light px-3 py-2 text-sm font-medium text-pharma-700 transition-colors hover:bg-pharma-50 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-200"
      >
        <ArrowLeft size={14} />
        Back to app
      </button>

      <div>
        <h1 className="font-display text-xl font-semibold text-pharma-900 dark:text-pharma-50">Tools</h1>
        <p className="mt-1 text-sm text-pharma-600 dark:text-pharma-300">
          The three ways to get medicines into an order faster than browsing one by one.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {heroTools.map((tool) => (
          <HeroCard key={tool.title} tool={tool} onNavigate={onBack} />
        ))}
      </div>

      <div id="catalog-manager" className="scroll-mt-24">
        <CatalogManager />
      </div>

      <div id="batch-import" className="scroll-mt-24">
        <CsvImport />
      </div>

      <div className="pt-2">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
          Also available
        </p>
        <TemplateManager />
      </div>
    </div>
  );
}
