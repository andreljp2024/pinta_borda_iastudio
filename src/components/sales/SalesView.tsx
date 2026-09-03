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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f43f7e] font-mono-craft">
            Livro de Transações Imutável
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25]">
            Histórico de Vendas da Loja
          </h2>
          <p className="text-xs sm:text-sm text-[#9b4f76] mt-1 font-light">
            Registro de todas as operações do balcão no Rio Anil Shopping com rateio financeiro detalhado por peça.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#fbcfe8] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between font-mono-craft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9b4f76] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cupom (ex: PNB-001), item ou operador..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#fbcfe8] focus:outline-none bg-white text-[#380c25]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {userRole === 'ADMIN' && (
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="p-2 text-xs bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] focus:outline-none"
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
            className="p-2 text-xs bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="CONCLUIDA">Concluídas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fff0f5]/70 border-b border-[#fbcfe8] text-[#9b4f76] uppercase tracking-wider text-[10px] font-mono-craft">
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
            <tbody className="divide-y divide-[#fff0f5] text-[#380c25]">
              {visibleSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#9b4f76] font-mono-craft">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                visibleSales.map((sale) => {
                  const isCanceled = sale.status === 'CANCELADA';
                  return (
                    <tr key={sale.id} className="hover:bg-[#fff0f5]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono-craft">
                        <div className="font-bold text-[#380c25]">{sale.saleNumber}</div>
                        <div className="text-[10px] text-[#9b4f76] whitespace-nowrap">
                          {new Date(sale.timestamp).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#380c25]">
                        {sale.operatorName}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {sale.items.map((it) => (
                            <div key={it.id} className="truncate">
                              <span className="font-semibold text-[#380c25]">{it.quantity}x</span>{' '}
                              {it.productName}{' '}
                              <span className="text-[10px] text-[#f43f7e] font-mono-craft">({it.partnerName})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#380c25]">{sale.paymentMethod}</span>
                        {sale.paymentDetails.cardBrand && (
                          <div className="text-[10px] text-[#9b4f76] font-mono-craft">
                            {sale.paymentDetails.cardBrand}{' '}
                            {sale.paymentDetails.installments > 1 && `(${sale.paymentDetails.installments}x)`}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#380c25]">
                        R$ {sale.totalGross.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#f43f7e] font-mono-craft">
                        - R$ {sale.totalFees.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#3c6b54]">
                        R$ {sale.totalNetToPartners.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono-craft">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCanceled
                              ? 'bg-[#ffe4ee] text-[#f43f7e] border border-[#fce7f3]'
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
                            className="p-1.5 text-[#863b63] hover:text-[#380c25] hover:bg-[#fff0f5] rounded-lg transition-colors cursor-pointer"
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
                              className="p-1.5 text-[#f43f7e] hover:text-[#db2777] hover:bg-[#ffe4ee] rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-md w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-[#f43f7e]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-display font-medium text-xl text-[#380c25]">
                Cancelar Venda #{cancelingSale.saleNumber}
              </h3>
            </div>

            <p className="text-xs text-[#863b63] leading-relaxed font-light">
              O cancelamento irá <strong className="font-semibold text-[#380c25]">estornar automaticamente os produtos para o estoque físico da loja</strong> e reverter os repasses provisionados aos parceiros.
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Justificativa Obrigatória do Cancelamento
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  placeholder="Ex: Cliente desistiu da compra antes de sair da loja / Erro de digitação no PDV..."
                  rows={3}
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#fbcfe8] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setCancelingSale(null)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f43f7e] hover:bg-[#ff4d88] text-white rounded-xl font-bold cursor-pointer shadow-xs transition-colors"
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
