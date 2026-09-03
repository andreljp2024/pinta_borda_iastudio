import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import { ReceiptModal } from '../pdv/ReceiptModal';

export const SalesView: React.FC = () => {
  const {
    sales,
    partners,
    userRole,
    currentPartner,
    cancelSale,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'CONCLUIDA' | 'CANCELADA'>('all');

  // Receipt modal
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<Sale | null>(null);

  // Cancel Modal
  const [cancelingSale, setCancelingSale] = useState<Sale | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Scoped sales
  const visibleSales = useMemo(() => {
    return sales.filter((s) => {
      // If partner role, only see sales containing items belonging to that partner (PRD P8)
      if (userRole === 'PARTNER' && currentPartner) {
        const hasPartnerItem = s.items.some((it) => it.partnerId === currentPartner.id);
        if (!hasPartnerItem) return false;
      }

      if (selectedPartnerId !== 'all') {
        const hasPartnerItem = s.items.some((it) => it.partnerId === selectedPartnerId);
        if (!hasPartnerItem) return false;
      }

      if (statusFilter !== 'all' && s.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = s.saleNumber.toLowerCase().includes(q);
        const matchOp = s.operatorName.toLowerCase().includes(q);
        const matchItem = s.items.some((it) => it.productName.toLowerCase().includes(q));
        if (!matchNum && !matchOp && !matchItem) return false;
      }

      return true;
    });
  }, [sales, userRole, currentPartner, selectedPartnerId, statusFilter, searchQuery]);

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingSale || !cancelReason.trim()) {
      alert('Informe o motivo do cancelamento.');
      return;
    }

    cancelSale(cancelingSale.id, cancelReason);
    setCancelingSale(null);
    setCancelReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c85a78] font-mono-craft">
            Livro de Transações Imutável
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#2e1420]">
            Histórico de Vendas da Loja
          </h2>
          <p className="text-xs sm:text-sm text-[#8e727e] mt-1 font-light">
            Registro de todas as operações do balcão no Rio Anil Shopping com rateio financeiro detalhado por peça.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#edd5dc] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between font-mono-craft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8e727e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cupom (ex: PNB-001), item ou operador..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#edd5dc] focus:outline-none bg-white text-[#2e1420]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {userRole === 'ADMIN' && (
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="p-2 text-xs bg-white text-[#2e1420] rounded-xl border border-[#edd5dc] focus:outline-none"
            >
              <option value="all">Todas as Marcas</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brandName}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 text-xs bg-white text-[#2e1420] rounded-xl border border-[#edd5dc] focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="CONCLUIDA">Concluídas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#edd5dc] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6ebef]/70 border-b border-[#edd5dc] text-[#8e727e] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Cupom / Data</th>
                <th className="py-3 px-4 font-semibold">Atendente Balcão</th>
                <th className="py-3 px-4 font-semibold">Itens e Marcas</th>
                <th className="py-3 px-4 font-semibold">Pagamento</th>
                <th className="py-3 px-4 font-semibold text-right">Total Bruto</th>
                <th className="py-3 px-4 font-semibold text-right">Taxas Cartão</th>
                <th className="py-3 px-4 font-semibold text-right">Líquido Parceiros</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ebef] text-[#2e1420]">
              {visibleSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#8e727e] font-mono-craft">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                visibleSales.map((sale) => {
                  const isCanceled = sale.status === 'CANCELADA';
                  return (
                    <tr key={sale.id} className="hover:bg-[#f6ebef]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono-craft">
                        <div className="font-bold text-[#2e1420]">{sale.saleNumber}</div>
                        <div className="text-[10px] text-[#8e727e] whitespace-nowrap">
                          {new Date(sale.timestamp).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#2e1420]">
                        {sale.operatorName}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {sale.items.map((it) => (
                            <div key={it.id} className="truncate">
                              <span className="font-semibold text-[#2e1420]">{it.quantity}x</span>{' '}
                              {it.productName}{' '}
                              <span className="text-[10px] text-[#c85a78] font-mono-craft">({it.partnerName})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#2e1420]">{sale.paymentMethod}</span>
                        {sale.paymentDetails.cardBrand && (
                          <div className="text-[10px] text-[#8e727e] font-mono-craft">
                            {sale.paymentDetails.cardBrand}{' '}
                            {sale.paymentDetails.installments > 1 && `(${sale.paymentDetails.installments}x)`}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#2e1420]">
                        R$ {sale.totalGross.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#c85a78] font-mono-craft">
                        - R$ {sale.totalFees.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#3c6b54]">
                        R$ {sale.totalNetToPartners.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono-craft">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCanceled
                              ? 'bg-[#fbebf0] text-[#c85a78] border border-[#fadbe5]'
                              : 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedSaleForReceipt(sale)}
                            className="p-1.5 text-[#1f4e38] hover:text-[#133425] hover:bg-[#dff0e6] rounded-lg transition-colors cursor-pointer"
                            title="Enviar Comprovante via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            onClick={() => setSelectedSaleForReceipt(sale)}
                            className="p-1.5 text-[#644855] hover:text-[#2e1420] hover:bg-[#f6ebef] rounded-lg transition-colors cursor-pointer"
                            title="Visualizar Cupom / Imprimir"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {!isCanceled && userRole === 'ADMIN' && (
                            <button
                              onClick={() => {
                                setCancelingSale(sale);
                                setCancelReason('');
                              }}
                              className="p-1.5 text-[#c85a78] hover:text-[#8f334d] hover:bg-[#fbebf0] rounded-lg transition-colors cursor-pointer"
                              title="Cancelar Venda (Estorna Estoque)"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Sale Modal (PRD Section 24) */}
      {cancelingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2e1420]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-md w-full shadow-2xl border border-[#edd5dc] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-[#c85a78]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-display font-medium text-xl text-[#2e1420]">
                Cancelar Venda #{cancelingSale.saleNumber}
              </h3>
            </div>

            <p className="text-xs text-[#644855] leading-relaxed font-light">
              O cancelamento irá <strong className="font-semibold text-[#2e1420]">estornar automaticamente os produtos para o estoque físico da loja</strong> e reverter os repasses provisionados aos parceiros.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2e1420] mb-1 font-mono-craft">
                  Justificativa Obrigatória do Cancelamento
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  placeholder="Ex: Cliente desistiu da compra antes de sair da loja / Erro de digitação no PDV..."
                  rows={3}
                  className="w-full p-2.5 border border-[#edd5dc] rounded-xl text-xs bg-white text-[#2e1420] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#edd5dc] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setCancelingSale(null)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c85a78] hover:bg-[#ad506c] text-white rounded-xl font-bold cursor-pointer shadow-xs transition-colors"
                >
                  Confirmar Cancelamento & Estorno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        sale={selectedSaleForReceipt}
        onClose={() => setSelectedSaleForReceipt(null)}
      />
    </div>
  );
};
