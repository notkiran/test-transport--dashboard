import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Page } from './lib/types';
import { Dashboard } from './pages/Dashboard';
import { Branches } from './pages/Branches';
import { Fleet } from './pages/Fleet';
import { Drivers } from './pages/Drivers';
import { Shipments } from './pages/Shipments';
import { Billing } from './pages/Billing';
import { LoadingSheets } from './pages/LoadingSheets';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';

const pageComponents: Record<Page, React.ComponentType> = {
  dashboard: Dashboard,
  branches: Branches,
  fleet: Fleet,
  drivers: Drivers,
  shipments: Shipments,
  billing: Billing,
  loading_sheets: LoadingSheets,
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const CurrentPageComponent = pageComponents[currentPage];

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
        <main className="flex-1 flex flex-col">
          <div className="flex-grow overflow-auto">
            {CurrentPageComponent && <CurrentPageComponent />}
          </div>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
