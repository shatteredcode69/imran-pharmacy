import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import medicinesData from '../data/medicines.json';

const baseMedicines = medicinesData.map((medicine) => ({
  ...medicine,
  isCustom: false,
}));

const normalizeMedicineName = (value) => {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';

  return trimmed
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');
};

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      medicines: baseMedicines,

      addMedicine: (name) => {
        const normalizedName = normalizeMedicineName(name);
        if (!normalizedName) return null;

        const state = get();
        const alreadyExists = state.medicines.some(
          (medicine) => medicine.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (alreadyExists) return null;

        const newMedicine = {
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: normalizedName,
          isCustom: true,
          createdAt: new Date().toISOString(),
        };

        set((currentState) => ({
          medicines: [newMedicine, ...currentState.medicines],
        }));

        return newMedicine;
      },

      deleteMedicine: (medicineId) =>
        set((state) => ({
          medicines: state.medicines.filter((medicine) => medicine.id !== medicineId),
        })),

      getMedicineById: (medicineId) => get().medicines.find((medicine) => medicine.id === medicineId),
    }),
    { name: 'imran-pharmacy-catalog' }
  )
);
