import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Instagram,
  QrCode,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Clock,
  LayoutGrid,
  List,
  Store,
  Bell,
  BookOpen,
  MapPin,
  Copy,
  Check,
  Smartphone,
  Eye,
  Trash2,
  Power,
  Package,
  Layers,
  Phone,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Partner, UserRole } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';
import { PartnerCard } from './PartnerCard';
import { PartnerDetailModal } from './PartnerDetailModal';
import { PartnerFormModal } from './PartnerFormModal';
import { CommunityMuralTab } from './CommunityMuralTab';
import { SpacesMapTab } from './SpacesMapTab';
import { CollectiveGuidelinesTab } from './CollectiveGuidelinesTab';

export const PartnersView: React.FC = () => {
  const {
    partners,
    products,
    shifts,
    sales,
    settlements,
    announcements,
    userRole,
    setUserRole,
    addPartner,
    updatePartner,
    deletePartner,
    togglePartnerStatus,
    createAnnouncement,
    deleteAnnouncement,
    setActiveView,
    navigateToStoreWithPartner,
  } = useApp();

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<'ATELIES' | 'MURAL' | 'MAPA' | 'REGIMENTO'>('ATELIES');

  // Filters for Ateliês
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);
  const [formPartner, setFormPartner] = useState<Partner | null>(null);
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [showContactListModal, setShowContactListModal] = useState(false);
  const [copiedContacts, setCopiedContacts] = useState(false);
  const [copiedPixId, setCopiedPixId] = useState<string | null>(null);

  // Dynamic Categories from Partners
  const categories = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [partners]);

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesSearch =
        p.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.document && p.document.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;

      const currentStatus = p.status || p.contract?.status || 'ATIVO';
      const matchesStatus =
        selectedStatus === 'ALL' || currentStatus === selectedStatus;

      const worksShifts =
        p.worksShifts ?? (p.contract?.shiftRequirement === 'REGULAR');
      const matchesShift =
        selectedShiftFilter === 'ALL' ||
        (selectedShiftFilter === 'SHIFTS' && worksShifts) ||
        (selectedShiftFilter === 'EXEMPT' && !worksShifts);

      return matchesSearch && matchesCategory && matchesStatus && matchesShift;
    });
  }, [partners, searchTerm, selectedCategory, selectedStatus, selectedShiftFilter]);

  // Statistics
  const activeCount = partners.filter(
    (p) => (p.status || p.contract?.status) === 'ATIVO'
  ).length;

  const regularShiftCount = partners.filter(
    (p) => p.worksShifts ?? (p.contract?.shiftRequirement === 'REGULAR')
  ).length;

  const totalCatalogUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  // Quick Action: Open Artisan Portal for a specific Partner
  const handleOpenArtisanPortal = (partner: Partner) => {
    setUserRole('PARTNER', partner.id);
    setActiveView('artisan-portal');
  };

  // Quick Action: Open Store filtered by Partner
  const handleOpenStoreWithPartner = (partnerId: string) => {
    if (navigateToStoreWithPartner) {
      navigateToStoreWithPartner(partnerId);
    } else {
      setActiveView('store');
    }
  };

  // Save Partner (Create or Update)
  const handleSavePartner = (partnerData: any) => {
    if (formPartner) {
      updatePartner(formPartner.id, partnerData);
    } else {
      addPartner(partnerData);
    }
    setFormPartner(null);
    setIsCreatingPartner(false);
  };

  // Copy Contact List
  const handleCopyContacts = () => {
    const list = partners
      .map(
        (p) =>
          `• *${p.brandName}* (${p.ownerName}) - WhatsApp: ${p.whatsapp || p.phone || 'N/A'}`
      )
      .join('\n');

    const text = `📋 *LISTA DE CONTATOS DAS ARTESÃS - PINTA E BORDA*\n\n${list}\n\n_Casa Colaborativa no Rio Anil Shopping_`;
    navigator.clipboard.writeText(text);
    setCopiedContacts(true);
    setTimeout(() => setCopiedContacts(false), 2500);
  };

  const handleCopyPix = (partner: Partner) => {
    if (!partner.pixKey) return;
    navigator.clipboard.writeText(partner.pixKey);
    setCopiedPixId(partner.id);
    setTimeout(() => setCopiedPixId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#fbcfe8] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-craft font-semibold bg-[#fff0f5] text-[#f43f7e] border border-[#fbcfe8]">
              Comunidade & Ateliês
            </span>
            <span className="text-xs text-[#9b4f76] font-mono-craft">
              Rio Anil Shopping • Piso 2
            </span>
          </div>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#380c25]">
            Marcas Autorais & Convivência Coletiva
          </h2>
          <p className="text-xs sm:text-sm text-[#863b63] mt-0.5 font-light max-w-2xl">
            Gestão integrada das 15 marcas parceiras, dados contratuais e repasses Pix, mural de
            comunicados coletivos e mapa de alocação física no shopping.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap font-mono-craft text-xs">
          <button
            type="button"
            onClick={() => setShowContactListModal(true)}
            className="outline-button !py-2 !px-3 text-xs flex items-center gap-1.5"
            title="Ver e copiar telefones de contato de todas as artesãs"
          >
            <Phone className="w-3.5 h-3.5 text-[#1f4e38]" />
            <span>Contatos WhatsApp</span>
          </button>

          {userRole === 'ADMIN' && (
            <button
              type="button"
              onClick={() => {
                setFormPartner(null);
                setIsCreatingPartner(true);
              }}
              className="solid-button !py-2 !px-4 text-xs flex items-center gap-1.5 font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Ateliê</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-[#9b4f76] mb-1">
            <span className="text-xs font-mono-craft uppercase font-medium">Marcas no Coletivo</span>
            <Users className="w-4 h-4 text-[#f43f7e]" />
          </div>
          <div className="font-display font-medium text-2xl sm:text-3xl text-[#380c25]">
            {activeCount}{' '}
            <span className="text-xs font-mono-craft font-normal text-[#9b4f76]">
              / {partners.length} ativas
            </span>
          </div>
          <span className="text-[11px] text-[#1f4e38] font-mono-craft block mt-1">
            100% autoral maranhense
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-[#9b4f76] mb-1">
            <span className="text-xs font-mono-craft uppercase font-medium">Estrutura & Nichos</span>
            <Store className="w-4 h-4 text-[#3c6b54]" />
          </div>
          <div className="font-display font-medium text-2xl sm:text-3xl text-[#380c25]">
            15{' '}
            <span className="text-xs font-mono-craft font-normal text-[#9b4f76]">espaços</span>
          </div>
          <span className="text-[11px] text-[#1f4e38] font-mono-craft block mt-1">
            100% taxa de ocupação
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-[#9b4f76] mb-1">
            <span className="text-xs font-mono-craft uppercase font-medium">Regime de Plantão</span>
            <Clock className="w-4 h-4 text-[#f43f7e]" />
          </div>
          <div className="font-display font-medium text-2xl sm:text-3xl text-[#380c25]">
            {regularShiftCount}{' '}
            <span className="text-xs font-mono-craft font-normal text-[#9b4f76]">
              na escala
            </span>
          </div>
          <span className="text-[11px] text-[#863b63] font-mono-craft block mt-1">
            {partners.length - regularShiftCount} com diaristas pagas
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-[#9b4f76] mb-1">
            <span className="text-xs font-mono-craft uppercase font-medium">Mural de Avisos</span>
            <Bell className="w-4 h-4 text-[#db2777]" />
          </div>
          <div className="font-display font-medium text-2xl sm:text-3xl text-[#380c25]">
            {announcements.length}{' '}
            <span className="text-xs font-mono-craft font-normal text-[#9b4f76]">
              comunicados
            </span>
          </div>
          <span className="text-[11px] text-[#db2777] font-mono-craft block mt-1">
            Alinhamento coletivo ativo
          </span>
        </div>
      </div>

      {/* 3. Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#fbcfe8] pb-1 font-mono-craft text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('ATELIES')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ATELIES'
              ? 'bg-[#380c25] text-white shadow-2xs'
              : 'text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ateliês & Marcas ({partners.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MURAL')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'MURAL'
              ? 'bg-[#380c25] text-white shadow-2xs'
              : 'text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Mural da Casa ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MAPA')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'MAPA'
              ? 'bg-[#380c25] text-white shadow-2xs'
              : 'text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Mapa dos Nichos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REGIMENTO')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'REGIMENTO'
              ? 'bg-[#380c25] text-white shadow-2xs'
              : 'text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Regimento & Diretrizes</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: ATELIÊS & MARCAS */}
      {activeTab === 'ATELIES' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#fbcfe8] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono-craft">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b4f76] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por marca, artesão(ã), CPF/CNPJ ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#fff0f5]/40 border border-[#fbcfe8] rounded-xl text-xs text-[#380c25] focus:outline-none focus:ring-1 focus:ring-[#f43f7e] placeholder:text-[#9b4f76]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Select Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 bg-white border border-[#fbcfe8] rounded-xl text-xs text-[#380c25] focus:outline-none"
              >
                <option value="ALL">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="py-2 px-3 bg-white border border-[#fbcfe8] rounded-xl text-xs text-[#380c25] focus:outline-none"
              >
                <option value="ALL">Todos os Status</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
                <option value="SUSPENSO">Suspensos</option>
                <option value="PENDENTE">Pendentes</option>
              </select>

              {/* Shift Filter */}
              <select
                value={selectedShiftFilter}
                onChange={(e) => setSelectedShiftFilter(e.target.value)}
                className="py-2 px-3 bg-white border border-[#fbcfe8] rounded-xl text-xs text-[#380c25] focus:outline-none"
              >
                <option value="ALL">Todos os Plantões</option>
                <option value="SHIFTS">Cumpre Escala</option>
                <option value="EXEMPT">Paga Diarista</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#fff0f5] p-0.5 rounded-xl border border-[#fbcfe8]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#f43f7e] shadow-2xs font-bold'
                      : 'text-[#863b63] hover:text-[#380c25]'
                  }`}
                  title="Visualização em Grade"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-[#f43f7e] shadow-2xs font-bold'
                      : 'text-[#863b63] hover:text-[#380c25]'
                  }`}
                  title="Visualização em Tabela"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count and State */}
          <div className="flex items-center justify-between text-xs text-[#9b4f76] font-mono-craft px-1">
            <span>
              Exibindo <strong>{filteredPartners.length}</strong> de {partners.length} marcas
            </span>
            {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedShiftFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                  setSelectedShiftFilter('ALL');
                }}
                className="text-[#f43f7e] hover:underline"
              >
                Limpar Filtros
              </button>
            )}
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPartners.map((partner) => {
                const partnerProducts = products.filter((p) => p.partnerId === partner.id);
                const totalStock = partnerProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

                return (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    productCount={partnerProducts.length}
                    totalStock={totalStock}
                    userRole={userRole}
                    onViewDetail={setDetailPartner}
                    onEdit={(p) => {
                      setFormPartner(p);
                      setIsCreatingPartner(false);
                    }}
                    onToggleStatus={userRole === 'ADMIN' ? togglePartnerStatus : undefined}
                    onOpenPortal={handleOpenArtisanPortal}
                  />
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-craft">
                  <thead className="bg-[#fff5f8] border-b border-[#fbcfe8] text-[#9b4f76] uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5 font-semibold">Marca & Logo</th>
                      <th className="p-3.5 font-semibold">Artesã(ão)</th>
                      <th className="p-3.5 font-semibold">Categoria</th>
                      <th className="p-3.5 font-semibold">Espaço</th>
                      <th className="p-3.5 font-semibold">Mensalidade</th>
                      <th className="p-3.5 font-semibold">Plantão</th>
                      <th className="p-3.5 font-semibold">Chave Pix</th>
                      <th className="p-3.5 font-semibold">Status</th>
                      <th className="p-3.5 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fbcfe8]/70">
                    {filteredPartners.map((partner) => {
                      const monthlyFee = partner.monthlyFee ?? partner.contract?.monthlyFee ?? 350;
                      const worksShifts = partner.worksShifts ?? (partner.contract?.shiftRequirement === 'REGULAR');
                      const status = partner.status || partner.contract?.status || 'ATIVO';

                      return (
                        <tr
                          key={partner.id}
                          className="hover:bg-[#fff5f8]/50 transition-colors group"
                        >
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={partner.brandLogo}
                                alt={partner.brandName}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                                className="w-8 h-8 rounded-full object-cover border border-[#fbcfe8] shrink-0"
                              />
                              <span className="font-display font-medium text-[#380c25] text-xs">
                                {partner.brandName}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5 text-[#863b63]">{partner.ownerName}</td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#fff0f5] text-[#863b63] border border-[#fbcfe8]">
                              {partner.category}
                            </span>
                          </td>

                          <td className="p-3.5 text-[#380c25]">{partner.spaceType || 'Nicho Central'}</td>

                          <td className="p-3.5 font-bold text-[#380c25]">
                            R$ {monthlyFee.toFixed(2).replace('.', ',')}
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                worksShifts
                                  ? 'bg-[#dff0e6] text-[#1f4e38]'
                                  : 'bg-[#fff0f5] text-[#863b63]'
                              }`}
                            >
                              {worksShifts ? 'Cumpre Escala' : 'Paga Diarista'}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[11px] truncate max-w-[120px]">
                                {partner.pixKey || 'Não cadastrada'}
                              </span>
                              {partner.pixKey && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyPix(partner)}
                                  className="p-1 hover:bg-[#fff0f5] rounded text-[#863b63]"
                                  title="Copiar Pix"
                                >
                                  {copiedPixId === partner.id ? (
                                    <Check className="w-3.5 h-3.5 text-[#1f4e38]" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                status === 'ATIVO'
                                  ? 'bg-[#dff0e6] text-[#1f4e38]'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setDetailPartner(partner)}
                                className="p-1.5 text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5] rounded-lg transition-colors"
                                title="Ver Ficha Completa"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {partner.whatsapp && (
                                <a
                                  href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-[#1f4e38] hover:bg-[#dff0e6] rounded-lg transition-colors"
                                  title="Chamar no WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {userRole === 'ADMIN' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormPartner(partner);
                                    setIsCreatingPartner(false);
                                  }}
                                  className="p-1.5 text-[#380c25] hover:bg-[#fff0f5] rounded-lg transition-colors"
                                  title="Editar Ateliê"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredPartners.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#fbcfe8]">
              <Users className="w-10 h-10 text-[#f43f7e] mx-auto mb-2 opacity-50" />
              <h4 className="font-display font-medium text-[#380c25] text-lg">
                Nenhuma marca encontrada
              </h4>
              <p className="text-xs text-[#863b63] font-light mt-1">
                Tente ajustar os filtros de busca, categoria ou status da marca.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MURAL DA CASA */}
      {activeTab === 'MURAL' && (
        <CommunityMuralTab
          announcements={announcements}
          userRole={userRole}
          onCreateAnnouncement={createAnnouncement}
          onDeleteAnnouncement={deleteAnnouncement}
        />
      )}

      {/* TAB 3: MAPA DOS NICHOS */}
      {activeTab === 'MAPA' && (
        <SpacesMapTab
          partners={partners}
          onSelectPartner={setDetailPartner}
        />
      )}

      {/* TAB 4: REGIMENTO & DIRETRIZES */}
      {activeTab === 'REGIMENTO' && <CollectiveGuidelinesTab />}

      {/* 5. Modals & Drawers */}

      {/* Partner Detail Modal */}
      {detailPartner && (
        <PartnerDetailModal
          partner={detailPartner}
          products={products}
          shifts={shifts}
          settlements={settlements}
          userRole={userRole}
          onClose={() => setDetailPartner(null)}
          onEdit={(p) => {
            setDetailPartner(null);
            setFormPartner(p);
            setIsCreatingPartner(false);
          }}
          onOpenPortal={handleOpenArtisanPortal}
          onOpenStore={handleOpenStoreWithPartner}
        />
      )}

      {/* Partner Form Modal (Create / Edit) */}
      {(isCreatingPartner || formPartner) && (
        <PartnerFormModal
          partner={formPartner}
          categories={categories}
          onClose={() => {
            setFormPartner(null);
            setIsCreatingPartner(false);
          }}
          onSave={handleSavePartner}
        />
      )}

      {/* Contact List Modal */}
      {showContactListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#fbcfe8] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-[#fbcfe8] bg-[#fff5f8] flex items-center justify-between">
              <div>
                <h3 className="font-display font-medium text-lg text-[#380c25]">
                  Contatos WhatsApp das Artesãs
                </h3>
                <p className="text-xs text-[#9b4f76]">
                  Lista telefônica das 15 marcas parceiras para recados e plantão.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContactListModal(false)}
                className="text-[#863b63] hover:text-[#380c25] p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 divide-y divide-[#fbcfe8]/70 text-xs">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="py-2.5 flex items-center justify-between gap-3 font-mono-craft"
                >
                  <div className="min-w-0">
                    <strong className="text-[#380c25] block text-xs truncate">
                      {p.brandName}
                    </strong>
                    <span className="text-[11px] text-[#9b4f76] block truncate">
                      {p.ownerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#380c25] font-mono text-xs">
                      {p.whatsapp || p.phone || 'Sem telefone'}
                    </span>
                    {p.whatsapp && (
                      <a
                        href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="solid-button !py-1 !px-2 text-[11px] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Chamar
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#fff5f8] border-t border-[#fbcfe8] flex items-center justify-between font-mono-craft text-xs">
              <button
                type="button"
                onClick={handleCopyContacts}
                className="outline-button !py-2 !px-3 text-xs flex items-center gap-1.5 font-bold"
              >
                {copiedContacts ? <Check className="w-4 h-4 text-[#1f4e38]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedContacts ? 'Contatos Copiados!' : 'Copiar Todos os Contatos'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowContactListModal(false)}
                className="outline-button !py-2 !px-4 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
