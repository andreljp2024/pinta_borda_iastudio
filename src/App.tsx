import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/public/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { PdvView } from './components/pdv/PdvView';
import { ProductsView } from './components/products/ProductsView';
import { StockView } from './components/stock/StockView';
import { ShiftsView } from './components/shifts/ShiftsView';
import { PartnersView } from './components/partners/PartnersView';
import { SettlementsView } from './components/settlements/SettlementsView';
import { FeeRulesView } from './components/fees/FeeRulesView';
import { SalesView } from './components/sales/SalesView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, userRole, currentPartner } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />
        )}
        {activeView === 'dashboard' && (
          <DashboardView onOpenAuth={() => setIsAuthModalOpen(true)} />
        )}
        {activeView === 'pdv' && (
          <PdvView onOpenShiftModal={() => setActiveView('shifts')} />
        )}
        {activeView === 'products' && <ProductsView />}
        {activeView === 'stock' && <StockView />}
        {activeView === 'shifts' && <ShiftsView />}
        {activeView === 'partners' && <PartnersView />}
        {activeView === 'settlements' && <SettlementsView />}
        {activeView === 'fees' && <FeeRulesView />}
        {activeView === 'sales' && <SalesView />}
        {activeView === 'reports' && <ReportsView />}
        {activeView === 'audit' && <AuditLogsView />}
      </main>

      {/* Global Auth / Profile Switching Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
