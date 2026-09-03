import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  Boxes,
  Package,
  Users,
  Smartphone,
  DollarSign,
  FileSpreadsheet,
  FileBarChart,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Clock,
  Bell,
  Sparkles,
  Search,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Store,
  ArrowRightLeft,
  SlidersHorizontal,
  ChevronLeft,
  Settings,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenShiftModal: () => void;
  onOpenPresentation?: () => void;
}

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  adminOnly?: boolean;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  onOpenAuth,
  onOpenNotifications,
  onOpenShiftModal,
  onOpenPresentation,
}) => {
  const {
    activeView,
    setActiveView,
    userRole,
    setUserRole,
    currentPartner,
    partners,
    products,
    sales,
    shifts,
    activeShift,
    notifications,
    storeSettings,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Unread notifications
  const unreadCount = notifications.filter(
    (n) => !n.isRead && (userRole === 'ADMIN' || !n.recipientPartnerId || n.recipientPartnerId === currentPartner?.id)
  ).length;

  // Low stock products count
  const lowStockCount = products.filter((p) => {
    if (userRole === 'PARTNER' && currentPartner && p.partnerId !== currentPartner.id) return false;
    return p.stock <= p.minStock;
  }).length;

  // Active products count
  const relevantProductsCount = userRole === 'PARTNER' && currentPartner
    ? products.filter((p) => p.partnerId === currentPartner.id).length
    : products.length;

  // Categorized Navigation Sections
  const navSections: NavSection[] = [
    {
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Visão Geral',
          icon: LayoutDashboard,
          description: 'Métricas, atalhos e resumo financeiro',
        },
      ],
    },
    {
      title: 'Operações de Balcão',
      items: [
        {
          id: 'pdv',
          label: 'PDV Frente de Caixa',
          icon: ShoppingBag,
          badge: 'Balcão',
          badgeColor: 'bg-[#f43f7e] text-white',
          description: 'Registro de vendas físicas no shopping',
        },
        {
          id: 'sales',
          label: 'Vendas Realizadas',
          icon: ShoppingCart,
          badge: sales.length > 0 ? sales.length : undefined,
          description: 'Histórico de vendas e comprovantes',
        },
        {
          id: 'shifts',
          label: 'Plantões & Escala',
          icon: Calendar,
          badge: activeShift ? 'Em Curso' : undefined,
          badgeColor: 'bg-[#1f4e38] text-white',
          description: 'Escala colaborativa Rio Anil Shopping',
        },
      ],
    },
    {
      title: 'Catálogo & Estoque',
      items: [
        {
          id: 'stock',
          label: 'Estoque no Shopping',
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} alerta` : undefined,
          badgeColor: 'bg-[#ff7597] text-white',
          description: 'Controle de saldo mínimo e reposições',
        },
        {
          id: 'products',
          label: 'Produtos & Peças',
          icon: Package,
          badge: relevantProductsCount,
          description: 'Cadastro, precificação e etiquetas',
        },
      ],
    },
    {
      title: 'Comunidade & Ateliês',
      items: [
        {
          id: 'partners',
          label: 'Comunidade & Ateliês',
          icon: Users,
          badge: `${partners.length} marcas`,
          description: 'Diretório das marcas, mural e espaços',
        },
        {
          id: 'artisan-portal',
          label: 'Portal da Artesã',
          icon: Smartphone,
          badge: 'Mobile',
          badgeColor: 'bg-[#ffe4ee] text-[#db2777]',
          description: 'Visão simplificada para o celular',
        },
      ],
    },
    {
      title: 'Financeiro & Taxas',
      items: [
        {
          id: 'settlements',
          label: 'Fechamento de Repasses',
          icon: DollarSign,
          description: 'Transparência de repasses líquidos',
        },
        {
          id: 'fees',
          label: 'Regras de Taxas',
          icon: FileSpreadsheet,
          adminOnly: true,
          description: 'Taxas operacionais e rateio da casa',
        },
      ],
    },
    {
      title: 'Inteligência & Controle',
      items: [
        {
          id: 'reports',
          label: 'Relatórios & Métricas',
          icon: FileBarChart,
          description: 'Desempenho por categoria e período',
        },
        {
          id: 'audit',
          label: 'Trilha de Auditoria',
          icon: ShieldCheck,
          badge: unreadCount > 0 ? unreadCount : undefined,
          badgeColor: 'bg-[#f43f7e] text-white',
          adminOnly: true,
          description: 'Logs de segurança e rastreabilidade',
        },
      ],
    },
    {
      title: 'Administração & Sistema',
      items: [
        {
          id: 'settings',
          label: 'Configurações',
          icon: Settings,
          badge: 'Geral',
          badgeColor: 'bg-[#fff0f5] text-[#db2777] border border-[#fbcfe8]',
          adminOnly: true,
          description: 'Usuários, logo, dados da loja e parâmetros',
        },
      ],
    },
  ];

  // Filter sections if search is active
  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.adminOnly && userRole !== 'ADMIN') return false;
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }),
    }))
    .filter((section) => section.items.length > 0);

  // Get current active nav item details
  const allItems = navSections.flatMap((s) => s.items);
  const currentItem = allItems.find((i) => i.id === activeView) || allItems[0];

  const handleRoleChange = (role: UserRole, partnerId?: string) => {
    setUserRole(role, partnerId);
    setRoleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#380c25] flex flex-col font-sans">
      {/* Top Notification/Shift Micro-Bar */}
      <div className="bg-[#420f2c] text-[#fff0f5] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-[#2a071b] shrink-0 z-30">
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              activeShift ? 'bg-[#7ec498] animate-pulse shadow-[0_0_8px_#7ec498]' : 'bg-[#f43f7e]'
            }`}
          />
          <span>
            {activeShift ? (
              <>
                <strong className="text-white font-medium">Expediente Ativo:</strong>{' '}
                <span className="text-[#ff7597] font-semibold">{activeShift.operatorName}</span> (
                {activeShift.partnerName}) • Loja Rio Anil Shopping
              </>
            ) : (
              <span className="text-[#ffb8ce]">Nenhum expediente aberto no balcão físico</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-craft">
          <button
            onClick={onOpenShiftModal}
            className="text-[#ff7597] hover:text-white underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Clock className="w-3 h-3 text-[#ff7597]" />
            {activeShift ? 'Passar Plantão' : 'Iniciar Expediente'}
          </button>
          <span className="text-[#5c1a3e]">|</span>
          <button
            onClick={() => setActiveView('landing')}
            className="text-[#ffb8ce] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Abrir a vitrine pública da casa colaborativa"
          >
            <Store className="w-3 h-3" />
            <span>Ver Vitrine Pública</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-[#380c25]/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}

        {/* Dashboard Menu Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 bottom-0 left-0 z-50
            flex flex-col bg-[#ffffff] border-r border-[#fbcfe8] shadow-lg lg:shadow-none
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-68 w-76'}
          `}
        >
          {/* Sidebar Header with Brand Identity */}
          <div className="p-4 border-b border-[#fbcfe8] flex items-center justify-between shrink-0 bg-[#fff5f8]">
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
                title="Pinta e Borda — Painel de Gestão"
              >
                <div className="w-9 h-9 rounded-xl bg-[#380c25] text-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:ring-2 group-hover:ring-[#f43f7e]/40 transition-all p-0.5">
                  {storeSettings.logoUrl ? (
                    <img
                      src={storeSettings.logoUrl}
                      alt={storeSettings.storeName}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <span className="font-display font-bold text-sm tracking-tight">pb</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="leading-tight overflow-hidden">
                    <span className="font-display font-medium text-base tracking-tight text-[#380c25] block truncate">
                      pinta <em className="italic text-[#f43f7e]">e</em> borda
                    </span>
                    <span className="text-[9px] font-mono-craft font-semibold tracking-wider uppercase text-[#9b4f76] block">
                      Painel de Gestão
                    </span>
                  </div>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Desktop collapse toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-[#9b4f76] hover:text-[#380c25] hover:bg-[#ffe4ee] transition-colors cursor-pointer"
                title={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#9b4f76] hover:text-[#380c25] hover:bg-[#ffe4ee] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Search in Sidebar (when expanded) */}
          {!sidebarCollapsed && (
            <div className="px-3 pt-3 pb-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9b4f76] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Localizar módulo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#fff5f8] border border-[#fbcfe8] rounded-xl text-[#380c25] placeholder-[#9b4f76] focus:outline-none focus:border-[#f43f7e] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9b4f76] hover:text-[#380c25] text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links Grouped into Categories */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-4">
            {filteredSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <h3 className="px-2.5 text-[10px] font-mono-craft font-bold uppercase tracking-wider text-[#9b4f76]">
                    {section.title}
                  </h3>
                )}

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          setSidebarOpen(false);
                        }}
                        title={sidebarCollapsed ? `${item.label} — ${item.description || ''}` : item.description}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group relative
                          ${
                            isActive
                              ? 'bg-[#380c25] text-white shadow-xs font-semibold'
                              : 'text-[#501535] hover:bg-[#fff0f5] hover:text-[#f43f7e]'
                          }
                          ${sidebarCollapsed ? 'justify-center !px-2' : ''}
                        `}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-[#ff7597]' : 'text-[#9b4f76] group-hover:text-[#f43f7e]'
                          }`}
                        />

                        {!sidebarCollapsed && (
                          <div className="flex-1 flex items-center justify-between overflow-hidden">
                            <span className="truncate">{item.label}</span>
                            {item.badge !== undefined && (
                              <span
                                className={`text-[10px] font-mono-craft px-2 py-0.5 rounded-full font-bold ml-1.5 shrink-0 ${
                                  isActive
                                    ? 'bg-[#501535] text-[#ff7597]'
                                    : item.badgeColor || 'bg-[#fff0f5] text-[#db2777] border border-[#fbcfe8]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Collapsed active indicator bar */}
                        {sidebarCollapsed && isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#f43f7e] rounded-r-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer: Active Profile & Quick Links */}
          <div className="p-3 border-t border-[#fbcfe8] bg-[#fff5f8] shrink-0 space-y-2">
            {/* Active User / Profile Card */}
            <div
              onClick={onOpenAuth}
              className={`
                p-2 rounded-xl bg-white border border-[#fbcfe8] flex items-center gap-2.5 cursor-pointer hover:border-[#f43f7e] transition-all shadow-2xs
                ${sidebarCollapsed ? 'justify-center !p-1.5' : ''}
              `}
              title="Clique para alternar perfil (RBAC / Coordenação ou Artesã)"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-mono-craft font-bold shrink-0 ${
                  userRole === 'ADMIN' ? 'bg-[#380c25]' : 'bg-[#f43f7e]'
                }`}
              >
                {userRole === 'ADMIN' ? 'ADM' : currentPartner?.brandName.charAt(0) || 'P'}
              </div>

              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-bold text-[#380c25] truncate">
                    {userRole === 'ADMIN' ? 'Coordenação Geral' : currentPartner?.brandName}
                  </div>
                  <div className="text-[10px] text-[#9b4f76] truncate font-mono-craft">
                    {userRole === 'ADMIN' ? 'Acesso Total P&B' : currentPartner?.ownerName}
                  </div>
                </div>
              )}

              {!sidebarCollapsed && (
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#9b4f76] shrink-0" />
              )}
            </div>

            {/* Quick Public View & Dossier Buttons */}
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between text-[11px] px-1 pt-1 font-mono-craft text-[#9b4f76]">
                <button
                  onClick={() => setActiveView('landing')}
                  className="hover:text-[#f43f7e] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Store className="w-3 h-3" />
                  <span>Vitrine Loja</span>
                </button>
                {onOpenPresentation && (
                  <button
                    onClick={onOpenPresentation}
                    className="hover:text-[#f43f7e] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#f43f7e]" />
                    <span>Dossiê P&B</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area with Header */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Admin Header Bar */}
          <header className="sticky top-0 z-30 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#fbcfe8] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-2xs">
            {/* Left: Mobile Toggle & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#380c25] hover:bg-[#fff0f5] border border-[#fbcfe8] cursor-pointer"
                title="Abrir Menu Dashboard"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono-craft text-[#9b4f76] min-w-0">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hover:text-[#f43f7e] transition-colors truncate hidden sm:inline"
                >
                  Gestão P&B
                </button>
                <span className="hidden sm:inline">/</span>
                <div className="flex items-center gap-1.5 text-[#380c25] font-bold truncate">
                  <currentItem.icon className="w-4 h-4 text-[#f43f7e] shrink-0" />
                  <span className="truncate">{currentItem.label}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions, Notifications & Profile Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="solid-button !py-1.5 !px-3 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Ações rápidas de operação"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ações Rápidas</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>

                {quickActionsOpen && (
                  <div
                    onClick={() => setQuickActionsOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                )}

                {quickActionsOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#fbcfe8] p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-mono-craft font-bold uppercase tracking-wider text-[#9b4f76] border-b border-[#fbcfe8] mb-1">
                      Atalhos Operacionais
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('pdv');
                        setQuickActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 hover:bg-[#fff0f5] text-[#380c25] cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#f43f7e]" />
                      <div>
                        <div className="font-semibold">Nova Venda no Balcão</div>
                        <div className="text-[10px] text-[#9b4f76]">Frente de caixa do shopping</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('products');
                        setQuickActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 hover:bg-[#fff0f5] text-[#380c25] cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-[#f43f7e]" />
                      <div>
                        <div className="font-semibold">Cadastrar Novo Produto</div>
                        <div className="text-[10px] text-[#9b4f76]">Adicionar item ao catálogo</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onOpenShiftModal();
                        setQuickActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 hover:bg-[#fff0f5] text-[#380c25] cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-[#1f4e38]" />
                      <div>
                        <div className="font-semibold">Passar ou Iniciar Turno</div>
                        <div className="text-[10px] text-[#9b4f76]">Registro de plantão de loja</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('settlements');
                        setQuickActionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 hover:bg-[#fff0f5] text-[#380c25] cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-[#3c6b54]" />
                      <div>
                        <div className="font-semibold">Consultar Repasses</div>
                        <div className="text-[10px] text-[#9b4f76]">Valores líquidos das artesãs</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5] rounded-xl transition-colors cursor-pointer border border-[#fbcfe8]"
                title="Notificações e trilha de auditoria"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f43f7e] text-white text-[9px] font-mono-craft rounded-full flex items-center justify-center font-bold shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#fbcfe8] bg-white hover:bg-[#fff5f8] text-[#380c25] text-xs font-medium transition-all cursor-pointer shadow-2xs"
                  title="Alternar Perfil (Simulação RBAC)"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-mono-craft font-bold ${
                      userRole === 'ADMIN' ? 'bg-[#380c25]' : 'bg-[#f43f7e]'
                    }`}
                  >
                    {userRole === 'ADMIN' ? 'ADM' : currentPartner?.brandName.charAt(0) || 'P'}
                  </div>
                  <span className="font-semibold text-[#380c25] text-[11px] hidden md:inline">
                    {userRole === 'ADMIN' ? 'Coordenação' : currentPartner?.brandName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#b06a8f]" />
                </button>

                {roleDropdownOpen && (
                  <div
                    onClick={() => setRoleDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                )}

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#fbcfe8] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#fbcfe8]">
                      <p className="text-xs font-semibold text-[#9b4f76] uppercase tracking-wider font-mono-craft">
                        Alternar Perfil (RBAC)
                      </p>
                      <p className="text-[11px] text-[#863b63] mt-0.5">
                        Alterne entre visão de Coordenação Geral e ateliês individuais.
                      </p>
                    </div>

                    <button
                      onClick={() => handleRoleChange('ADMIN')}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#fff0f5] cursor-pointer ${
                        userRole === 'ADMIN' ? 'bg-[#fff0f5] text-[#380c25] font-semibold' : 'text-[#380c25]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#380c25] text-white flex items-center justify-center text-xs font-bold">
                          A
                        </div>
                        <div>
                          <div>Administrador Geral</div>
                          <div className="text-[10px] text-[#9b4f76]">Gestão global, taxas e fechamento</div>
                        </div>
                      </div>
                      {userRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#3c6b54]" />}
                    </button>

                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        setActiveView('artisan-portal');
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs bg-[#ffe4ee] hover:bg-[#ffd1e1] text-[#db2777] font-semibold border-y border-[#fbcfe8] cursor-pointer my-1"
                    >
                      <Smartphone className="w-4 h-4 text-[#f43f7e] shrink-0" />
                      <div>
                        <div>Abrir Portal da Artesã</div>
                        <div className="text-[10px] text-[#9b4f76] font-normal">
                          Visão adaptada para celular da produtora
                        </div>
                      </div>
                    </button>

                    <div className="px-3 py-1.5 text-[10px] font-semibold text-[#9b4f76] uppercase tracking-wider border-t border-[#fbcfe8] mt-1 font-mono-craft">
                      Marcas Parceiras (Visão Restrita)
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-[#fff0f5]">
                      {partners.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleRoleChange('PARTNER', p.id)}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-[#fff0f5] cursor-pointer ${
                            userRole === 'PARTNER' && currentPartner?.id === p.id
                              ? 'bg-[#ffe4ee] text-[#380c25] font-semibold'
                              : 'text-[#380c25]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#f43f7e] text-white flex items-center justify-center text-[10px] font-bold font-mono-craft">
                              {p.brandName.charAt(0)}
                            </div>
                            <div className="truncate">
                              <div className="truncate">{p.brandName}</div>
                              <div className="text-[10px] text-[#9b4f76] truncate">{p.segment}</div>
                            </div>
                          </div>
                          {userRole === 'PARTNER' && currentPartner?.id === p.id && (
                            <CheckCircle2 className="w-4 h-4 text-[#3c6b54] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
