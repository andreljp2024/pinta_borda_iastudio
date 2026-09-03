import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  QrCode,
  Copy,
  Check,
  FileText,
  AlertCircle,
  CreditCard,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PartnerSettlement, MonthlyFee } from '../../types';

export const SettlementsView: React.FC = () => {
  const {
    settlements,
    monthlyFees,
    partners,
    currentPartner,
    userRole,
    markSettlementAsPaid,
    markMonthlyFeeAsPaid,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SETTLEMENTS' | 'MONTHLY_FEES'>('SETTLEMENTS');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : 'all'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Scoped settlements
  const visibleSettlements = useMemo(() => {
    return settlements.filter((s) => {
      if (userRole === 'PARTNER' && currentPartner && s.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && s.partnerId !== selectedPartnerId) {
        return false;
      }
      return true;
    });
  }, [settlements, userRole, currentPartner, selectedPartnerId]);

  // Scoped monthly fees
  const visibleMonthlyFees = useMemo(() => {
    return monthlyFees.filter((f) => {
      if (userRole === 'PARTNER' && currentPartner && f.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && f.partnerId !== selectedPartnerId) {
        return false;
      }
      return true;
    });
  }, [monthlyFees, userRole, currentPartner, selectedPartnerId]);

  // Total summary calculation
  const totalNetPending = useMemo(() => {
    return visibleSettlements
      .filter((s) => s.status !== 'PAGO')
      .reduce((acc, s) => acc + s.netAmount, 0);
  }, [visibleSettlements]);

  const totalMonthlyFeesPending = useMemo(() => {
    return visibleMonthlyFees
      .filter((f) => f.status === 'PENDENTE' || f.status === 'ATRASADO')
      .reduce((acc, f) => acc + f.amount, 0);
  }, [visibleMonthlyFees]);

  const handleCopyPix = (pix: string, id: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Transparência Financeira Auditável
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Repasses & Mensalidades
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Consolidação matemática de vendas, taxas congeladas, comissões contratuais e contas a pagar/receber.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <div className="w-full sm:w-64">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full p-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none"
            >
              <option value="all">Todos os Ateliês</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brandName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Repasses a Efetuar aos Artesãos</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            R$ {totalNetPending.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Saldo líquido auditado pronto para Pix
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Mensalidades a Receber do Espaço</span>
            <Building2 className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-amber-900">
            R$ {totalMonthlyFeesPending.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Custos fixos de locação e rateio do shopping
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Regra de Taxa Congelada</span>
            <CheckCircle2 className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-sm font-bold text-stone-900">
            Auditabilidade por Venda
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            A taxa de máquina cobrada do artesão nunca é renegociada retroativamente.
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('SETTLEMENTS')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'SETTLEMENTS'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Demonstrativos de Repasse Líquido ({visibleSettlements.length})
        </button>
        <button
          onClick={() => setActiveTab('MONTHLY_FEES')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'MONTHLY_FEES'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Mensalidades do Espaço ({visibleMonthlyFees.length})
        </button>
      </div>

      {activeTab === 'SETTLEMENTS' ? (
        /* Settlements Table (PRD Section 22) */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Período / Referência</th>
                  <th className="py-3 px-4 font-semibold">Marca & Chave Pix</th>
                  <th className="py-3 px-4 font-semibold text-right">Vendas Brutas</th>
                  <th className="py-3 px-4 font-semibold text-right">(-) Taxas Cartão</th>
                  <th className="py-3 px-4 font-semibold text-right">(-) P&B 10%</th>
                  <th className="py-3 px-4 font-semibold text-right">(=) Líquido</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {visibleSettlements.map((st) => {
                  const partner = partners.find((p) => p.id === st.partnerId);
                  const isPaid = st.status === 'PAGO';

                  return (
                    <tr key={st.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-stone-900">
                        <div>{st.period}</div>
                        <div className="text-[10px] text-stone-400">
                          Gerado em: {new Date(st.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{st.partnerName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                          <span>Pix: {partner?.pixKey}</span>
                          {partner?.pixKey && (
                            <button
                              onClick={() => handleCopyPix(partner.pixKey, st.id)}
                              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                              title="Copiar Chave Pix"
                            >
                              {copiedKey === st.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-stone-900">
                        R$ {st.grossSales.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-rose-700 font-medium">
                        - R$ {st.paymentFeesDeducted.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-stone-600">
                        - R$ {st.pintaBordaCommissionDeducted.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-sm text-emerald-800">
                        R$ {st.netAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isPaid && userRole === 'ADMIN' ? (
                          <button
                            onClick={() => {
                              const ref = prompt(
                                'Informe o código do comprovante de transferência Pix:',
                                `PIX-${Math.floor(100000 + Math.random() * 900000)}`
                              );
                              if (ref) {
                                markSettlementAsPaid(st.id, ref);
                              }
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          >
                            Pagar via Pix
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-mono">
                            {st.paymentReference || 'Concluído'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Monthly Fees Table (PRD Section 23) */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mês de Referência</th>
                  <th className="py-3 px-4 font-semibold">Marca / Artesão</th>
                  <th className="py-3 px-4 font-semibold">Vencimento</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor da Mensalidade</th>
                  <th className="py-3 px-4 font-semibold text-center">Situação</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {visibleMonthlyFees.map((fee) => {
                  const isPaid = fee.status === 'PAGO';
                  return (
                    <tr key={fee.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">{fee.monthReference}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-800">{fee.partnerName}</td>
                      <td className="py-3.5 px-4 text-stone-600">
                        {new Date(fee.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                        R$ {fee.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : fee.status === 'ATRASADO'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isPaid && userRole === 'ADMIN' ? (
                          <button
                            onClick={() => {
                              if (confirm(`Confirmar recebimento de R$ ${fee.amount.toFixed(2)} de ${fee.partnerName}?`)) {
                                markMonthlyFeeAsPaid(fee.id);
                              }
                            }}
                            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Dar Baixa
                          </button>
                        ) : (
                          <span className="text-xs text-stone-400">
                            {fee.paidAt ? `Pago em ${new Date(fee.paidAt).toLocaleDateString('pt-BR')}` : 'Quitado'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
