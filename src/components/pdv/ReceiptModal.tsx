import React, { useState } from 'react';
import { X, Printer, CheckCircle2, MessageCircle, Copy, Check, Send, Smartphone, Sparkles } from 'lucide-react';
import { Sale } from '../../types';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const [activeTab, setActiveTab] = useState<'TICKET' | 'WHATSAPP'>('WHATSAPP');
  const [customerPhone, setCustomerPhone] = useState(sale.customerPhone || '');
  const [customerName, setCustomerName] = useState(sale.customerName || '');
  const [messageStyle, setMessageStyle] = useState<'COMPLETE' | 'COMPACT'>('COMPLETE');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Helper to format clean numbers for wa.me URL
  const getSanitizedPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length <= 11) {
      return `55${digits}`;
    }
    return digits;
  };

  const generateWhatsAppMessage = () => {
    const formattedDate = new Date(sale.timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const clientGreeting = customerName.trim()
      ? `Olá, *${customerName.trim()}*! ✨`
      : `Olá! ✨`;

    const paymentInfo = `${sale.paymentMethod}${
      sale.paymentDetails.cardBrand ? ` (${sale.paymentDetails.cardBrand})` : ''
    }${sale.paymentDetails.installments > 1 ? ` em ${sale.paymentDetails.installments}x` : ''}`;

    const itemsFormatted = sale.items
      .map(
        (it) =>
          `• *${it.quantity}x ${it.productName}*\n  ↳ Ateliê: _${it.partnerName}_\n  ↳ Valor: R$ ${it.subtotal.toFixed(2).replace('.', ',')}`
      )
      .join('\n\n');

    if (messageStyle === 'COMPACT') {
      return (
        `🌿 *PINTA E BORDA — Casa Colaborativa*\n` +
        `📍 Rio Anil Shopping • São Luís/MA\n\n` +
        `${clientGreeting}\n` +
        `Segue o seu comprovante digital de compra:\n\n` +
        `🧾 *Cupom:* ${sale.saleNumber}\n` +
        `🗓️ *Data:* ${formattedDate}\n` +
        `👤 *Atendente:* ${sale.operatorName}\n\n` +
        `🛍️ *ITENS:*\n${itemsFormatted}\n\n` +
        `💳 *Pagamento:* ${paymentInfo}\n` +
        `💰 *TOTAL:* R$ ${sale.totalGross.toFixed(2).replace('.', ',')}\n\n` +
        `Obrigado por apoiar o artesanato maranhense! Volte sempre!`
      );
    }

    // Complete version with storytelling & artisan impact
    return (
      `🌿 *PINTA E BORDA — Casa Colaborativa*\n` +
      `_Marcas autorais, encontros e afeto no Rio Anil Shopping_\n` +
      `📍 Av. São Luís Rei de França — São Luís, MA\n\n` +
      `${clientGreeting}\n\n` +
      `Muito obrigado por valorizar o artesanato autoral maranhense! Cada peça que você escolheu carrega a história, o tempo e a dedicação de mulheres empreendedoras da nossa terra. 🧵✨\n\n` +
      `═══════════════════════\n` +
      `🧾 *COMPROVANTE DE COMPRA DIGITAL*\n` +
      `• *Nº da Venda:* ${sale.saleNumber}\n` +
      `• *Data/Hora:* ${formattedDate}\n` +
      `• *Atendimento:* ${sale.operatorName}\n` +
      `═══════════════════════\n\n` +
      `🛍️ *PEÇAS ESCOLHIDAS:*\n\n` +
      `${itemsFormatted}\n\n` +
      `───────────────────────\n` +
      `💳 *Forma de Pagamento:* ${paymentInfo}\n` +
      `💰 *VALOR TOTAL:* *R$ ${sale.totalGross.toFixed(2).replace('.', ',')}*\n` +
      `───────────────────────\n\n` +
      `💛 *O impacto da sua compra:*\n` +
      `Seu pagamento vai direto para o fomento das artesãs e ateliês parceiros, fortalecendo a economia criativa do Maranhão.\n\n` +
      `Siga nosso cotidiano e lançamentos:\n` +
      `📸 Instagram: @pintaebordaslz\n\n` +
      `Esperamos vê-lo(a) novamente em breve na nossa casa no Rio Anil Shopping!`
    );
  };

  const messageText = generateWhatsAppMessage();

  const handleSendWhatsApp = () => {
    const cleanNumber = getSanitizedPhone(customerPhone);
    const encodedText = encodeURIComponent(messageText);

    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodedText}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if needed
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/65 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full shadow-2xl border border-[#fbcfe8] overflow-hidden relative animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#380c25] text-[#ffffff] flex items-center justify-between border-b border-[#2f0a1e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f4e38] flex items-center justify-center text-[#82c39a] border border-[#3c6b54]">
              <CheckCircle2 className="w-5 h-5 text-[#82c39a]" />
            </div>
            <div>
              <h3 className="font-display font-medium text-base leading-tight">Venda Concluída com Sucesso</h3>
              <p className="text-[11px] text-[#c9d9d0] font-mono-craft">Cupom {sale.saleNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#c9d9d0] hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View switcher tabs */}
        <div className="flex border-b border-[#fbcfe8] bg-[#fff0f5]/70 font-mono-craft text-xs">
          <button
            onClick={() => setActiveTab('WHATSAPP')}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'WHATSAPP'
                ? 'border-[#1f4e38] text-[#1f4e38] bg-[#ffffff]'
                : 'border-transparent text-[#9b4f76] hover:text-[#380c25]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#1f4e38]" />
            <span>Enviar no WhatsApp</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#dff0e6] text-[#1f4e38] font-bold">
              Digital
            </span>
          </button>

          <button
            onClick={() => setActiveTab('TICKET')}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'TICKET'
                ? 'border-[#380c25] text-[#380c25] bg-[#ffffff]'
                : 'border-transparent text-[#9b4f76] hover:text-[#380c25]'
            }`}
          >
            <Printer className="w-4 h-4 text-[#380c25]" />
            <span>Cupom Não-Fiscal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 font-mono-craft text-xs text-[#380c25] space-y-4 bg-[#ffffff]">
          {activeTab === 'WHATSAPP' ? (
            /* WhatsApp Sender Screen */
            <div className="space-y-4">
              <div className="bg-[#eaf4ef] p-3.5 rounded-2xl border border-[#bed8c7] flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#1f4e38] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#1f4e38]">Comprovante Ecológico & Sustentável</p>
                  <p className="text-[#2e684c] text-[11px] mt-0.5 font-light leading-relaxed">
                    Envie o recibo com o nome das marcas que o cliente apoiou diretamente no WhatsApp dele sem gastar bobina térmica.
                  </p>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-2.5 bg-white p-3.5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
                <div className="text-[11px] font-bold text-[#380c25] uppercase tracking-wide">
                  Destinatário do Comprovante
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[#9b4f76] mb-1 font-semibold">
                      WhatsApp do Cliente (com DDD)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(98) 98888-0000"
                        className="w-full pl-8 pr-3 py-2 text-xs bg-[#ffffff] border border-[#fbcfe8] rounded-xl text-[#380c25] focus:outline-none focus:border-[#1f4e38]"
                      />
                      <span className="absolute left-2.5 top-2 text-[#9b4f76] text-xs">📱</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#9b4f76] mb-1 font-semibold">
                      Nome do Cliente (opcional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Mariana Castro"
                      className="w-full px-3 py-2 text-xs bg-[#ffffff] border border-[#fbcfe8] rounded-xl text-[#380c25] focus:outline-none focus:border-[#1f4e38]"
                    />
                  </div>
                </div>

                {/* Tone / Style Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-[#fff0f5] text-[11px]">
                  <span className="text-[#9b4f76]">Estilo da Mensagem:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMessageStyle('COMPLETE')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        messageStyle === 'COMPLETE'
                          ? 'bg-[#1f4e38] text-white shadow-2xs'
                          : 'bg-[#fff0f5] text-[#863b63] hover:text-[#380c25]'
                      }`}
                    >
                      Afetuosa & Autoral ✨
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageStyle('COMPACT')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        messageStyle === 'COMPACT'
                          ? 'bg-[#1f4e38] text-white shadow-2xs'
                          : 'bg-[#fff0f5] text-[#863b63] hover:text-[#380c25]'
                      }`}
                    >
                      Direta & Resumida
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Live WhatsApp Bubble Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#863b63] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f43f7e]" />
                    Pré-visualização do WhatsApp
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-[11px] text-[#1f4e38] hover:text-[#133425] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1f4e38]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Mensagem</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#f7ecf0] p-3.5 rounded-2xl border border-[#fbcfe8]">
                  {/* WhatsApp chat bubble */}
                  <div className="bg-[#dcf8c6] p-3.5 rounded-2xl rounded-tl-none text-[#111b21] shadow-2xs text-[11px] leading-relaxed whitespace-pre-wrap font-sans border border-[#c4e8b3] relative">
                    {messageText}
                    <div className="flex justify-end items-center gap-1 mt-2 text-[9px] text-[#667781]">
                      <span>Agora</span>
                      <span className="text-[#53bdeb] font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Traditional Thermal / Paper Ticket View */
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-dashed border-[#fbcfe8]">
                <h4 className="font-display font-bold text-lg text-[#380c25] tracking-tight">
                  pinta <em className="italic text-[#f43f7e]">e</em> borda
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-[#f43f7e] font-mono-craft">
                  casa colaborativa de artesanato
                </p>
                <p className="text-[11px] text-[#9b4f76] mt-0.5">
                  Rio Anil Shopping • São Luís - MA
                </p>
                <div className="mt-2 text-[#380c25] font-bold font-mono-craft">{sale.saleNumber}</div>
                <div className="text-[10px] text-[#9b4f76] font-mono-craft">
                  {new Date(sale.timestamp).toLocaleString('pt-BR')}
                </div>
              </div>

              {/* Operator and Customer */}
              <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-[#fbcfe8]">
                <div>
                  <span className="text-[#9b4f76]">Operador do Balcão: </span>
                  <span className="font-semibold text-[#380c25]">{sale.operatorName}</span>
                </div>
                {sale.customerName && (
                  <div>
                    <span className="text-[#9b4f76]">Cliente: </span>
                    <span className="font-semibold text-[#380c25]">{sale.customerName}</span>
                  </div>
                )}
                {sale.customerPhone && (
                  <div>
                    <span className="text-[#9b4f76]">WhatsApp: </span>
                    <span className="font-semibold text-[#380c25]">{sale.customerPhone}</span>
                  </div>
                )}
                <div>
                  <span className="text-[#9b4f76]">Forma de Pagamento: </span>
                  <span className="font-semibold text-[#380c25]">
                    {sale.paymentMethod}
                    {sale.paymentDetails.cardBrand ? ` (${sale.paymentDetails.cardBrand})` : ''}
                    {sale.paymentDetails.installments > 1 ? ` em ${sale.paymentDetails.installments}x` : ''}
                  </span>
                </div>
              </div>

              {/* Items breakdown with multi-brand clarity */}
              <div className="space-y-2 pb-3 border-b border-dashed border-[#fbcfe8]">
                <div className="font-bold uppercase text-[10px] tracking-wider text-[#9b4f76]">
                  Itens da Venda:
                </div>
                {sale.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs">
                    <div>
                      <div className="font-medium text-[#380c25]">{item.productName}</div>
                      <div className="text-[10px] text-[#f43f7e]">
                        Marca: {item.partnerName} • {item.quantity}x R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    <div className="font-bold text-[#380c25]">
                      R$ {item.subtotal.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-sm font-bold text-[#380c25]">
                  <span>TOTAL BRUTO:</span>
                  <span className="text-[#f43f7e]">R$ {sale.totalGross.toFixed(2).replace('.', ',')}</span>
                </div>

                {sale.paymentDetails.cashReceived && sale.paymentDetails.cashReceived > 0 && (
                  <>
                    <div className="flex justify-between text-[#863b63]">
                      <span>Valor Pago (Dinheiro):</span>
                      <span>R$ {sale.paymentDetails.cashReceived.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-[#1f4e38] font-semibold">
                      <span>Troco:</span>
                      <span>R$ {(sale.paymentDetails.changeGiven || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </>
                )}

                {/* Internal Collaborative Settlement summary */}
                <div className="mt-3 pt-3 border-t border-[#fbcfe8] bg-[#fff0f5]/50 p-2.5 rounded-xl text-[10px] text-[#863b63] space-y-1 border border-[#fbcfe8]">
                  <div className="font-bold text-[#380c25] uppercase tracking-wide">
                    Demonstrativo Interno (Rateio Auditável):
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa Financeira Maquininha ({sale.paymentDetails.feePercentageApplied}%):</span>
                    <span className="text-[#f43f7e]">- R$ {sale.totalFees.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comissão Pinta e Borda (10%):</span>
                    <span className="text-[#863b63]">- R$ {sale.totalPintaBordaCommission.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1f4e38] pt-1 border-t border-[#fbcfe8]">
                    <span>Líquido a Repassar aos Artesãos:</span>
                    <span>R$ {sale.totalNetToPartners.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-[#9b4f76]">
                Agradecemos a sua visita e apoio aos artesãos do Maranhão!
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-[#fff0f5]/70 border-t border-[#fbcfe8] flex flex-col sm:flex-row gap-2.5 font-mono-craft">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 py-2.5 px-4 bg-[#1f4e38] hover:bg-[#163c2b] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>
              {customerPhone ? 'Enviar no WhatsApp do Cliente' : 'Abrir WhatsApp'}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="outline-button !py-2.5 !px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer bg-white"
          >
            <Printer className="w-4 h-4 text-[#380c25]" />
            <span>Imprimir Cupom</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 text-[#863b63] hover:text-[#380c25] text-xs font-medium text-center cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

