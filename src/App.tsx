import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/public/LandingPage';
import { VirtualStoreView } from './components/public/VirtualStoreView';
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
import { PresentationModal } from './components/presentation/PresentationModal';
import { ArtisanPortalView } from './components/portal/ArtisanPortalView';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, userRole, currentPartner } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#1e352e] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setActiveView('audit')}
        onOpenShiftModal={() => setActiveView('shifts')}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenPresentation={() => setIsPresentationOpen(true)}
          />
        )}
        {activeView === 'store' && (
          <VirtualStoreView onOpenAuth={() => setIsAuthModalOpen(true)} />
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
        {(activeView === 'settlements' || activeView === 'financial') && <SettlementsView />}
        {activeView === 'fees' && <FeeRulesView />}
        {activeView === 'sales' && <SalesView />}
        {activeView === 'reports' && <ReportsView />}
        {activeView === 'audit' && <AuditLogsView />}
        {activeView === 'artisan-portal' && <ArtisanPortalView />}
      </main>

      {/* Global Auth / Profile Switching Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Dossiê & Apresentação Institucional Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
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
