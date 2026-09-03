import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Globe,
  Clock,
  QrCode,
  Check,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreSettings } from '../../types';

export const StoreDataTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useApp();

  const [formData, setFormData] = useState<StoreSettings>({ ...storeSettings });
  const [isSaved, setIsSaved] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(formData.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fff0f5] text-[#f43f7e]">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-[#380c25]">
              Dados Institucionais da Pinta e Borda
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Cadastros jurídicos, endereço no Rio Anil Shopping, canais de contato e conta bancária/PIX oficial.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-xs font-semibold shadow-md shadow-[#f43f7e]/20 flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-white" />
              Salvo com Sucesso!
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Salvar Dados da Loja
            </>
          )}
        </button>
      </div>

      {/* Grid: 3 Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Informações Jurídicas & Fiscais */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-[#f43f7e]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
              Identificação Jurídica & Fiscal
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Nome de Fachada / Fantasia *
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Razão Social da Associação / Coletivo *
              </label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => handleChange('legalName', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.document}
                  onChange={(e) => handleChange('document', e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={formData.stateRegistration || ''}
                  onChange={(e) => handleChange('stateRegistration', e.target.value)}
                  placeholder="Isento ou nº"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Endereço & Localização no Shopping */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-[#f43f7e]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
              Localização Física no Shopping
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Shopping Center *
                </label>
                <input
                  type="text"
                  value={formData.shoppingName}
                  onChange={(e) => handleChange('shoppingName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Piso & Número da Loja *
                </label>
                <input
                  type="text"
                  value={formData.shoppingFloor}
                  onChange={(e) => handleChange('shoppingFloor', e.target.value)}
                  placeholder="Piso 2, Loja 244"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Logradouro & Número *
              </label>
              <input
                type="text"
                value={formData.addressStreet}
                onChange={(e) => handleChange('addressStreet', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Cidade / UF
                </label>
                <input
                  type="text"
                  value={`${formData.city} - ${formData.state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('-');
                    handleChange('city', parts[0]?.trim() || formData.city);
                    if (parts[1]) handleChange('state', parts[1].trim());
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Canais de Contato & Redes */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Phone className="w-4 h-4 text-[#f43f7e]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
              Contatos & Canais de Atendimento
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#f43f7e]" />
                  Telefone da Loja
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(98) 3245-8890"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Oficial
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="(98) 98822-4411"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#f43f7e]" />
                  E-mail Comercial
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contato@pintaeborda.com.br"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="@pintaeborda.slz"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                Website Institucional
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://pintaeborda.com.br"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Horários de Funcionamento */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Clock className="w-4 h-4 text-[#f43f7e]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
              Horários de Funcionamento (Rio Anil)
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Segunda a Sábado
              </label>
              <input
                type="text"
                value={formData.openingHoursWeekdays}
                onChange={(e) => handleChange('openingHoursWeekdays', e.target.value)}
                placeholder="Segunda a Sábado: 10h00 às 22h00"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Domingos e Feriados
              </label>
              <input
                type="text"
                value={formData.openingHoursSunday}
                onChange={(e) => handleChange('openingHoursSunday', e.target.value)}
                placeholder="Domingos e Feriados: 13h00 às 21h00"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
              />
            </div>

            <div className="p-3 bg-[#fff5f8] rounded-xl border border-[#fbcfe8]/50 text-stone-600">
              Estes horários definem as grades de turnos e abertura do ponto de venda (PDV) no balcão da loja colaborativa.
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: Chave PIX Oficial Centralizada da Pinta e Borda */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
                Chave PIX Oficial Centralizada da Casa Colaborativa
              </h3>
              <p className="text-xs text-stone-500">
                Utilizada no PDV para recebimentos em PIX centralizado da loja antes do rateio quinzenal.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            Conta Ativa para Rateios
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs (8 cols) */}
          <div className="lg:col-span-8 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Tipo de Chave PIX
                </label>
                <select
                  value={formData.pixKeyType}
                  onChange={(e) => handleChange('pixKeyType', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-medium text-stone-900 bg-white focus:outline-none focus:border-[#f43f7e]"
                >
                  <option value="CNPJ">CNPJ</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Chave PIX *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => handleChange('pixKey', e.target.value)}
                    placeholder="Chave PIX cadastrada"
                    className="w-full pl-3.5 pr-20 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] focus:outline-none focus:border-[#f43f7e]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="absolute right-2 top-1.5 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedPix ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedPix ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Nome do Titular / Favorecido
              </label>
              <input
                type="text"
                value={formData.pixHolderName}
                onChange={(e) => handleChange('pixHolderName', e.target.value)}
                placeholder="Pinta e Borda Casa Colaborativa"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Instituição Financeira / Banco
                </label>
                <input
                  type="text"
                  value={formData.pixBank}
                  onChange={(e) => handleChange('pixBank', e.target.value)}
                  placeholder="Banco do Brasil (001)"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  value={formData.pixAgency}
                  onChange={(e) => handleChange('pixAgency', e.target.value)}
                  placeholder="3412-8"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Conta Corrente
                </label>
                <input
                  type="text"
                  value={formData.pixAccount}
                  onChange={(e) => handleChange('pixAccount', e.target.value)}
                  placeholder="48291-0"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e]"
                />
              </div>
            </div>
          </div>

          {/* Right: Display Simulator for POS / Balcão (4 cols) */}
          <div className="lg:col-span-4 bg-[#fff5f8] rounded-2xl p-5 border border-[#fbcfe8]/60 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-white rounded-xl shadow-xs border border-[#fbcfe8] p-2 flex items-center justify-center mb-3">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#380c25]"
                fill="currentColor"
              >
                {/* Simulated QR Code Pattern */}
                <rect x="10" y="10" width="30" height="30" fill="#380c25" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="#380c25" />
                <rect x="60" y="10" width="30" height="30" fill="#380c25" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="#380c25" />
                <rect x="10" y="60" width="30" height="30" fill="#380c25" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="#380c25" />
                <rect x="45" y="20" width="8" height="8" fill="#f43f7e" />
                <rect x="45" y="45" width="10" height="10" fill="#380c25" />
                <rect x="60" y="55" width="12" height="6" fill="#380c25" />
                <rect x="60" y="70" width="8" height="15" fill="#f43f7e" />
                <rect x="75" y="75" width="15" height="10" fill="#380c25" />
              </svg>
            </div>
            <p className="font-serif font-bold text-xs text-[#380c25]">
              {formData.pixHolderName || 'Pinta e Borda'}
            </p>
            <p className="font-mono text-[10px] text-[#f43f7e] font-bold mt-0.5 truncate max-w-full">
              {formData.pixKey}
            </p>
            <p className="text-[9px] text-stone-400 mt-1">
              {formData.pixBank} • Ag {formData.pixAgency} CC {formData.pixAccount}
            </p>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200">
              Placa de Balcão Ativa
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};
