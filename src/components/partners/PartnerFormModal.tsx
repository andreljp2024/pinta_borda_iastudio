import React, { useState, useEffect } from 'react';
import { X, Check, Store, DollarSign, Shield, Phone, Mail, Instagram, FileText } from 'lucide-react';
import { Partner, PartnerStatus } from '../../types';

interface PartnerFormModalProps {
  partner: Partner | null; // null for creation
  categories: string[];
  onClose: () => void;
  onSave: (partnerData: any) => void;
}

export const PartnerFormModal: React.FC<PartnerFormModalProps> = ({
  partner,
  categories,
  onClose,
  onSave,
}) => {
  // Form State
  const [brandName, setBrandName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [category, setCategory] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandLogo, setBrandLogo] = useState('');

  // Financial & Pix
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA'>('CPF');
  const [pixHolderName, setPixHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAgency, setBankAgency] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  // Contract & Space
  const [monthlyFee, setMonthlyFee] = useState<number>(350);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(10);
  const [worksShifts, setWorksShifts] = useState(true);
  const [spaceType, setSpaceType] = useState('Nicho Central');
  const [dueDay, setDueDay] = useState<number>(10);
  const [status, setStatus] = useState<PartnerStatus>('ATIVO');

  useEffect(() => {
    if (partner) {
      setBrandName(partner.brandName || partner.name || '');
      setTradeName(partner.tradeName || '');
      setOwnerName(partner.ownerName || '');
      setDocument(partner.document || '');
      setEmail(partner.email || '');
      setPhone(partner.phone || '');
      setWhatsapp(partner.whatsapp || '');
      setInstagram(partner.instagram || '');
      setCategory(partner.category || (categories[0] || 'Bordados & Decor'));
      setBrandDescription(partner.brandDescription || '');
      setBrandLogo(partner.brandLogo || '');

      setPixKey(partner.pixKey || '');
      setPixKeyType((partner.pixKeyType as any) || 'CPF');
      setPixHolderName(partner.pixHolderName || partner.ownerName || '');
      setBankName(partner.bankInfo?.bank || '');
      setBankAgency(partner.bankInfo?.agency || '');
      setBankAccount(partner.bankInfo?.account || '');

      setMonthlyFee(partner.monthlyFee ?? partner.contract?.monthlyFee ?? 350);
      setCommissionPercentage(partner.commissionPercentage ?? partner.contract?.salesCommissionRate ?? 10);
      setWorksShifts(partner.worksShifts ?? (partner.contract?.shiftRequirement === 'REGULAR'));
      setSpaceType(partner.spaceType || 'Nicho Central');
      setDueDay(partner.dueDay ?? 10);
      setStatus(partner.status || partner.contract?.status || 'ATIVO');
    } else {
      setBrandName('');
      setTradeName('');
      setOwnerName('');
      setDocument('');
      setEmail('');
      setPhone('');
      setWhatsapp('');
      setInstagram('');
      setCategory(categories[0] || 'Bordados & Decor');
      setBrandDescription('');
      setBrandLogo('https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80');

      setPixKey('');
      setPixKeyType('CPF');
      setPixHolderName('');
      setBankName('');
      setBankAgency('');
      setBankAccount('');

      setMonthlyFee(350);
      setCommissionPercentage(10);
      setWorksShifts(true);
      setSpaceType('Nicho Central');
      setDueDay(10);
      setStatus('ATIVO');
    }
  }, [partner, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !ownerName.trim()) {
      alert('Favor preencher o Nome da Marca e o Nome do Artesão Responsável.');
      return;
    }

    const payload = {
      name: brandName,
      brandName,
      tradeName: tradeName.trim() || brandName,
      ownerName,
      document,
      email,
      phone: phone || whatsapp,
      whatsapp,
      instagram,
      category,
      brandDescription,
      brandLogo:
        brandLogo.trim() ||
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
      pixKey,
      pixKeyType,
      pixHolderName: pixHolderName || ownerName,
      bankInfo: bankName
        ? {
            bank: bankName,
            agency: bankAgency,
            account: bankAccount,
          }
        : undefined,
      monthlyFee: Number(monthlyFee),
      commissionPercentage: Number(commissionPercentage),
      worksShifts,
      spaceType,
      dueDay: Number(dueDay),
      status,
      contract: {
        id: partner?.contract?.id || `cont-${Date.now()}`,
        startDate: partner?.contract?.startDate || new Date().toISOString().split('T')[0],
        monthlyFee: Number(monthlyFee),
        salesCommissionRate: Number(commissionPercentage),
        commissionBase: 'BRUTO' as const,
        shiftRequirement: worksShifts ? ('REGULAR' as const) : ('ISENTO_COM_TAXA' as const),
        shiftFeePerDay: worksShifts ? 0 : 50,
        pixMode: 'DIRETO' as const,
        status,
      },
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#fbcfe8] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#fbcfe8] bg-[#fff5f8]">
          <div>
            <h3 className="font-display font-medium text-xl text-[#380c25]">
              {partner ? `Editar Ateliê: ${partner.brandName}` : 'Cadastrar Novo Ateliê Parceiro'}
            </h3>
            <p className="text-xs text-[#9b4f76] mt-0.5">
              Gestão de dados autorais, termos contratuais e recebimento Pix no Rio Anil Shopping.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* SEÇÃO 1: IDENTIDADE DA MARCA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#380c25] font-mono-craft text-xs uppercase font-bold border-b border-[#fbcfe8] pb-1">
              <Store className="w-4 h-4 text-[#f43f7e]" />
              <span>1. Identidade da Marca & Curadoria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Nome da Marca Autoral *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  placeholder="Ex: Tutabel, Armonizzare..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none focus:ring-1 focus:ring-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Artesão(ã) Responsável *
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  placeholder="Ex: Danielle Carvalho"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none focus:ring-1 focus:ring-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Razão Social / Nome Fantasia
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="Ex: Danielle Carvalho Confecções ME"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Categoria de Artesanato
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Outro Artesanato">Outro Artesanato</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  URL da Foto / Logomarca
                </label>
                <input
                  type="url"
                  value={brandLogo}
                  onChange={(e) => setBrandLogo(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] font-mono focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Biografia & Manifesto Autoral
                </label>
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  rows={2}
                  placeholder="Breve história sobre os materiais, técnicas e propósito da marca..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: CONTATOS & REDES SOCIAIS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#380c25] font-mono-craft text-xs uppercase font-bold border-b border-[#fbcfe8] pb-1">
              <Phone className="w-4 h-4 text-[#f43f7e]" />
              <span>2. Contato & Redes Sociais</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  CPF ou CNPJ
                </label>
                <input
                  type="text"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@atelie.com.br"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  WhatsApp (com DDD) *
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(98) 98123-4567"
                  required
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Instagram (@)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@marca.artesanal"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: CONTRATO & ESPAÇO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#380c25] font-mono-craft text-xs uppercase font-bold border-b border-[#fbcfe8] pb-1">
              <FileText className="w-4 h-4 text-[#f43f7e]" />
              <span>3. Espaço no Shopping & Contrato Coletivo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Espaço Físico Ocupado
                </label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                >
                  <option value="Nicho Central 01">Nicho Central 01</option>
                  <option value="Nicho Central 02">Nicho Central 02</option>
                  <option value="Nicho Central 03">Nicho Central 03</option>
                  <option value="Nicho Lateral A">Nicho Lateral A</option>
                  <option value="Nicho Lateral B">Nicho Lateral B</option>
                  <option value="Arara Coletiva 01">Arara Coletiva 01</option>
                  <option value="Arara Coletiva 02">Arara Coletiva 02</option>
                  <option value="Balcão Vitrine 01">Balcão Vitrine 01</option>
                  <option value="Prateleira Suspensa 01">Prateleira Suspensa 01</option>
                  <option value="Nicho Geral">Nicho Geral</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Mensalidade (R$/mês) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono font-bold bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Comissão da Loja (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionPercentage}
                  onChange={(e) => setCommissionPercentage(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono font-bold bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Dia de Vencimento
                </label>
                <select
                  value={dueDay}
                  onChange={(e) => setDueDay(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                >
                  <option value={5}>Dia 05</option>
                  <option value={10}>Dia 10 (Padrão)</option>
                  <option value={15}>Dia 15</option>
                  <option value={20}>Dia 20</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Status Cadastral
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PartnerStatus)}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                >
                  <option value="ATIVO">ATIVO (Exposto na loja)</option>
                  <option value="INATIVO">INATIVO (Temporariamente fora)</option>
                  <option value="SUSPENSO">SUSPENSO (Pendente)</option>
                  <option value="PENDENTE">PENDENTE (Aguardando termo)</option>
                </select>
              </div>

              <div className="sm:col-span-3 pt-1">
                <label className="flex items-center gap-2 p-3 bg-[#fff0f5] rounded-xl border border-[#fbcfe8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={worksShifts}
                    onChange={(e) => setWorksShifts(e.target.checked)}
                    className="rounded text-[#1f4e38] focus:ring-[#1f4e38] w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-[#380c25] block">
                      Cumpre escala presencial de atendimento no Rio Anil Shopping
                    </span>
                    <span className="text-[11px] text-[#9b4f76]">
                      Se desmarcado, a marca contribuirá com a taxa de diarista substituta (R$ 50/dia)
                      conforme o regimento interno.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SEÇÃO 4: DADOS BANCÁRIOS & PIX */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#380c25] font-mono-craft text-xs uppercase font-bold border-b border-[#fbcfe8] pb-1">
              <DollarSign className="w-4 h-4 text-[#f43f7e]" />
              <span>4. Dados Bancários & Chave Pix de Liquidação</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Chave Pix Repasses *
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  required
                  placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Tipo da Chave Pix
                </label>
                <select
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value as any)}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="ALEATORIA">Chave Aleatória</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Nome do Titular da Conta Pix
                </label>
                <input
                  type="text"
                  value={pixHolderName}
                  onChange={(e) => setPixHolderName(e.target.value)}
                  placeholder="Nome completo conforme cadastro no banco"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#fbcfe8] font-mono-craft">
            <button
              type="button"
              onClick={onClose}
              className="outline-button !py-2 !px-4 text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="solid-button !py-2 !px-5 text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{partner ? 'Salvar Alterações' : 'Cadastrar Ateliê'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
