import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Clock,
  Bell,
  User,
  LogOut,
  Layers,
  Package,
  Boxes,
  Users,
  DollarSign,
  FileBarChart,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRightLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenShiftModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNotifications,
  onOpenShiftModal,
}) => {
  const {
    activeView,
    setActiveView,
    userRole,
    currentPartner,
    partners,
    activeShift,
    notifications,
    setUserRole,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) =>
      !n.isRead &&
      (userRole === 'ADMIN' || !n.recipientPartnerId || n.recipientPartnerId === currentPartner?.id)
  ).length;

  const handleRoleChange = (role: UserRole, partnerId?: string) => {
    setUserRole(role, partnerId);
    setRoleDropdownOpen(false);
    if (activeView === 'landing') {
      setActiveView('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur border-b border-stone-200">
      {/* Top micro-bar with shift status */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {activeShift ? (
              <>
                <strong className="text-white font-medium">Expediente no Balcão:</strong>{' '}
                <span className="text-amber-300">{activeShift.operatorName}</span> (
                {activeShift.partnerName}) • Rio Anil Shopping
              </>
            ) : (
              <span className="text-amber-400">
                Nenhum parceiro com expediente ativo no momento
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onOpenShiftModal}
            className="text-stone-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3 h-3 text-amber-400" />
            {activeShift ? 'Gerenciar / Passar Plantão' : 'Iniciar Expediente'}
          </button>
          <span className="text-stone-600">|</span>
          <span className="text-stone-400 hidden sm:inline">São Luís/MA • Loja Colaborativa</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className="text-left flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-white flex items-center justify-center shadow-sm font-serif-display font-bold text-lg">
                P&B
              </div>
              <div>
                <span className="font-serif-display text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
                  Pinta e Borda
                </span>
                <span className="block text-[11px] font-medium tracking-wide uppercase text-amber-800">
                  Coworking & Loja Colaborativa
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links for Management */}
          {activeView !== 'landing' ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveView('pdv')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'pdv'
                    ? 'bg-rose-700 text-white font-semibold shadow-sm'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                PDV Balcão
              </button>

              <button
                onClick={() => setActiveView('stock')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'stock'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Estoque
              </button>

              <button
                onClick={() => setActiveView('products')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'products'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Produtos
              </button>

              <button
                onClick={() => setActiveView('shifts')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'shifts'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Expedientes
              </button>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => setActiveView('partners')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeView === 'partners'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Parceiros
                </button>
              )}

              <button
                onClick={() => setActiveView('financial')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'financial'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Financeiro
              </button>

              <button
                onClick={() => setActiveView('reports')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'reports'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Relatórios
              </button>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => setActiveView('audit')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeView === 'audit'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Auditoria
                </button>
              )}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-700">
              <a href="#marcas" className="hover:text-amber-900 transition-colors">
                Nossas Marcas
              </a>
              <a href="#catalogo" className="hover:text-amber-900 transition-colors">
                Catálogo Físico
              </a>
              <a href="#sobre" className="hover:text-amber-900 transition-colors">
                Sobre o Coworking
              </a>
              <a href="#localizacao" className="hover:text-amber-900 transition-colors">
                Rio Anil Shopping
              </a>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher: Vitrine Pública vs Gestão */}
            {activeView === 'landing' ? (
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Acesso Operação / PDV</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('landing')}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Store className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Vitrine Pública</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Notificações em tempo real"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Role & Profile Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-medium transition-all shadow-2xs cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    userRole === 'ADMIN' ? 'bg-purple-700' : 'bg-amber-600'
                  }`}
                >
                  {userRole === 'ADMIN' ? 'A' : currentPartner?.brandName.charAt(0) || 'P'}
                </div>
                <div className="text-left hidden lg:block leading-tight">
                  <div className="font-semibold text-stone-900">
                    {userRole === 'ADMIN' ? 'Admin Geral' : currentPartner?.brandName}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {userRole === 'ADMIN' ? 'Acesso Total' : 'Escopo Marca'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Alternar Perfil (Simulação RBAC)
                    </p>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Teste o isolamento de dados entre o Administrador e os artesãos.
                    </p>
                  </div>

                  {/* Admin selection */}
                  <button
                    onClick={() => handleRoleChange('ADMIN')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-stone-50 cursor-pointer ${
                      userRole === 'ADMIN' ? 'bg-purple-50 text-purple-900 font-semibold' : 'text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                        A
                      </div>
                      <div>
                        <div>Administrador Geral</div>
                        <div className="text-[10px] text-stone-500">Gestão global, taxas e fechamento</div>
                      </div>
                    </div>
                    {userRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  </button>

                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-t border-stone-100 mt-1">
                    Marcas Parceiras (Visão Restrita)
                  </div>

                  {/* Partners list */}
                  <div className="max-h-56 overflow-y-auto">
                    {partners.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleRoleChange('PARTNER', p.id)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-stone-50 cursor-pointer ${
                          userRole === 'PARTNER' && currentPartner?.id === p.id
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={p.brandLogo}
                            alt={p.brandName}
                            className="w-6 h-6 rounded-full object-cover border border-stone-200"
                          />
                          <div className="truncate">
                            <div className="truncate">{p.brandName}</div>
                            <div className="text-[10px] text-stone-500 truncate">{p.category}</div>
                          </div>
                        </div>
                        {userRole === 'PARTNER' && currentPartner?.id === p.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 pt-1 mt-1 px-3 py-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-center text-xs text-amber-800 hover:text-amber-900 py-1 font-medium cursor-pointer"
                    >
                      Abrir Tela de Login P&B
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        {activeView !== 'landing' && (
          <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto text-xs border-t border-stone-200 no-scrollbar">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'dashboard' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('pdv')}
              className={`px-2.5 py-1 rounded-md shrink-0 font-semibold ${
                activeView === 'pdv' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              PDV Balcão
            </button>
            <button
              onClick={() => setActiveView('stock')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'stock' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Estoque
            </button>
            <button
              onClick={() => setActiveView('products')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'products' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveView('shifts')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'shifts' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Expedientes
            </button>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setActiveView('partners')}
                className={`px-2.5 py-1 rounded-md shrink-0 ${
                  activeView === 'partners' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
                }`}
              >
                Parceiros
              </button>
            )}
            <button
              onClick={() => setActiveView('financial')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'financial' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Financeiro
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-2.5 py-1 rounded-md shrink-0 ${
                activeView === 'reports' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
              }`}
            >
              Relatórios
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
