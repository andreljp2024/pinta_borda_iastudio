import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  Eye,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreSettings } from '../../types';
import {
  validatePixKey,
  generatePixPayload,
  generatePixQrCodeDataUrl,
} from '../../utils/pix';
import { PixCountertopSignModal } from './PixCountertopSignModal';

export const StoreDataTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useApp();

  const [formData, setFormData] = useState<StoreSettings>({ ...storeSettings });
  const [isSaved, setIsSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // QR Code Simulator & Placa States
  const [isFixedAmount, setIsFixedAmount] = useState(false);
  const [testAmount, setTestAmount] = useState<number | undefined>(undefined);
  const [txidInput, setTxidInput] = useState<string>('***');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCountertopModalOpen, setIsCountertopModalOpen] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Real-time Pix Key Validation
  const pixValidation = useMemo(() => {
    return validatePixKey(formData.pixKey, formData.pixKeyType);
  }, [formData.pixKey, formData.pixKeyType]);

  // Real-time Pix Payload (Bacen EMV BR Code)
  const pixPayloadResult = useMemo(() => {
    return generatePixPayload({
      pixKey: formData.pixKey,
      pixKeyType: formData.pixKeyType,
      merchantName: formData.pixHolderName || formData.storeName || 'PINTA E BORDA',
      merchantCity: formData.city || 'SAO LUIS',
      amount: isFixedAmount && testAmount && testAmount > 0 ? testAmount : undefined,
      txid: txidInput.trim() || '***',
      description: 'Pinta e Borda Rio Anil',
    });
  }, [
    formData.pixKey,
    formData.pixKeyType,
    formData.pixHolderName,
    formData.storeName,
    formData.city,
    isFixedAmount,
    testAmount,
    txidInput,
  ]);

  // Generate QR Code image when payload changes
  useEffect(() => {
    let isMounted = true;
    if (pixPayloadResult.isValid && pixPayloadResult.payload) {
      generatePixQrCodeDataUrl(pixPayloadResult.payload, {
        width: 360,
        margin: 2,
        color: { dark: '#380c25', light: '#ffffff' },
      })
        .then((url) => {
          if (isMounted) setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error('Erro gerando QR Code Pix:', err);
        });
    } else {
      setQrCodeDataUrl('');
    }
    return () => {
      isMounted = false;
    };
  }, [pixPayloadResult.payload, pixPayloadResult.isValid]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(formData.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyPixPayload = () => {
    if (!pixPayloadResult.payload) return;
    navigator.clipboard.writeText(pixPayloadResult.payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `qrcode-pix-pinta-e-borda.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <h2 className="text-xl font-bold text-[#380c25]">
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

      {/* Card 5: Chave PIX Oficial Centralizada da Pinta e Borda & Gerador de QR Code */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
                  Chave PIX Oficial &amp; Gerador de QR Code Bacen
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  BR Code EMVCo
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Utilizada no PDV para recebimentos em PIX centralizado da loja antes do rateio quinzenal aos ateliês.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsCountertopModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Placa de Balcão</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrCodeDataUrl}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Baixar imagem do QR Code"
            >
              <Download className="w-3.5 h-3.5 text-[#f43f7e]" />
              <span className="hidden sm:inline">Baixar PNG</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Data & Validation (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            {/* Pix Key Type & Key Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Tipo de Chave PIX *
                </label>
                <select
                  value={formData.pixKeyType}
                  onChange={(e) => handleChange('pixKeyType', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-medium text-stone-900 bg-white focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                >
                  <option value="CNPJ">CNPJ (14 dígitos)</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="TELEFONE">Telefone (+55)</option>
                  <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                  <option value="CPF">CPF (11 dígitos)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase tracking-wider text-[#380c25]">
                    Chave PIX Oficial *
                  </label>
                  {pixValidation.formattedKey && pixValidation.formattedKey !== formData.pixKey && (
                    <button
                      type="button"
                      onClick={() => handleChange('pixKey', pixValidation.formattedKey)}
                      className="text-[10px] text-[#f43f7e] hover:underline font-bold"
                    >
                      Formatar Chave
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pixKey}
                    onChange={(e) => handleChange('pixKey', e.target.value)}
                    placeholder={
                      formData.pixKeyType === 'CNPJ'
                        ? '00.000.000/0001-00'
                        : formData.pixKeyType === 'EMAIL'
                        ? 'contato@pintaeborda.com.br'
                        : formData.pixKeyType === 'TELEFONE'
                        ? '(98) 98822-4411'
                        : 'Chave PIX cadastrada'
                    }
                    className={`w-full pl-3.5 pr-20 py-2 rounded-xl border font-mono font-bold text-[#380c25] focus:outline-none focus:ring-2 ${
                      pixValidation.isValid
                        ? 'border-stone-200 focus:border-[#f43f7e] focus:ring-[#f43f7e]/15'
                        : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCopyPixKey}
                    className="absolute right-2 top-1.5 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    title="Copiar chave"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedKey ? 'Copiada!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Feedback Box */}
            {pixValidation.isValid ? (
              <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-[11px]">Chave PIX Validada &amp; Conforme Bacen</span>
                    <span className="font-mono text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded text-emerald-800 font-semibold">
                      Chave no Payload: {pixValidation.normalizedKey}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {pixValidation.message} O QR Code gerado é compatível com todos os aplicativos bancários do Brasil.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <span className="font-bold text-[11px] block">Atenção na Chave PIX:</span>
                  <p className="text-[11px] text-rose-800">
                    {pixValidation.message}
                  </p>
                </div>
              </div>
            )}

            {/* Merchant / Holder Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold uppercase tracking-wider text-[#380c25]">
                  Nome do Titular / Favorecido (Bacen Tag 59) *
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {(formData.pixHolderName || '').length}/25 caracteres
                </span>
              </div>
              <input
                type="text"
                value={formData.pixHolderName}
                onChange={(e) => handleChange('pixHolderName', e.target.value)}
                maxLength={25}
                placeholder="Pinta e Borda Casa Colaborativa"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
              <p className="text-[10px] text-stone-500 mt-0.5">
                Aparece na tela de confirmação de pagamento do cliente. Conforme o padrão EMV, é formatado automaticamente em maiúsculas sem acentos.
              </p>
            </div>

            {/* Bank Details */}
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

            {/* Simulator Controls: Fixed Amount vs Open Amount */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#380c25] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#f43f7e]" />
                  Simulador de QR Code Dinâmico / Estático
                </span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFixedAmount(false);
                      setTestAmount(undefined);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                      !isFixedAmount
                        ? 'bg-[#380c25] text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Valor Aberto (Balcão)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFixedAmount(true);
                      if (!testAmount) setTestAmount(15.0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                      isFixedAmount
                        ? 'bg-[#380c25] text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Valor Fixo (R$)
                  </button>
                </div>
              </div>

              {isFixedAmount && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Valor de Teste (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-400 font-bold">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={testAmount !== undefined ? testAmount : ''}
                        onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0,00"
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 bg-white font-mono font-bold text-[#380c25] focus:outline-none focus:border-[#f43f7e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Identificador (TxID Bacen)
                    </label>
                    <input
                      type="text"
                      value={txidInput}
                      onChange={(e) => setTxidInput(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25))}
                      placeholder="*** ou LOJA01"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-mono font-semibold text-stone-800 focus:outline-none focus:border-[#f43f7e]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: High-Res QR Code Preview & Placa Display (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#fff5f8] to-[#fff0f5]/60 rounded-2xl p-5 border border-[#fbcfe8] flex flex-col items-center justify-between text-center space-y-4 shadow-xs">
            {/* Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#fbcfe8] text-[#380c25] text-[10px] font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>QR Code Oficial Bacen (Ativo)</span>
            </div>

            {/* QR Code Container */}
            <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-[#fbcfe8] flex flex-col items-center justify-center relative group">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code Oficial Pix Pinta e Borda"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#f43f7e]" />
                </div>
              )}

              {/* Pix Overlay Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-white/95 shadow-md border border-[#00bdae]/40 flex items-center justify-center text-[#00bdae] font-extrabold text-[10px]">
                  pix
                </div>
              </div>
            </div>

            {/* Merchant Details Preview */}
            <div className="space-y-1 max-w-full">
              <p className="font-bold text-xs text-[#380c25] truncate">
                {formData.pixHolderName || 'Pinta e Borda'}
              </p>
              <p className="font-mono text-[11px] text-[#f43f7e] font-bold truncate">
                {formData.pixKey}
              </p>
              <p className="text-[10px] text-stone-500">
                {formData.pixBank || 'Banco do Brasil'} • Ag {formData.pixAgency || '3412-8'} CC {formData.pixAccount || '48291-0'}
              </p>
              {isFixedAmount && testAmount && testAmount > 0 ? (
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold">
                  Valor: R$ {testAmount.toFixed(2).replace('.', ',')}
                </span>
              ) : (
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200">
                  Valor Aberto (Balcão da Loja)
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-2 border-t border-[#fbcfe8]/60">
              <button
                type="button"
                onClick={() => setIsCountertopModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-[#380c25] hover:bg-[#250818] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar Placa para Impressão</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyPixPayload}
                  disabled={!pixPayloadResult.payload}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#380c25] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                  title="Copiar código BR Code completo"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedPayload ? 'Código Copiado!' : 'Copiar Pix Copia e Cola'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  disabled={!qrCodeDataUrl}
                  className="p-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50"
                  title="Baixar imagem PNG do QR Code"
                >
                  <Download className="w-4 h-4 text-[#f43f7e]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Placa de Balcão Oficial para Impressão */}
      <PixCountertopSignModal
        isOpen={isCountertopModalOpen}
        onClose={() => setIsCountertopModalOpen(false)}
        storeSettings={formData}
        payload={pixPayloadResult.payload}
        qrCodeDataUrl={qrCodeDataUrl}
        amount={isFixedAmount ? testAmount : undefined}
      />
    </form>
  );
};
