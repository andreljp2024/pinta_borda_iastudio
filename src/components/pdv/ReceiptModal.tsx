import React from 'react';
import { X, Printer, Share2, CheckCircle2, MessageCircle, Store } from 'lucide-react';
import { Sale } from '../../types';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareText = `*COMPROVANTE DE VENDA - PINTA E BORDA*\n` +
    `Venda: ${sale.saleNumber}\n` +
    `Data: ${new Date(sale.timestamp).toLocaleString('pt-BR')}\n` +
    `Atendente: ${sale.operatorName}\n` +
    `Pagamento: ${sale.paymentMethod} (${sale.paymentDetails.terminalName || 'Balcão'})\n` +
    `Total: R$ ${sale.totalGross.toFixed(2)}\n\n` +
    `*Itens:*\n` +
    sale.items.map((it) => `- ${it.quantity}x ${it.productName} (${it.partnerName}): R$ ${it.subtotal.toFixed(2)}`).join('\n') +
    `\n\nObrigado por apoiar o artesanato maranhense! Rio Anil Shopping.`;

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif-display font-bold text-base">Venda Concluída!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content (Styled like a thermal / artisanal non-fiscal ticket) */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-stone-800 space-y-4 print:p-0">
          <div className="text-center pb-3 border-b border-dashed border-stone-300">
            <h4 className="font-serif-display font-bold text-base text-stone-900">
              PINTA E BORDA
            </h4>
            <p className="text-[11px] text-stone-500">
              Coworking & Loja Colaborativa de Artesanato
            </p>
            <p className="text-[11px] text-stone-500">
              Rio Anil Shopping • São Luís - MA
            </p>
            <div className="mt-2 text-stone-900 font-bold">{sale.saleNumber}</div>
            <div className="text-[10px] text-stone-400">
              {new Date(sale.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>

          {/* Operator and Customer */}
          <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-stone-300">
            <div>
              <span className="text-stone-500">Operador do Balcão: </span>
              <span className="font-semibold">{sale.operatorName}</span>
            </div>
            {sale.customerName && (
              <div>
                <span className="text-stone-500">Cliente: </span>
                <span className="font-semibold">{sale.customerName}</span>
              </div>
            )}
            <div>
              <span className="text-stone-500">Forma de Pagamento: </span>
              <span className="font-semibold">
                {sale.paymentMethod}
                {sale.paymentDetails.cardBrand ? ` (${sale.paymentDetails.cardBrand})` : ''}
                {sale.paymentDetails.installments > 1 ? ` em ${sale.paymentDetails.installments}x` : ''}
              </span>
            </div>
          </div>

          {/* Items breakdown with multi-brand clarity */}
          <div className="space-y-2 pb-3 border-b border-dashed border-stone-300">
            <div className="font-bold uppercase text-[10px] tracking-wider text-stone-500">
              Itens da Venda:
            </div>
            {sale.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{item.productName}</div>
                  <div className="text-[10px] text-amber-800">
                    Marca: {item.partnerName} • {item.quantity}x R$ {item.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div className="font-bold text-stone-900">
                  R$ {item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between text-sm font-bold text-stone-900">
              <span>TOTAL BRUTO:</span>
              <span>R$ {sale.totalGross.toFixed(2)}</span>
            </div>

            {sale.paymentDetails.cashReceived && sale.paymentDetails.cashReceived > 0 && (
              <>
                <div className="flex justify-between text-stone-600">
                  <span>Valor Pago (Dinheiro):</span>
                  <span>R$ {sale.paymentDetails.cashReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Troco:</span>
                  <span>R$ {(sale.paymentDetails.changeGiven || 0).toFixed(2)}</span>
                </div>
              </>
            )}

            {/* Internal Collaborative Settlement summary */}
            <div className="mt-3 pt-3 border-t border-stone-200 bg-stone-50 p-2.5 rounded-lg text-[10px] text-stone-600 space-y-1">
              <div className="font-bold text-stone-700 uppercase tracking-wide">
                Demonstrativo Interno (Rateio Auditável):
              </div>
              <div className="flex justify-between">
                <span>Taxa Financeira Maquininha ({sale.paymentDetails.feePercentageApplied}%):</span>
                <span className="text-rose-700">- R$ {sale.totalFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Comissão Pinta e Borda (10%):</span>
                <span className="text-stone-700">- R$ {sale.totalPintaBordaCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                <span>Líquido a Repassar aos Artesãos:</span>
                <span>R$ {sale.totalNetToPartners.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-stone-400">
            Agradecemos a sua visita e apoio aos artesãos do Maranhão!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 grid grid-cols-2 gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Cupom
          </button>
        </div>
      </div>
    </div>
  );
};
