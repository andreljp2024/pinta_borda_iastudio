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
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Comunidade de Criadores
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Marcas & Artesãos Parceiros
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão cadastral, dados bancários Pix, contratos e escalas dos ateliês do Rio Anil Shopping.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Cadastrar Novo Ateliê
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca, artesão ou CPF/CNPJ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
          />
        </div>

        <div className="text-xs text-stone-500 font-medium">
          {filteredPartners.length} marcas cadastradas
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.brandLogo}
                    alt={partner.brandName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-stone-100 shadow-xs"
                  />
                  <div>
                    <h4 className="font-serif-display font-bold text-stone-900 text-base">
                      {partner.brandName}
                    </h4>
                    <span className="text-xs text-stone-500">{partner.ownerName}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    partner.status === 'ATIVO'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {partner.status}
                </span>
              </div>

              <div className="text-xs text-stone-600 line-clamp-2 mb-4">
                {partner.brandDescription}
              </div>

              {/* Badges / Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 rounded-xl p-3 border border-stone-200/70 mb-4">
                <div>
                  <span className="text-stone-400 block">Espaço Físico:</span>
                  <strong className="text-stone-800">{partner.spaceType}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block">Mensalidade:</span>
                  <strong className="text-stone-800">
                    R$ {partner.monthlyFee.toFixed(2)}/mês
                  </strong>
                </div>

                <div>
                  <span className="text-stone-400 block">Chave Pix:</span>
                  <span className="text-stone-800 font-mono text-[10px] truncate block">
                    {partner.pixKey}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block">Escala de Plantão:</span>
                  <strong
                    className={partner.worksShifts ? 'text-emerald-700' : 'text-amber-800'}
                  >
                    {partner.worksShifts ? 'Cumpre Plantão' : 'Taxa Diarista'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {partner.instagram && (
                  <a
                    href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-pink-700 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

              {userRole === 'ADMIN' && (
                <button
                  onClick={() => handleOpenEdit(partner)}
                  className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              {editingPartner ? 'Editar Ateliê Parceiro' : 'Novo Ateliê Parceiro'}
            </h3>

            <form onSubmit={handleSavePartner} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome da Marca</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    placeholder="Ex: Tutabel"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome do Artesão</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                    placeholder="Ex: Maria Alice Rodrigues"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">WhatsApp de Atendimento</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    placeholder="(98) 98123-4567"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@marca.artesanal"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Chave Pix Repasse</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tipo da Chave Pix</label>
                  <select
                    value={pixKeyType}
                    onChange={(e) => setPixKeyType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="PHONE">Telefone</option>
                    <option value="RANDOM">Chave Aleatória</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mensalidade (R$)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Espaço no Ponto</label>
                  <input
                    type="text"
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    placeholder="Ex: Nicho Central, Arara..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descrição do Ateliê</label>
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={worksShifts}
                    onChange={(e) => setWorksShifts(e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-700"
                  />
                  <span className="font-semibold text-stone-800">
                    Cumpre escala de plantão no shopping (se desmarcado, paga diarista)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold cursor-pointer shadow-sm"
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
