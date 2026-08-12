import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import medicines from '../../data/medicines.json';

const normalize = (value) => value.trim().toLowerCase();

export default function CsvImport() {
  const addCustomItem = useCartStore((s) => s.addCustomItem);
  const addQuantity = useCartStore((s) => s.addQuantity);
  const [status, setStatus] = useState('Select a CSV file with `name,qty` rows.');

  const medicineMap = medicines.reduce((map, medicine) => {
    map[normalize(medicine.name)] = medicine;
    return map;
  }, {});

  const handleFile = async (file) => {
    const text = await file.text();
    const rows = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(',').map((cell) => cell.trim()));

    if (rows.length === 0) {
      setStatus('The CSV file is empty.');
      return;
    }

    const imported = [];
    const errors = [];

    rows.forEach((cells, index) => {
      const [name = '', qty = ''] = cells;
      const quantity = Number(qty || '1');
      const trimmedName = name.trim();

      if (!trimmedName || !Number.isFinite(quantity) || quantity < 1) {
        errors.push(`Row ${index + 1} is invalid.`);
        return;
      }

      const matched = medicineMap[normalize(trimmedName)];
      if (matched) {
        addQuantity(matched, quantity);
      } else {
        addCustomItem(trimmedName, quantity);
      }

      imported.push(`${trimmedName} x${quantity}`);
    });

    setStatus(
      errors.length > 0
        ? `${imported.length} imported. ${errors.length} invalid row(s) were skipped.`
        : `${imported.length} items imported successfully.`
    );
  };

  return (
    <section className="rounded-xl2 border border-pharma-100 bg-surface-light dark:bg-surface-dark dark:border-pharma-700 p-5 shadow-card">
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pharma-500 dark:text-pharma-300">
          <Upload size={13} />
          Upload a CSV with `name,qty` rows
        </p>

        <label className="flex max-w-fit cursor-pointer items-center gap-2 rounded-xl2 border border-pharma-100 bg-surface-light px-4 py-2 text-sm text-pharma-600 dark:border-pharma-700 dark:bg-surface-dark dark:text-pharma-300 hover:border-pharma-500 hover:text-pharma-700 transition-colors">
          <span>Select CSV file</span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
        </label>

        <p className="text-xs text-pharma-500 dark:text-pharma-300">{status}</p>
      </div>
    </section>
  );
}
