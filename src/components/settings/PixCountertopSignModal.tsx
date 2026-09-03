import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../../types';

interface PixCountertopSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeSettings: StoreSettings;
  payload: string;
  qrCodeDataUrl: string;
  amount?: number;
}

export const PixCountertopSignModal: React.FC<PixCountertopSignModalProps> = ({
  isOpen,
  onClose,
  storeSettings,
  payload,
  qrCodeDataUrl,
  amount,
}) => {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyPayload = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2200);
  };

  const handleCopyKey = () => {
    if (!storeSettings.pixKey) return;
    navigator.clipboard.writeText(storeSettings.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2200);
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `qrcode-pix-${storeSettings.storeName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#fbcfe8] overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#fff5f8] via-white to-[#fff0f5] border-b border-[#fbcfe8] flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f43f7e]/10 text-[#f43f7e] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#380c25]">
                Placa de Balcão PIX Oficial — Pinta e Borda
              </h3>
              <p className="text-[11px] text-stone-500">
                Pronta para impressão em papel cartão, A5 ou display de acrílico no PDV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#380c25] hover:bg-[#250818] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Imprimir Placa de Balcão"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Placa</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Baixar QR Code PNG"
            >
              <Download className="w-3.5 h-3.5 text-[#f43f7e]" />
              <span className="hidden sm:inline">Baixar QR</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Countertop Display */}
        <div className="p-6 sm:p-8 flex justify-center bg-stone-100/60 print:bg-white print:p-0">
          <div
            ref={printAreaRef}
            id="pix-countertop-printable-card"
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#fbcfe8] shadow-lg print:shadow-none print:border-stone-300 print:rounded-none relative overflow-hidden"
          >
            {/* Decorative Header Accents */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#fff0f5] rounded-full -z-0 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#fef2f2] rounded-full -z-0 pointer-events-none" />

            <div className="relative z-10 text-center space-y-4">
              {/* Brand Top Header */}
              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#fff0f5] text-[#f43f7e] text-[10px] font-bold uppercase tracking-widest border border-[#fbcfe8]/60">
                  Casa Colaborativa
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#380c25] tracking-tight">
                  pinta <span className="text-[#f43f7e] font-serif italic font-normal">&amp;</span> borda
                </h2>
                <p className="text-xs text-stone-600 font-medium flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-[#f43f7e]" />
                  {storeSettings.shoppingName || 'Rio Anil Shopping'} • {storeSettings.shoppingFloor || 'Piso 2'}
                </p>
              </div>

              {/* Central Pix Badge */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00bdae]/10 border border-[#00bdae]/30 text-[#008f84]">
                  {/* Pix SVG Logo */}
                  <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M374.8 288.6c-17.9 0-35.1-7.1-47.7-19.7l-71.1-71.1-71.1 71.1c-12.6 12.6-29.8 19.7-47.7 19.7H118l98.3-98.3c21.8-21.8 57.3-21.8 79.1 0l98.3 98.3h-18.9z"/>
                    <path d="M137.2 223.4c17.9 0 35.1 7.1 47.7 19.7l71.1 71.1 71.1-71.1c12.6-12.6 29.8-19.7 47.7-19.7h18.9l-98.3 98.3c-21.8 21.8-57.3 21.8-79.1 0l-98.3-98.3h19.2z"/>
                  </svg>
                  <span className="text-xs font-bold tracking-wider">PAGUE COM PIX</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-[#fbcfe8] shadow-sm relative group">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code Pix Pinta e Borda"
                      className="w-52 h-52 sm:w-56 sm:h-56 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-xs text-stone-400">
                      Gerando QR Code...
                    </div>
                  )}

                  {/* Pix Center Accent */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-lg bg-white/95 shadow-md border border-[#00bdae]/40 flex items-center justify-center text-[#00bdae] font-bold text-xs">
                      pix
                    </div>
                  </div>
                </div>

                {amount && amount > 0 ? (
                  <div className="mt-2.5 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold">
                    Valor a Pagar: R$ {amount.toFixed(2).replace('.', ',')}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 mt-2 font-medium">
                    Valor aberto • Digite o valor total da sua compra no app do banco
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-[#fff5f8] rounded-xl p-3 border border-[#fbcfe8]/60 text-left space-y-1 text-xs text-stone-700">
                <p className="font-bold text-[#380c25] text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f43f7e]" />
                  Como realizar o pagamento no balcão:
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-stone-600 pl-1">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Escolha a opção <strong>Pix &gt; Ler QR Code</strong></li>
                  <li>Aponte a câmera para o código acima</li>
                  <li>Confira o favorecido e conclua a transferência</li>
                </ol>
              </div>

              {/* Official Account / Merchant Details */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-left space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold text-stone-500">Favorecido:</span>
                  <span className="font-bold text-[#380c25] text-right truncate max-w-[220px]">
                    {storeSettings.pixHolderName || storeSettings.legalName || 'Pinta e Borda'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold text-stone-500">Chave ({storeSettings.pixKeyType}):</span>
                  <span className="font-mono font-bold text-[#f43f7e]">{storeSettings.pixKey}</span>
                </div>

                <div className="flex justify-between items-center text-stone-500 text-[10px] pt-1 border-t border-stone-100">
                  <span>Banco: {storeSettings.pixBank}</span>
                  <span>Ag {storeSettings.pixAgency} • CC {storeSettings.pixAccount}</span>
                </div>
              </div>

              {/* Footer Tagline */}
              <p className="text-[10px] text-stone-400 font-medium italic">
                Obrigado por apoiar a arte autoral e a produção manual maranhense! ✨
              </p>
            </div>
          </div>
        </div>

        {/* Pix Copia e Cola & Bottom Actions (hidden when printing) */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#380c25] uppercase tracking-wider">
                Código Pix Copia e Cola (Padrão Bacen BR Code)
              </label>
              <span className="text-[10px] text-stone-400 font-mono">
                {payload ? `${payload.length} caracteres` : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={payload}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-600 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyPayload}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPayload ? 'Copiado!' : 'Copiar Código'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
            <button
              type="button"
              onClick={handleCopyKey}
              className="text-[#f43f7e] hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedKey ? 'Chave copiada!' : `Copiar apenas a Chave (${storeSettings.pixKey})`}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
