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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b56f55] font-mono-craft">
            Transparência Financeira Auditável
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#253a35]">
            Repasses & Mensalidades
          </h2>
          <p className="text-xs sm:text-sm text-[#7d8c83] mt-1 font-light">
            Consolidação matemática de vendas, taxas congeladas, comissões contratuais e contas a pagar/receber.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <div className="w-full sm:w-64">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#ded6ca] text-[#253a35] focus:outline-none font-mono-craft"
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
        <div className="bg-[#fffaf2] rounded-2xl p-5 border border-[#ded6ca] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#7d8c83] mb-2">
            <span>Repasses a Efetuar aos Artesãos</span>
            <ArrowDownRight className="w-4 h-4 text-[#3c6b54]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#3c6b54]">
            R$ {totalNetPending.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] font-mono-craft text-[#7d8c83] mt-1 block">
            Saldo líquido auditado pronto para Pix
          </span>
        </div>

        <div className="bg-[#fffaf2] rounded-2xl p-5 border border-[#ded6ca] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#7d8c83] mb-2">
            <span>Mensalidades a Receber do Espaço</span>
            <Building2 className="w-4 h-4 text-[#b56f55]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#b56f55]">
            R$ {totalMonthlyFeesPending.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] font-mono-craft text-[#7d8c83] mt-1 block">
            Custos fixos de locação e rateio do shopping
          </span>
        </div>

        <div className="bg-[#fffaf2] rounded-2xl p-5 border border-[#ded6ca] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#7d8c83] mb-2">
            <span>Regra de Taxa Congelada</span>
            <CheckCircle2 className="w-4 h-4 text-[#3c6b54]" />
          </div>
          <div className="text-base font-display font-medium text-[#253a35]">
            Auditabilidade por Venda
          </div>
          <span className="text-[11px] text-[#52615a] mt-1 block font-light">
            A taxa de máquina cobrada do artesão nunca é renegociada retroativamente.
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ded6ca] font-mono-craft">
        <button
          onClick={() => setActiveTab('SETTLEMENTS')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'SETTLEMENTS'
              ? 'border-[#b56f55] text-[#253a35]'
              : 'border-transparent text-[#7d8c83] hover:text-[#253a35]'
          }`}
        >
          Demonstrativos de Repasse Líquido ({visibleSettlements.length})
        </button>
        <button
          onClick={() => setActiveTab('MONTHLY_FEES')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'MONTHLY_FEES'
              ? 'border-[#b56f55] text-[#253a35]'
              : 'border-transparent text-[#7d8c83] hover:text-[#253a35]'
          }`}
        >
          Mensalidades do Espaço ({visibleMonthlyFees.length})
        </button>
      </div>

      {activeTab === 'SETTLEMENTS' ? (
        /* Settlements Table (PRD Section 22) */
        <div className="bg-[#fffaf2] rounded-2xl border border-[#ded6ca] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ede5d8]/70 border-b border-[#ded6ca] text-[#7d8c83] uppercase tracking-wider text-[10px] font-mono-craft">
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
              <tbody className="divide-y divide-[#ede5d8] text-[#253a35]">
                {visibleSettlements.map((st) => {
                  const partner = partners.find((p) => p.id === st.partnerId);
                  const isPaid = st.status === 'PAGO';

                  return (
                    <tr key={st.id} className="hover:bg-[#ede5d8]/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#253a35]">
                        <div className="font-display text-sm">{st.period}</div>
                        <div className="text-[10px] text-[#7d8c83] font-mono-craft">
                          Gerado em: {new Date(st.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#253a35]">{st.partnerName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-[#7d8c83] font-mono-craft">
                          <span>Pix: {partner?.pixKey}</span>
                          {partner?.pixKey && (
                            <button
                              onClick={() => handleCopyPix(partner.pixKey, st.id)}
                              className="text-[#7d8c83] hover:text-[#253a35] p-0.5 cursor-pointer"
                              title="Copiar Chave Pix"
                            >
                              {copiedKey === st.id ? (
                                <Check className="w-3 h-3 text-[#3c6b54]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold font-mono-craft text-[#253a35]">
                        R$ {st.grossSales.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#b56f55] font-medium font-mono-craft">
                        - R$ {st.paymentFeesDeducted.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#7d8c83] font-mono-craft">
                        - R$ {st.pintaBordaCommissionDeducted.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-sm text-[#3c6b54] font-mono-craft">
                        R$ {st.netAmount.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono-craft">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                              : 'bg-[#fcedea] text-[#b56f55] border border-[#f0c2b7]'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-craft">
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
                            className="solid-button !py-1 !px-2.5 text-xs font-bold"
                          >
                            Pagar via Pix
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#7d8c83] font-mono-craft">
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
        <div className="bg-[#fffaf2] rounded-2xl border border-[#ded6ca] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ede5d8]/70 border-b border-[#ded6ca] text-[#7d8c83] uppercase tracking-wider text-[10px] font-mono-craft">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mês de Referência</th>
                  <th className="py-3 px-4 font-semibold">Marca / Artesão</th>
                  <th className="py-3 px-4 font-semibold">Vencimento</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor da Mensalidade</th>
                  <th className="py-3 px-4 font-semibold text-center">Situação</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede5d8] text-[#253a35]">
                {visibleMonthlyFees.map((fee) => {
                  const isPaid = fee.status === 'PAGO';
                  return (
                    <tr key={fee.id} className="hover:bg-[#ede5d8]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-display text-sm text-[#253a35]">{fee.monthReference}</td>
                      <td className="py-3.5 px-4 font-medium text-[#253a35]">{fee.partnerName}</td>
                      <td className="py-3.5 px-4 text-[#7d8c83] font-mono-craft">
                        {new Date(fee.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#253a35]">
                        R$ {fee.amount.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono-craft">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                              : fee.status === 'ATRASADO'
                              ? 'bg-[#fae8e8] text-[#9b2c2c] border border-[#f5c6c6]'
                              : 'bg-[#fcedea] text-[#b56f55] border border-[#f0c2b7]'
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
                            className="solid-button !py-1 !px-2.5 text-xs font-mono-craft font-bold"
                          >
                            Dar Baixa
                          </button>
                        ) : (
                          <span className="text-xs text-[#7d8c83] font-mono-craft">
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
