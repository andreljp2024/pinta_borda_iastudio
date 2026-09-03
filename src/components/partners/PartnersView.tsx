import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Partner } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

export const PartnersView: React.FC = () => {
  const { partners, updatePartner, addPartner, userRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Partner Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Form State
  const [brandName, setBrandName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [category, setCategory] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'>('CPF');
  const [monthlyFee, setMonthlyFee] = useState<number>(350);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(10);
  const [worksShifts, setWorksShifts] = useState(true);
  const [spaceType, setSpaceType] = useState('Nicho Central');
  const [brandDescription, setBrandDescription] = useState('');

  const filteredPartners = partners.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBrand = p.brandName.toLowerCase().includes(q);
      const matchOwner = p.ownerName.toLowerCase().includes(q);
      const matchDoc = p.document.toLowerCase().includes(q);
      if (!matchBrand && !matchOwner && !matchDoc) return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleOpenEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setBrandName(partner.brandName);
    setOwnerName(partner.ownerName);
    setDocument(partner.document);
    setEmail(partner.email);
    setPhone(partner.phone);
    setWhatsapp(partner.whatsapp);
    setInstagram(partner.instagram || '');
    setCategory(partner.category);
    setPixKey(partner.pixKey);
    setPixKeyType(partner.pixKeyType);
    setMonthlyFee(partner.monthlyFee);
    setCommissionPercentage(partner.commissionPercentage);
    setWorksShifts(partner.worksShifts);
    setSpaceType(partner.spaceType);
    setBrandDescription(partner.brandDescription);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setBrandName('');
    setOwnerName('');
    setDocument('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setInstagram('');
    setCategory('Artesanato Geral');
    setPixKey('');
    setPixKeyType('CPF');
    setMonthlyFee(350);
    setCommissionPercentage(10);
    setWorksShifts(true);
    setSpaceType('Prateleira');
    setBrandDescription('');
    setIsModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !ownerName.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    if (editingPartner) {
      updatePartner(editingPartner.id, {
        brandName,
        ownerName,
        document,
        email,
        phone,
        whatsapp,
        instagram,
        category,
        pixKey,
        pixKeyType,
        monthlyFee,
        commissionPercentage,
        worksShifts,
        spaceType,
        brandDescription,
      });
    } else {
      addPartner({
        brandName,
        ownerName,
        document,
        email,
        phone,
        whatsapp,
        instagram,
        category,
        pixKey,
        pixKeyType,
        monthlyFee,
        commissionPercentage,
        worksShifts,
        spaceType,
        brandDescription,
        status: 'ATIVO',
        admissionDate: new Date().toISOString().split('T')[0],
        dueDay: 10,
        brandLogo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f43f7e] font-mono-craft">
            Comunidade de Criadores
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25]">
            Marcas & Artesãos Parceiros
          </h2>
          <p className="text-xs sm:text-sm text-[#9b4f76] mt-1 font-light">
            Gestão cadastral, dados bancários Pix, contratos e escalas dos ateliês do Rio Anil Shopping.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="solid-button text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#ff7597]" />
            <span>Cadastrar Novo Ateliê</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#fbcfe8] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between font-mono-craft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9b4f76] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca, artesão ou CPF/CNPJ..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#fbcfe8] focus:outline-none bg-white text-[#380c25]"
          />
        </div>

        <div className="text-xs text-[#9b4f76]">
          {filteredPartners.length} marcas cadastradas
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs hover:border-[#f43f7e]/40 hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.brandLogo}
                    alt={partner.brandName}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#fbcfe8] shadow-2xs"
                  />
                  <div>
                    <h4 className="font-display font-medium text-[#380c25] text-base">
                      {partner.brandName}
                    </h4>
                    <span className="text-xs text-[#9b4f76] font-light">{partner.ownerName}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-craft ${
                    partner.status === 'ATIVO'
                      ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                      : 'bg-[#fff0f5] text-[#863b63] border border-[#fbcfe8]'
                  }`}
                >
                  {partner.status}
                </span>
              </div>

              <div className="text-xs text-[#863b63] line-clamp-2 mb-4 font-light">
                {partner.brandDescription}
              </div>

              {/* Badges / Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#fff0f5]/60 rounded-xl p-3 border border-[#fbcfe8] mb-4 font-mono-craft">
                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Espaço Físico:</span>
                  <strong className="text-[#380c25]">{partner.spaceType}</strong>
                </div>

                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Mensalidade:</span>
                  <strong className="text-[#380c25]">
                    R$ {partner.monthlyFee.toFixed(2).replace('.', ',')}/mês
                  </strong>
                </div>

                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Chave Pix:</span>
                  <span className="text-[#380c25] text-[10px] truncate block">
                    {partner.pixKey}
                  </span>
                </div>

                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Escala de Plantão:</span>
                  <strong
                    className={partner.worksShifts ? 'text-[#3c6b54]' : 'text-[#f43f7e]'}
                  >
                    {partner.worksShifts ? 'Cumpre Plantão' : 'Taxa Diarista'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#3c6b54] hover:bg-[#dff0e6] rounded-lg transition-colors cursor-pointer"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {partner.instagram && (
                  <a
                    href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#f43f7e] hover:bg-[#ffe4ee] rounded-lg transition-colors cursor-pointer"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => handleOpenEdit(partner)}
                  className="outline-button !py-1 !px-2.5 text-xs font-mono-craft flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Partner Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-medium text-xl text-[#380c25]">
              {editingPartner ? 'Editar Ateliê Parceiro' : 'Novo Ateliê Parceiro'}
            </h3>

            <form onSubmit={handleSavePartner} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Nome da Marca</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    placeholder="Ex: Tutabel"
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Nome do Artesão</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                    placeholder="Ex: Maria Alice Rodrigues"
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono-craft bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">WhatsApp de Atendimento</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    placeholder="(98) 98123-4567"
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Instagram (@)</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@marca.artesanal"
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Chave Pix Repasse</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono-craft bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Tipo da Chave Pix</label>
                  <select
                    value={pixKeyType}
                    onChange={(e) => setPixKeyType(e.target.value as any)}
                    className="w-full p-2.5 bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] text-xs focus:outline-none"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="PHONE">Telefone</option>
                    <option value="RANDOM">Chave Aleatória</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-bold font-mono-craft bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Espaço no Ponto</label>
                  <input
                    type="text"
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    placeholder="Ex: Nicho Central, Arara..."
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Descrição do Ateliê</label>
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div className="pt-2 font-mono-craft">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={worksShifts}
                    onChange={(e) => setWorksShifts(e.target.checked)}
                    className="rounded text-[#3c6b54] focus:ring-[#3c6b54]"
                  />
                  <span className="font-semibold text-[#380c25]">
                    Cumpre escala de plantão no shopping (se desmarcado, paga diarista)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#fbcfe8] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button text-xs font-bold"
                >
                  Salvar Dados do Ateliê
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
