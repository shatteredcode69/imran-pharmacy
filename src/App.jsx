import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import LoginGate from './components/auth/LoginGate';
import SettingsPage from './components/settings/SettingsPage';
import SearchBar from './components/catalog/SearchBar';
import MedicineCatalog from './components/catalog/MedicineCatalog';
import CustomItemForm from './components/catalog/CustomItemForm';
import FloatingFooter from './components/order/FloatingFooter';
import HistoryView from './components/history/HistoryView';
import ToolsPage from './components/info/ToolsPage';
import { useTheme } from './lib/useTheme';
import { useHistoryStore } from './store/useHistoryStore';
import { useCatalogStore } from './store/useCatalogStore';
import { useAuthStore } from './store/useAuthStore';

function PharmacyApp() {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState('');
  const orderCount = useHistoryStore((s) => s.orders.length);
  const medicines = useCatalogStore((s) => s.medicines);
  const lock = useAuthStore((s) => s.lock);
  const navigate = useNavigate();

  const isSearching = query.trim().length > 0;

  const filteredMedicines = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter((m) => `${m.name} ${m.id}`.toLowerCase().includes(q));
  }, [medicines, query]);

  return (
    <div className="min-h-screen pb-28">
      <Header
        theme={theme}
        setTheme={setTheme}
        orderCount={orderCount}
        onCatalog={() => navigate('/')}
        onHistory={() => navigate('/history')}
        onTools={() => navigate('/tools')}
        onSettings={() => navigate('/settings')}
        onLock={lock}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar
                query={query}
                setQuery={setQuery}
                resultCount={filteredMedicines.length}
                matches={filteredMedicines}
              />
              <main className="mx-auto max-w-3xl px-4 py-4">
                <div className="flex flex-col gap-4">
                  <CustomItemForm />
                  <MedicineCatalog medicines={filteredMedicines} isSearching={isSearching} />
                </div>
              </main>
            </>
          }
        />
        <Route
          path="/history"
          element={
            <main className="mx-auto max-w-3xl px-4 py-4">
              <HistoryView />
            </main>
          }
        />
        <Route
          path="/tools"
          element={
            <main className="mx-auto max-w-3xl px-4 py-4">
              <ToolsPage onBack={() => navigate('/')} />
            </main>
          }
        />
        <Route
          path="/settings"
          element={
            <main className="mx-auto max-w-3xl px-4 py-4">
              <SettingsPage onBack={() => navigate('/')} />
            </main>
          }
        />
        {/* Old links from before the Tools page rename still work */}
        <Route path="/features" element={<Navigate to="/tools" replace />} />
        <Route path="/about" element={<Navigate to="/tools" replace />} />
      </Routes>

      <FloatingFooter />
    </div>
  );
}

export default function App() {
  return (
    <LoginGate>
      <PharmacyApp />
    </LoginGate>
  );
}