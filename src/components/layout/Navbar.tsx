import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Clock,
  Bell,
  User,
  LogOut,
  Layers,
  LayoutDashboard,
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
  Smartphone,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenShiftModal: () => void;
  onOpenPresentation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNotifications,
  onOpenShiftModal,
  onOpenPresentation,
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
    <header className="sticky top-0 z-40 bg-[#fdf8f9]/95 backdrop-blur-md border-b border-[#ebd8e0] shadow-[0_4px_20px_rgba(28,56,48,0.04)]">
      {/* Top micro-bar with shift status */}
      <div className="bg-[#341724] text-[#eaf0e8] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-[#250f19]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#7ec498] animate-pulse shadow-[0_0_8px_#7ec498]" />
          <span>
            {activeShift ? (
              <>
                <strong className="text-white font-medium">Expediente no Balcão:</strong>{' '}
                <span className="text-[#e29b86] font-semibold">{activeShift.operatorName}</span> (
                {activeShift.partnerName}) • Rio Anil Shopping
              </>
            ) : (
              <span className="text-[#b89fa9]">
                Nenhum parceiro com expediente ativo no momento
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-craft">
          <button
            onClick={onOpenShiftModal}
            className="text-[#e29b86] hover:text-white underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Clock className="w-3 h-3 text-[#e29b86]" />
            {activeShift ? 'Gerenciar / Passar Plantão' : 'Iniciar Expediente'}
          </button>
          <span className="text-[#4e293a]">|</span>
          <span className="text-[#95b19f] hidden sm:inline">São Luís · Maranhão</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Identity with circular monogram */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className="text-left flex items-center gap-3 group cursor-pointer focus:outline-none"
            >
              <div className="brand-mark text-[#2e1420] group-hover:text-[#c85a78] transition-colors">
                <span>p</span>
                <span>b</span>
              </div>
              <div className="leading-tight">
                <span className="font-display text-xl font-medium tracking-tight text-[#2e1420] group-hover:text-[#c85a78] transition-colors">
                  pinta <em className="font-normal italic text-[#c85a78]">e</em> borda
                </span>
                <span className="block text-[9px] font-mono-craft font-medium tracking-[0.2em] uppercase text-[#c85a78]">
                  casa colaborativa
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          {activeView !== 'landing' && activeView !== 'store' ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-xs font-medium">
              <button
                onClick={() => setActiveView('landing')}
                className="outline-button !py-1.5 !px-3 font-medium text-[#4a2536] hover:text-[#a84e68]"
              >
                ← Vitrine
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'dashboard'
                    ? 'bg-[#2e1420] text-[#ffffff] font-semibold shadow-xs'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Visão Geral
              </button>

              <button
                onClick={() => setActiveView('artisan-portal')}
                className={`px-3 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'artisan-portal'
                    ? 'bg-[#1f4e38] text-white font-semibold shadow-xs'
                    : 'bg-[#eaf4ef] text-[#1f4e38] hover:bg-[#d6ebe0]'
                }`}
                title="Portal da Artesã (Visão do celular da produtora)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Portal da Artesã</span>
              </button>

              <button
                onClick={() => setActiveView('pdv')}
                className={`px-3 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'pdv'
                    ? 'bg-[#c85a78] text-white font-semibold shadow-xs'
                    : 'bg-[#f6ebef] text-[#9c3653] hover:bg-[#eedbe2]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                PDV Balcão
              </button>

              <button
                onClick={() => setActiveView('stock')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'stock'
                    ? 'bg-[#2e1420] text-white font-semibold'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Estoque
              </button>

              <button
                onClick={() => setActiveView('products')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'products'
                    ? 'bg-[#2e1420] text-white font-semibold'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Produtos
              </button>

              <button
                onClick={() => setActiveView('shifts')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'shifts'
                    ? 'bg-[#2e1420] text-white font-semibold'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Plantões
              </button>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => setActiveView('partners')}
                  className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                    activeView === 'partners'
                      ? 'bg-[#2e1420] text-white font-semibold'
                      : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                  }`}
                >
                  Parceiras
                </button>
              )}

              <button
                onClick={() => setActiveView('financial')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'financial'
                    ? 'bg-[#2e1420] text-white font-semibold'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Repasses
              </button>

              <button
                onClick={() => setActiveView('reports')}
                className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                  activeView === 'reports'
                    ? 'bg-[#2e1420] text-white font-semibold'
                    : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                }`}
              >
                Relatórios
              </button>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => setActiveView('audit')}
                  className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
                    activeView === 'audit'
                      ? 'bg-[#2e1420] text-white font-semibold'
                      : 'text-[#644855] hover:text-[#2e1420] hover:bg-[#f4e6ec]'
                  }`}
                >
                  Auditoria
                </button>
              )}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-7 text-[13px] font-medium text-[#644855]">
              <a
                href="#sobre"
                onClick={(e) => {
                  if (activeView !== 'landing') {
                    e.preventDefault();
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="hover:text-[#c85a78] transition-colors cursor-pointer"
              >
                O espaço
              </a>

              <a
                href="#marcas"
                onClick={(e) => {
                  if (activeView !== 'landing') {
                    e.preventDefault();
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('marcas')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="hover:text-[#c85a78] transition-colors cursor-pointer"
              >
                Marcas
              </a>

              <a
                href="#catalogo"
                onClick={(e) => {
                  if (activeView !== 'landing') {
                    e.preventDefault();
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="hover:text-[#c85a78] transition-colors cursor-pointer"
              >
                Catálogo
              </a>

              <a
                href="#visite"
                onClick={(e) => {
                  if (activeView !== 'landing') {
                    e.preventDefault();
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('visite')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="hover:text-[#c85a78] transition-colors cursor-pointer"
              >
                Visite
              </a>

              {onOpenPresentation && (
                <button
                  onClick={onOpenPresentation}
                  className="hover:text-[#c85a78] transition-colors cursor-pointer flex items-center gap-1 text-[12px] font-mono-craft text-[#b84c6c]"
                  title="Dossiê Institucional P&B"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c85a78]" />
                  <span>Dossiê</span>
                </button>
              )}
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* View Switcher: Vitrine vs Gestão */}
            {activeView === 'landing' || activeView === 'store' ? (
              <>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="outline-button hidden sm:inline-flex"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#c85a78]" />
                  <span>Gestão</span>
                </button>

                <button
                  onClick={() => setActiveView('store')}
                  className="solid-button"
                >
                  <span>Explorar peças</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveView('landing')}
                className="outline-button !py-1.5 !px-3.5 text-xs font-semibold"
                title="Voltar à Vitrine da Casa"
              >
                <span>Voltar à vitrine</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-[#644855] hover:text-[#2e1420] hover:bg-[#f6ebef] rounded-full transition-colors cursor-pointer"
              title="Notificações em tempo real"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#c85a78] text-white text-[9px] font-mono-craft rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Role & Profile Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#edd5dc] bg-[#ffffff] hover:bg-white text-[#2e1420] text-xs font-medium transition-all cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-mono-craft font-bold ${
                    userRole === 'ADMIN' ? 'bg-[#2e1420]' : 'bg-[#c85a78]'
                  }`}
                >
                  {userRole === 'ADMIN' ? 'ADM' : currentPartner?.brandName.charAt(0) || 'P'}
                </div>
                <div className="text-left hidden xl:block leading-none pr-1">
                  <span className="font-semibold text-[#2e1420] text-[11px] block">
                    {userRole === 'ADMIN' ? 'Coordenação' : currentPartner?.brandName}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#997e8a]" />
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
                    {userRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#3c6b54]" />}
                  </button>

                  {/* Portal da Artesã direct shortcut */}
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setActiveView('artisan-portal');
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs bg-[#eaf4ef] hover:bg-[#d6ebe0] text-[#1f4e38] font-semibold border-y border-[#bed8c7] cursor-pointer my-1"
                  >
                    <Smartphone className="w-4 h-4 text-[#1f4e38] shrink-0" />
                    <div>
                      <div>Abrir Portal da Artesã</div>
                      <div className="text-[10px] text-[#2e684c] font-normal">
                        Visão do celular da produtora
                      </div>
                    </div>
                  </button>

                  <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8e727e] uppercase tracking-wider border-t border-[#edd5dc] mt-1 font-mono-craft">
                    Marcas Parceiras (Visão Restrita)
                  </div>

                  {/* Partners list */}
                  <div className="max-h-56 overflow-y-auto">
                    {partners.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleRoleChange('PARTNER', p.id)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#f6ebef]/50 cursor-pointer ${
                          userRole === 'PARTNER' && currentPartner?.id === p.id
                            ? 'bg-[#f6ebef] text-[#2e1420] font-semibold'
                            : 'text-[#2e1420]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={p.brandLogo}
                            alt={p.brandName}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                            className="w-6 h-6 rounded-full object-cover border border-[#edd5dc]"
                          />
                          <div className="truncate">
                            <div className="truncate font-display font-medium">{p.brandName}</div>
                            <div className="text-[10px] text-[#8e727e] truncate font-mono-craft">{p.category}</div>
                          </div>
                        </div>
                        {userRole === 'PARTNER' && currentPartner?.id === p.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#c85a78] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#edd5dc] pt-1 mt-1 px-3 py-1 font-mono-craft">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-center text-xs text-[#c85a78] hover:text-[#9c3653] py-1 font-medium cursor-pointer"
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
        {activeView === 'landing' || activeView === 'store' ? (
          <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto text-xs border-t border-[#edd5dc] no-scrollbar font-mono-craft">
            <button
              onClick={() => {
                setActiveView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full shrink-0 font-bold transition-all cursor-pointer ${
                activeView === 'landing' ? 'bg-[#2e1420] text-[#ffffff] shadow-xs' : 'bg-[#f6ebef] text-[#2e1420]'
              }`}
            >
              Dossiê Institucional
            </button>

            <button
              onClick={() => setActiveView('store')}
              className={`px-3 py-1.5 rounded-full shrink-0 font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeView === 'store'
                  ? 'bg-[#2e1420] text-[#ffffff] shadow-xs ring-2 ring-[#3c6b54]/50'
                  : 'bg-[#f6ebef] text-[#c85a78] border border-[#edd5dc]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Loja Virtual & Catálogo</span>
            </button>

            <button
              onClick={() => {
                if (activeView !== 'landing') setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('marcas')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-2.5 py-1.5 rounded-full shrink-0 bg-[#f6ebef]/60 text-[#2e1420] font-medium cursor-pointer"
            >
              14 Ateliês
            </button>

            <button
              onClick={() => {
                if (activeView !== 'landing') setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('acoes')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-2.5 py-1.5 rounded-full shrink-0 bg-[#f6ebef]/60 text-[#2e1420] font-medium cursor-pointer"
            >
              Ações Sociais
            </button>

            <button
              onClick={() => {
                if (activeView !== 'landing') setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('loja-fisica')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-2.5 py-1.5 rounded-full shrink-0 bg-[#f6ebef]/60 text-[#2e1420] font-medium cursor-pointer"
            >
              Rio Anil Shopping
            </button>

            <button
              onClick={() => {
                if (activeView !== 'landing') setActiveView('landing');
                setTimeout(() => {
                  document.getElementById('parcerias-b2b')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-2.5 py-1.5 rounded-full shrink-0 bg-[#f6ebef]/60 text-[#2e1420] font-medium cursor-pointer"
            >
              Parcerias B2B
            </button>
          </div>
        ) : (
          <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto text-xs border-t border-[#edd5dc] no-scrollbar font-mono-craft">
            <button
              onClick={() => setActiveView('landing')}
              className="px-2.5 py-1 rounded-full shrink-0 bg-[#f6ebef] text-[#2e1420] font-bold border border-[#edd5dc]"
            >
              Ver Dossiê
            </button>
            <button
              onClick={() => setActiveView('store')}
              className="px-2.5 py-1 rounded-full shrink-0 bg-[#f6ebef] text-[#c85a78] font-bold border border-[#edd5dc] flex items-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" />
              Loja
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'dashboard' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('artisan-portal')}
              className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 font-semibold ${
                activeView === 'artisan-portal'
                  ? 'bg-[#1f4e38] text-white'
                  : 'bg-[#eaf4ef] text-[#1f4e38]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Portal Artesã</span>
            </button>
            <button
              onClick={() => setActiveView('pdv')}
              className={`px-2.5 py-1 rounded-full shrink-0 font-semibold ${
                activeView === 'pdv' ? 'bg-[#c85a78] text-white' : 'bg-[#f6ebef] text-[#c85a78]'
              }`}
            >
              PDV Balcão
            </button>
            <button
              onClick={() => setActiveView('stock')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'stock' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
              }`}
            >
              Estoque
            </button>
            <button
              onClick={() => setActiveView('products')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'products' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveView('shifts')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'shifts' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
              }`}
            >
              Expedientes
            </button>
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setActiveView('partners')}
                className={`px-2.5 py-1 rounded-full shrink-0 ${
                  activeView === 'partners' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
                }`}
              >
                Parceiros
              </button>
            )}
            <button
              onClick={() => setActiveView('financial')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'financial' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
              }`}
            >
              Financeiro
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-2.5 py-1 rounded-full shrink-0 ${
                activeView === 'reports' ? 'bg-[#2e1420] text-white font-bold' : 'text-[#644855]'
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
