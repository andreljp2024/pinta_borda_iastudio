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
  Plus,
  Printer,
  Share2,
  X,
  Search,
  Trash2,
  Filter,
  ShieldCheck,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PartnerSettlement, MonthlyFee } from '../../types';

export const SettlementsView: React.FC = () => {
  const {
    settlements,
    monthlyFees,
    partners,
    sales,
    currentPartner,
    userRole,
    markSettlementAsPaid,
    markMonthlyFeeAsPaid,
    generatePeriodicSettlements,
    generateMonthlyFeesForCompetency,
    deleteSettlement,
    deleteMonthlyFee,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SETTLEMENTS' | 'MONTHLY_FEES'>('SETTLEMENTS');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDENTE' | 'PAGO'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showMonthlyFeeModal, setShowMonthlyFeeModal] = useState(false);
  const [selectedSettlementForDetail, setSelectedSettlementForDetail] = useState<PartnerSettlement | null>(null);

  // Form states for Generate Settlements Modal
  const [genPeriodPreset, setGenPeriodPreset] = useState<'Q1_CURRENT' | 'Q2_PREV' | 'CUSTOM'>('Q1_CURRENT');
  const [genPeriodLabel, setGenPeriodLabel] = useState('01/09/2026 a 15/09/2026');
  const [genStartDate, setGenStartDate] = useState('2026-09-01');
  const [genEndDate, setGenEndDate] = useState('2026-09-15');
  const [genDeductMonthlyFees, setGenDeductMonthlyFees] = useState(true);
  const [genNotes, setGenNotes] = useState('');

  // Form states for Monthly Fees Generation Modal
  const [genCompetency, setGenCompetency] = useState('10/2026');
  const [genDueDate, setGenDueDate] = useState('2026-10-10');

  // Format currency helper
  const formatBRL = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  // Scoped settlements
  const visibleSettlements = useMemo(() => {
    return settlements.filter((s) => {
      if (userRole === 'PARTNER' && currentPartner && s.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && s.partnerId !== selectedPartnerId) {
        return false;
      }
      if (statusFilter !== 'ALL') {
        const isPaid = s.status === 'PAGO';
        if (statusFilter === 'PAGO' && !isPaid) return false;
        if (statusFilter === 'PENDENTE' && isPaid) return false;
      }
      return true;
    });
  }, [settlements, userRole, currentPartner, selectedPartnerId, statusFilter]);

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

  // Total summary calculations
  const totalNetPending = useMemo(() => {
    return visibleSettlements
      .filter((s) => s.status !== 'PAGO')
      .reduce((acc, s) => acc + (s.netPayoutAmount ?? s.netAmount ?? 0), 0);
  }, [visibleSettlements]);

  const totalNetPaid = useMemo(() => {
    return visibleSettlements
      .filter((s) => s.status === 'PAGO')
      .reduce((acc, s) => acc + (s.netPayoutAmount ?? s.netAmount ?? 0), 0);
  }, [visibleSettlements]);

  const totalMonthlyFeesPending = useMemo(() => {
    return visibleMonthlyFees
      .filter((f) => f.status === 'ABERTO' || f.status === 'PENDENTE' || f.status === 'VENCIDO' || f.status === 'ATRASADO')
      .reduce((acc, f) => acc + f.amount, 0);
  }, [visibleMonthlyFees]);

  const totalMonthlyFeesPaid = useMemo(() => {
    return visibleMonthlyFees
      .filter((f) => f.status === 'PAGO')
      .reduce((acc, f) => acc + f.amount, 0);
  }, [visibleMonthlyFees]);

  // Handlers
  const handleCopyPix = (pix: string, id: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyBatchPix = () => {
    const pendingList = visibleSettlements.filter((s) => s.status !== 'PAGO');
    if (pendingList.length === 0) return;

    const lines = pendingList.map((s) => {
      const partner = partners.find((p) => p.id === s.partnerId);
      const net = s.netPayoutAmount ?? s.netAmount ?? 0;
      return `${s.partnerName} | Chave Pix (${partner?.pixKeyType || 'PIX'}): ${s.pixUsed || partner?.pixKey || 'N/D'} | Titular: ${partner?.pixHolderName || partner?.ownerName || s.partnerName} | Valor: ${formatBRL(net)}`;
    });

    const fullText = `*LOTE DE REPASSES PINTA E BORDA - PIX*\n${new Date().toLocaleDateString('pt-BR')}\n\n` + lines.join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  const handleExecuteGenerateSettlements = (e: React.FormEvent) => {
    e.preventDefault();
    let period = genPeriodLabel;
    if (genPeriodPreset === 'Q1_CURRENT') {
      period = '01/09/2026 a 15/09/2026';
    } else if (genPeriodPreset === 'Q2_PREV') {
      period = '16/08/2026 a 31/08/2026';
    }

    const created = generatePeriodicSettlements({
      period,
      startDate: genStartDate ? `${genStartDate}T00:00:00Z` : undefined,
      endDate: genEndDate ? `${genEndDate}T23:59:59Z` : undefined,
      deductMonthlyFees: genDeductMonthlyFees,
      notes: genNotes,
    });

    setShowGenerateModal(false);
    alert(`Fechamento processado com sucesso!\nForam gerados ${created.length} novos demonstrativos de repasse.`);
  };

  const handleExecuteGenerateMonthlyFees = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genCompetency || !genDueDate) return;

    const created = generateMonthlyFeesForCompetency(genCompetency, genDueDate);
    setShowMonthlyFeeModal(false);
    alert(`Cobrança de mensalidades gerada com sucesso!\n${created.length} registros criados para o mês ${genCompetency}.`);
  };

  // Get items corresponding to selected settlement for detailed audit
  const settlementItems = useMemo(() => {
    if (!selectedSettlementForDetail) return [];

    const partnerId = selectedSettlementForDetail.partnerId;
    const itemsList: {
      saleNumber: string;
      date: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      feePercentage: number;
      feeAmount: number;
      commissionAmount: number;
      netAmount: number;
    }[] = [];

    sales.forEach((sale) => {
      if (sale.status === 'CANCELADA' || sale.status === 'CANCELADO' || sale.status === 'ESTORNADO') return;
      sale.items.forEach((it) => {
        if (it.partnerId === partnerId) {
          itemsList.push({
            saleNumber: sale.saleNumber,
            date: new Date(sale.timestamp).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            productName: it.productName,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            subtotal: it.subtotal,
            feePercentage: it.feePercentageApplied,
            feeAmount: it.feeAmount,
            commissionAmount: it.pintaBordaCommissionAmount,
            netAmount: it.netAmountToPartner,
          });
        }
      });
    });

    return itemsList;
  }, [selectedSettlementForDetail, sales]);

  const handleCopyWhatsAppReport = (st: PartnerSettlement) => {
    const partner = partners.find((p) => p.id === st.partnerId);
    const gross = st.totalSalesGross ?? st.grossSales ?? 0;
    const cardFees = st.totalCardFeesDeducted ?? st.paymentFeesDeducted ?? 0;
    const commission = st.totalCommissionDeducted ?? st.pintaBordaCommissionDeducted ?? 0;
    const monthlyDeducted = st.monthlyFeeDeducted ?? 0;
    const net = st.netPayoutAmount ?? st.netAmount ?? 0;

    const text =
      `*Pinta e Borda — Casa Colaborativa (Rio Anil Shopping)*\n` +
      `🌿 *Demonstrativo de Fechamento & Repasse Líquido*\n\n` +
      `👤 *Artesã/Marca:* ${st.partnerName}\n` +
      `📅 *Período:* ${st.period}\n` +
      `🔑 *Chave Pix:* ${st.pixUsed || partner?.pixKey || 'Não informada'}\n` +
      `🏷️ *Situação:* ${st.status === 'PAGO' ? '✅ PAGO VIA PIX' : '⏳ AGUARDANDO PAGAMENTO'}\n` +
      (st.paymentReference ? `📄 *Comprovante/Autenticação:* ${st.paymentReference}\n` : '') +
      `\n---------------------------------\n` +
      `📊 *RESUMO CONTÁBIL AUDITADO*\n` +
      `(+) Vendas Totais Brutas: ${formatBRL(gross)}\n` +
      `(-) Taxas de Cartão/Maquininha: - ${formatBRL(cardFees)}\n` +
      `(-) Taxa de Adm/Comissão P&B (10%): - ${formatBRL(commission)}\n` +
      (monthlyDeducted > 0 ? `(-) Mensalidade do Espaço Abatida: - ${formatBRL(monthlyDeducted)}\n` : '') +
      `---------------------------------\n` +
      `💰 *VALOR LÍQUIDO A RECEBER:* *${formatBRL(net)}*\n\n` +
      `Agradecemos pela parceria e dedicação com a nossa casa colaborativa! ✨`;

    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#f43f7e] font-mono-craft">
              Módulo Financeiro & Compliance
            </span>
            <span className="text-[10px] bg-[#dff0e6] text-[#1f4e38] font-bold px-2 py-0.5 rounded-full border border-[#bcdbc7]">
              Auditabilidade Ponta a Ponta
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25]">
            Repasses, Fechamentos & Mensalidades
          </h2>
          <p className="text-xs sm:text-sm text-[#9b4f76] mt-1 font-light">
            Consolidação matemática de vendas, taxas congeladas, comissões contratuais de 10% e liquidação Pix.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userRole === 'ADMIN' && (
            <>
              {activeTab === 'SETTLEMENTS' ? (
                <>
                  <button
                    onClick={handleCopyBatchPix}
                    className="outline-button !py-2 !px-3 text-xs font-mono-craft flex items-center gap-1.5"
                    title="Copiar lista de chaves Pix e valores pendentes"
                  >
                    {copiedBatch ? <Check className="w-3.5 h-3.5 text-[#3c6b54]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBatch ? 'Lote Copiado!' : 'Copiar Lote Pix'}</span>
                  </button>
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="solid-button !py-2 !px-3.5 text-xs font-mono-craft flex items-center gap-1.5 font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Calcular Novo Fechamento</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowMonthlyFeeModal(true)}
                  className="solid-button !py-2 !px-3.5 text-xs font-mono-craft flex items-center gap-1.5 font-bold shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Gerar Mensalidades do Mês</span>
                </button>
              )}
            </>
          )}

          {userRole === 'ADMIN' && (
            <div className="w-full sm:w-48">
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full p-2 text-xs bg-white rounded-xl border border-[#fbcfe8] text-[#380c25] focus:outline-none font-mono-craft"
              >
                <option value="all">Todos os Ateliês ({partners.length})</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brandName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Repasses a Efetuar (Pix)</span>
            <ArrowDownRight className="w-4 h-4 text-[#e11d48]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#e11d48]">
            {formatBRL(totalNetPending)}
          </div>
          <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
            Saldo líquido auditado aguardando transferência
          </span>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Repasses já Liquidados</span>
            <CheckCircle2 className="w-4 h-4 text-[#3c6b54]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#3c6b54]">
            {formatBRL(totalNetPaid)}
          </div>
          <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
            Transferências Pix efetuadas com comprovante
          </span>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Mensalidades a Receber</span>
            <Building2 className="w-4 h-4 text-[#f43f7e]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#f43f7e]">
            {formatBRL(totalMonthlyFeesPending)}
          </div>
          <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
            Custo fixo do espaço colaborativo em aberto
          </span>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Mensalidades Arrecadadas</span>
            <ShieldCheck className="w-4 h-4 text-[#380c25]" />
          </div>
          <div className="text-2xl font-bold font-mono-craft text-[#380c25]">
            {formatBRL(totalMonthlyFeesPaid)}
          </div>
          <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
            Quitadas no mês corrente para rateio
          </span>
        </div>
      </div>

      {/* Sub Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#fbcfe8] pb-1 font-mono-craft">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SETTLEMENTS')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'SETTLEMENTS'
                ? 'border-[#f43f7e] text-[#380c25]'
                : 'border-transparent text-[#9b4f76] hover:text-[#380c25]'
            }`}
          >
            Demonstrativos de Repasse ({visibleSettlements.length})
          </button>
          <button
            onClick={() => setActiveTab('MONTHLY_FEES')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'MONTHLY_FEES'
                ? 'border-[#f43f7e] text-[#380c25]'
                : 'border-transparent text-[#9b4f76] hover:text-[#380c25]'
            }`}
          >
            Mensalidades do Espaço ({visibleMonthlyFees.length})
          </button>
        </div>

        {activeTab === 'SETTLEMENTS' && (
          <div className="flex items-center gap-1.5 pb-2">
            <span className="text-[11px] text-[#9b4f76]">Filtrar:</span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                statusFilter === 'ALL' ? 'bg-[#380c25] text-white' : 'bg-white text-[#9b4f76] border border-[#fbcfe8]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('PENDENTE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                statusFilter === 'PENDENTE' ? 'bg-[#ffe4ee] text-[#e11d48] border border-[#fbcfe8]' : 'bg-white text-[#9b4f76] border border-[#fbcfe8]'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter('PAGO')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                statusFilter === 'PAGO' ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]' : 'bg-white text-[#9b4f76] border border-[#fbcfe8]'
              }`}
            >
              Pagos
            </button>
          </div>
        )}
      </div>

      {activeTab === 'SETTLEMENTS' ? (
        /* Settlements Table */
        <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fff0f5]/70 border-b border-[#fbcfe8] text-[#9b4f76] uppercase tracking-wider text-[10px] font-mono-craft">
                <tr>
                  <th className="py-3 px-4 font-semibold">Período / Referência</th>
                  <th className="py-3 px-4 font-semibold">Marca & Chave Pix</th>
                  <th className="py-3 px-4 font-semibold text-right">Vendas Brutas</th>
                  <th className="py-3 px-4 font-semibold text-right">(-) Taxas Cartão</th>
                  <th className="py-3 px-4 font-semibold text-right">(-) P&B 10%</th>
                  <th className="py-3 px-4 font-semibold text-right">(-) Mensalidade</th>
                  <th className="py-3 px-4 font-semibold text-right">(=) Líquido</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fff0f5] text-[#380c25]">
                {visibleSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#9b4f76] font-mono-craft">
                      Nenhum fechamento de repasse encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  visibleSettlements.map((st) => {
                    const partner = partners.find((p) => p.id === st.partnerId);
                    const isPaid = st.status === 'PAGO';
                    const gross = st.totalSalesGross ?? st.grossSales ?? 0;
                    const cardFees = st.totalCardFeesDeducted ?? st.paymentFeesDeducted ?? 0;
                    const commission = st.totalCommissionDeducted ?? st.pintaBordaCommissionDeducted ?? 0;
                    const monthlyDeducted = st.monthlyFeeDeducted ?? 0;
                    const net = st.netPayoutAmount ?? st.netAmount ?? 0;
                    const pixKey = st.pixUsed || partner?.pixKey || '';

                    return (
                      <tr key={st.id} className="hover:bg-[#fff0f5]/40 transition-colors group">
                        <td className="py-3.5 px-4 font-medium text-[#380c25]">
                          <div className="font-display text-sm font-semibold">{st.period}</div>
                          <div className="text-[10px] text-[#9b4f76] font-mono-craft">
                            {st.createdAt
                              ? `Gerado em: ${new Date(st.createdAt).toLocaleDateString('pt-BR')}`
                              : 'Fechamento Quinzena'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#380c25]">{st.partnerName}</div>
                          <div className="flex items-center gap-1 text-[11px] text-[#9b4f76] font-mono-craft">
                            <span>Pix: {pixKey || 'Não cadastrado'}</span>
                            {pixKey && (
                              <button
                                onClick={() => handleCopyPix(pixKey, st.id)}
                                className="text-[#9b4f76] hover:text-[#380c25] p-0.5 cursor-pointer"
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
                        <td className="py-3.5 px-4 text-right font-semibold font-mono-craft text-[#380c25]">
                          {formatBRL(gross)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#f43f7e] font-medium font-mono-craft">
                          - {formatBRL(cardFees)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#9b4f76] font-mono-craft">
                          - {formatBRL(commission)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#863b63] font-mono-craft">
                          {monthlyDeducted > 0 ? `- ${formatBRL(monthlyDeducted)}` : 'R$ 0,00'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-sm text-[#3c6b54] font-mono-craft">
                          {formatBRL(net)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono-craft">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                                : 'bg-[#ffe4ee] text-[#e11d48] border border-[#fce7f3]'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono-craft">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedSettlementForDetail(st)}
                              className="outline-button !py-1 !px-2 text-xs flex items-center gap-1"
                              title="Visualizar Extrato Analítico & Prestação de Contas"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Extrato</span>
                            </button>

                            {!isPaid && userRole === 'ADMIN' && (
                              <button
                                onClick={() => {
                                  const ref = prompt(
                                    `Informe o código da transação/comprovante Pix para ${st.partnerName} (${formatBRL(net)}):`,
                                    `PIX-${Math.floor(100000 + Math.random() * 900000)}`
                                  );
                                  if (ref) {
                                    markSettlementAsPaid(st.id, ref);
                                  }
                                }}
                                className="solid-button !py-1 !px-2.5 text-xs font-bold shadow-2xs"
                              >
                                Pagar Pix
                              </button>
                            )}

                            {isPaid && st.paymentReference && (
                              <span
                                className="text-[10px] text-[#3c6b54] bg-[#dff0e6] px-1.5 py-0.5 rounded font-mono-craft truncate max-w-[90px]"
                                title={st.paymentReference}
                              >
                                {st.paymentReference}
                              </span>
                            )}

                            {userRole === 'ADMIN' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja realmente remover o demonstrativo de fechamento de ${st.partnerName}?`)) {
                                    deleteSettlement(st.id);
                                  }
                                }}
                                className="p-1 text-[#f43f7e] hover:text-[#be185d] rounded hover:bg-[#ffe4ee] transition-colors cursor-pointer"
                                title="Remover fechamento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
      ) : (
        /* Monthly Fees Table */
        <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fff0f5]/70 border-b border-[#fbcfe8] text-[#9b4f76] uppercase tracking-wider text-[10px] font-mono-craft">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mês de Competência</th>
                  <th className="py-3 px-4 font-semibold">Marca / Artesã</th>
                  <th className="py-3 px-4 font-semibold">Vencimento</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor da Mensalidade</th>
                  <th className="py-3 px-4 font-semibold text-center">Situação</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fff0f5] text-[#380c25]">
                {visibleMonthlyFees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#9b4f76] font-mono-craft">
                      Nenhuma mensalidade cadastrada.
                    </td>
                  </tr>
                ) : (
                  visibleMonthlyFees.map((fee) => {
                    const isPaid = fee.status === 'PAGO';
                    const comp = fee.competency || fee.monthReference || '09/2026';

                    return (
                      <tr key={fee.id} className="hover:bg-[#fff0f5]/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold font-display text-sm text-[#380c25]">
                          {comp}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#380c25]">
                          {fee.partnerName}
                          {fee.notes && (
                            <div className="text-[10px] text-[#9b4f76] font-mono-craft font-normal">
                              {fee.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#9b4f76] font-mono-craft">
                          {new Date(fee.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold font-mono-craft text-[#380c25]">
                          {formatBRL(fee.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono-craft">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                                : fee.status === 'ATRASADO' || fee.status === 'VENCIDO'
                                ? 'bg-[#fae8e8] text-[#9b2c2c] border border-[#f5c6c6]'
                                : 'bg-[#ffe4ee] text-[#f43f7e] border border-[#fce7f3]'
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono-craft">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isPaid && userRole === 'ADMIN' ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Confirmar recebimento da mensalidade de ${formatBRL(fee.amount)} de ${fee.partnerName}?`)) {
                                    markMonthlyFeeAsPaid(fee.id);
                                  }
                                }}
                                className="solid-button !py-1 !px-2.5 text-xs font-bold shadow-2xs"
                              >
                                Baixar Pagamento
                              </button>
                            ) : (
                              <span className="text-xs text-[#3c6b54] font-mono-craft font-medium">
                                {fee.paidAt ? `Pago em ${new Date(fee.paidAt).toLocaleDateString('pt-BR')}` : 'Quitado'}
                              </span>
                            )}

                            {userRole === 'ADMIN' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja excluir a cobrança de mensalidade de ${fee.partnerName} (${comp})?`)) {
                                    deleteMonthlyFee(fee.id);
                                  }
                                }}
                                className="p-1 text-[#f43f7e] hover:text-[#be185d] rounded hover:bg-[#ffe4ee] transition-colors cursor-pointer"
                                title="Excluir cobrança"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Modal: Novo Fechamento de Repasses (Cálculo Automático) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-4 my-8 animate-in fade-in zoom-in-95 font-mono-craft">
            <div className="flex items-center justify-between border-b border-[#fbcfe8] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#f43f7e]" />
                <h3 className="font-display font-medium text-lg text-[#380c25]">
                  Novo Fechamento de Repasses
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 text-[#9b4f76] hover:text-[#380c25] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#863b63] font-light leading-relaxed">
              O motor de fechamento matemático agrega todas as vendas não canceladas do período selecionado, congela as taxas de cartão de cada item, aplica os 10% da P&B e apura o saldo líquido final a pagar via Pix a cada artesão.
            </p>

            <form onSubmit={handleExecuteGenerateSettlements} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1">Período de Apuração</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGenPeriodPreset('Q1_CURRENT');
                      setGenPeriodLabel('01/09/2026 a 15/09/2026');
                      setGenStartDate('2026-09-01');
                      setGenEndDate('2026-09-15');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      genPeriodPreset === 'Q1_CURRENT'
                        ? 'border-[#f43f7e] bg-[#fff0f5] text-[#380c25] font-bold shadow-2xs'
                        : 'border-[#fbcfe8] bg-white text-[#9b4f76]'
                    }`}
                  >
                    1ª Quinzena Setembro
                    <span className="block text-[10px] font-normal text-[#9b4f76]">01/09 a 15/09/2026</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGenPeriodPreset('Q2_PREV');
                      setGenPeriodLabel('16/08/2026 a 31/08/2026');
                      setGenStartDate('2026-08-16');
                      setGenEndDate('2026-08-31');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      genPeriodPreset === 'Q2_PREV'
                        ? 'border-[#f43f7e] bg-[#fff0f5] text-[#380c25] font-bold shadow-2xs'
                        : 'border-[#fbcfe8] bg-white text-[#9b4f76]'
                    }`}
                  >
                    2ª Quinzena Agosto
                    <span className="block text-[10px] font-normal text-[#9b4f76]">16/08 a 31/08/2026</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#380c25] mb-1">Data Início</label>
                  <input
                    type="date"
                    value={genStartDate}
                    onChange={(e) => {
                      setGenStartDate(e.target.value);
                      setGenPeriodPreset('CUSTOM');
                    }}
                    className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#380c25] mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={genEndDate}
                    onChange={(e) => {
                      setGenEndDate(e.target.value);
                      setGenPeriodPreset('CUSTOM');
                    }}
                    className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1">Identificação / Rótulo do Período</label>
                <input
                  type="text"
                  value={genPeriodLabel}
                  onChange={(e) => setGenPeriodLabel(e.target.value)}
                  placeholder="ex: 01/09/2026 a 15/09/2026"
                  className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25]"
                  required
                />
              </div>

              <div className="bg-[#fff0f5]/80 p-3.5 rounded-2xl border border-[#fbcfe8] space-y-2">
                <label className="flex items-center gap-2 font-semibold text-[#380c25] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={genDeductMonthlyFees}
                    onChange={(e) => setGenDeductMonthlyFees(e.target.checked)}
                    className="rounded text-[#f43f7e] focus:ring-[#f43f7e]"
                  />
                  <span>Abater mensalidade do espaço em aberto no repasse</span>
                </label>
                <p className="text-[11px] text-[#863b63] leading-relaxed">
                  Caso a parceira possua mensalidade vencida ou aberta e o saldo líquido de vendas for suficiente, o valor será deduzido automaticamente com quitação da mensalidade.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1">Observações Internas (Opcional)</label>
                <textarea
                  value={genNotes}
                  onChange={(e) => setGenNotes(e.target.value)}
                  placeholder="Notas adicionais sobre o fechamento..."
                  rows={2}
                  className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#fbcfe8]">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="outline-button !py-2 !px-3.5 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button !py-2 !px-4 text-xs font-bold shadow-xs"
                >
                  Processar Fechamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gerar Cobrança de Mensalidades */}
      {showMonthlyFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-sm w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-4 animate-in fade-in zoom-in-95 font-mono-craft">
            <div className="flex items-center justify-between border-b border-[#fbcfe8] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#f43f7e]" />
                <h3 className="font-display font-medium text-lg text-[#380c25]">
                  Gerar Mensalidades
                </h3>
              </div>
              <button
                onClick={() => setShowMonthlyFeeModal(false)}
                className="p-1 text-[#9b4f76] hover:text-[#380c25] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#863b63] font-light">
              Gera a fatura de mensalidade fixa para todos os ateliês ativos com base no valor estipulado em contrato.
            </p>

            <form onSubmit={handleExecuteGenerateMonthlyFees} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1">Mês de Competência</label>
                <input
                  type="text"
                  value={genCompetency}
                  onChange={(e) => setGenCompetency(e.target.value)}
                  placeholder="ex: 10/2026"
                  className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25] font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1">Data de Vencimento</label>
                <input
                  type="date"
                  value={genDueDate}
                  onChange={(e) => setGenDueDate(e.target.value)}
                  className="w-full p-2 border border-[#fbcfe8] rounded-xl bg-white text-[#380c25]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#fbcfe8]">
                <button
                  type="button"
                  onClick={() => setShowMonthlyFeeModal(false)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button text-xs font-bold shadow-xs"
                >
                  Gerar Lote ({partners.length} marcas)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Extrato Analítico de Repasse (DRE & Prestação de Contas Completa) */}
      {selectedSettlementForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-5 my-6 animate-in fade-in zoom-in-95 font-mono-craft">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#fbcfe8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f43f7e]">
                  Pinta e Borda — Casa Colaborativa • Rio Anil Shopping
                </span>
                <h3 className="font-display font-semibold text-xl text-[#380c25] mt-0.5">
                  Extrato Analítico de Repasse
                </h3>
                <p className="text-xs text-[#9b4f76]">
                  Demonstrativo transparente de vendas, deduções contratuais e liquidação.
                </p>
              </div>
              <button
                onClick={() => setSelectedSettlementForDetail(null)}
                className="p-1.5 text-[#9b4f76] hover:text-[#380c25] rounded-xl hover:bg-[#fff0f5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Artisan & Period Card */}
            {(() => {
              const st = selectedSettlementForDetail;
              const partner = partners.find((p) => p.id === st.partnerId);
              const gross = st.totalSalesGross ?? st.grossSales ?? 0;
              const cardFees = st.totalCardFeesDeducted ?? st.paymentFeesDeducted ?? 0;
              const commission = st.totalCommissionDeducted ?? st.pintaBordaCommissionDeducted ?? 0;
              const monthlyDeducted = st.monthlyFeeDeducted ?? 0;
              const net = st.netPayoutAmount ?? st.netAmount ?? 0;
              const isPaid = st.status === 'PAGO';

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#fff0f5]/60 p-4 rounded-2xl border border-[#fbcfe8] text-xs">
                    <div>
                      <span className="text-[10px] text-[#9b4f76] uppercase font-bold block">Artesã / Marca</span>
                      <strong className="text-sm text-[#380c25] font-display">{st.partnerName}</strong>
                      <div className="text-[11px] text-[#863b63] mt-0.5">
                        Responsável: {partner?.ownerName || 'Titular da marca'}
                      </div>
                      <div className="text-[11px] text-[#863b63]">
                        Documento: {partner?.document || 'CPF/CNPJ cadastrado'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9b4f76] uppercase font-bold block">Dados de Liquidação</span>
                      <div className="text-xs font-bold text-[#380c25]">
                        Pix: {st.pixUsed || partner?.pixKey || 'Não cadastrado'}
                      </div>
                      <div className="text-[11px] text-[#863b63] mt-0.5">
                        Titular Pix: {partner?.pixHolderName || partner?.ownerName || st.partnerName}
                      </div>
                      <div className="text-[11px] text-[#863b63]">
                        Período: <strong>{st.period}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown / DRE */}
                  <div className="bg-white rounded-2xl border border-[#fbcfe8] overflow-hidden">
                    <div className="bg-[#fff0f5]/80 px-4 py-2.5 border-b border-[#fbcfe8] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#380c25]">Demonstrativo de Resultado do Período</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                            : 'bg-[#ffe4ee] text-[#e11d48] border border-[#fce7f3]'
                        }`}
                      >
                        {isPaid ? 'LIQUIDADO VIA PIX' : 'PENDENTE DE PAGAMENTO'}
                      </span>
                    </div>
                    <div className="divide-y divide-[#fff0f5] text-xs">
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-[#380c25] font-medium">(+) Faturamento Bruto de Vendas</span>
                        <strong className="text-[#380c25] font-mono-craft">{formatBRL(gross)}</strong>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5 text-[#e11d48]">
                        <span>(-) Taxas de Maquininha / Meios de Pagamento (Congeladas)</span>
                        <span className="font-mono-craft">- {formatBRL(cardFees)}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5 text-[#9b4f76]">
                        <span>(-) Comissão Operacional Pinta e Borda (10% Contratual)</span>
                        <span className="font-mono-craft">- {formatBRL(commission)}</span>
                      </div>
                      {monthlyDeducted > 0 && (
                        <div className="flex items-center justify-between px-4 py-2.5 text-[#863b63]">
                          <span>(-) Abatimento de Mensalidade do Espaço</span>
                          <span className="font-mono-craft">- {formatBRL(monthlyDeducted)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#fff0f5]/60 font-bold text-sm">
                        <span className="text-[#380c25]">(=) Saldo Líquido do Artesão</span>
                        <span className="text-[#3c6b54] text-base font-mono-craft">{formatBRL(net)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Itemized Sold Products Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#380c25]">
                        Peças Vendidas no Balcão ({settlementItems.length})
                      </h4>
                      <span className="text-[10px] text-[#9b4f76]">Taxa de cartão aplicada no ato da venda</span>
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-[#fbcfe8] rounded-xl">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-[#fff0f5] text-[#9b4f76] sticky top-0">
                          <tr>
                            <th className="py-2 px-3 font-semibold">Cupom/Data</th>
                            <th className="py-2 px-3 font-semibold">Produto</th>
                            <th className="py-2 px-3 text-right font-semibold">Preço</th>
                            <th className="py-2 px-3 text-right font-semibold">Taxa %</th>
                            <th className="py-2 px-3 text-right font-semibold">Líquido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff0f5]">
                          {settlementItems.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-[#9b4f76]">
                                Nenhuma transação direta vinculada ao período local.
                              </td>
                            </tr>
                          ) : (
                            settlementItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-[#fff0f5]/30">
                                <td className="py-2 px-3">
                                  <div className="font-semibold text-[#380c25]">{item.saleNumber}</div>
                                  <div className="text-[9px] text-[#9b4f76]">{item.date}</div>
                                </td>
                                <td className="py-2 px-3 font-medium text-[#380c25]">
                                  {item.quantity}x {item.productName}
                                </td>
                                <td className="py-2 px-3 text-right text-[#380c25] font-mono-craft">
                                  {formatBRL(item.subtotal)}
                                </td>
                                <td className="py-2 px-3 text-right text-[#f43f7e] font-mono-craft">
                                  {item.feePercentage.toFixed(2)}%
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-[#3c6b54] font-mono-craft">
                                  {formatBRL(item.netAmount)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#fbcfe8]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyWhatsAppReport(st)}
                        className="outline-button !py-2 !px-3 text-xs flex items-center gap-1.5"
                      >
                        {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-[#3c6b54]" /> : <Share2 className="w-3.5 h-3.5 text-[#25D366]" />}
                        <span>{copiedWhatsApp ? 'Copiado para WhatsApp!' : 'Copiar p/ WhatsApp'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="outline-button !py-2 !px-3 text-xs flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir</span>
                      </button>
                    </div>

                    {!isPaid && userRole === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => {
                          const ref = prompt(
                            `Informe o comprovante da transferência Pix (${formatBRL(net)}):`,
                            `PIX-${Math.floor(100000 + Math.random() * 900000)}`
                          );
                          if (ref) {
                            markSettlementAsPaid(st.id, ref);
                            setSelectedSettlementForDetail(null);
                          }
                        }}
                        className="solid-button !py-2 !px-4 text-xs font-bold shadow-xs"
                      >
                        Registrar Pagamento Pix
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
