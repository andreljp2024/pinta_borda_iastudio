import React, { useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Store,
  CheckCircle2,
  Package,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Bell,
  Smartphone,
  Boxes,
  FileBarChart,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const {
    sales,
    partners,
    products,
    shifts,
    activeShift,
    settlements,
    monthlyFees,
    notifications,
    userRole,
    currentPartner,
    setActiveView,
  } = useApp();

  const isPartner = userRole === 'PARTNER' && currentPartner !== null;

  // Filtered sales
  const relevantSales = useMemo(() => {
    return sales.filter((s) => {
      if (s.status === 'CANCELADA' || s.status === 'CANCELADO' || s.status === 'ESTORNADO') return false;
      if (isPartner) {
        return s.items.some((it) => it.partnerId === currentPartner.id);
      }
      return true;
    });
  }, [sales, isPartner, currentPartner]);

  // Gross Volume
  const totalGross = useMemo(() => {
    if (isPartner) {
      return relevantSales.reduce((acc, s) => {
        const myItems = s.items.filter((it) => it.partnerId === currentPartner.id);
        return acc + myItems.reduce((sum, it) => sum + it.subtotal, 0);
      }, 0);
    }
    return relevantSales.reduce((acc, s) => acc + s.totalGross, 0);
  }, [relevantSales, isPartner, currentPartner]);

  // Net Volume for partner or commissions for store
  const netEarnings = useMemo(() => {
    if (isPartner) {
      return relevantSales.reduce((acc, s) => {
        const myItems = s.items.filter((it) => it.partnerId === currentPartner.id);
        return acc + myItems.reduce((sum, it) => sum + it.netAmountToPartner, 0);
      }, 0);
    }
    // Store retention / commissions
    return relevantSales.reduce((acc, s) => acc + s.totalPintaBordaCommission, 0);
  }, [relevantSales, isPartner, currentPartner]);

  // Low stock products count
  const lowStockCount = useMemo(() => {
    return products.filter((p) => {
      if (isPartner && p.partnerId !== currentPartner.id) return false;
      return p.stock <= p.minStock;
    }).length;
  }, [products, isPartner, currentPartner]);

  // Recent 5 sales
  const recentSales = useMemo(() => {
    return relevantSales.slice(0, 5);
  }, [relevantSales]);

  // Weekly Sales Chart Mocked Distribution for visual balance
  const weeklySalesData = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return days.map((day, idx) => ({
      day,
      vendas: Math.round((totalGross / 7) * (0.6 + (idx % 3) * 0.4)),
    }));
  }, [totalGross]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76]">
        <div className="flex items-center gap-2">
          <span>pinta e borda</span>
          <span>/</span>
          <span className="text-[#380c25] font-semibold">visão geral</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#3c6b54]" />
          <span className="text-[#3c6b54] font-medium">dados sincronizados</span>
        </div>
      </div>

      {/* Welcome & Context Header */}
      <div className="bg-[#380c25] text-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#5c1a3e] shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2f0a1e] text-[#ff7597] rounded-full text-xs font-mono-craft border border-[#5c1a3e]">
              <Sparkles className="w-3.5 h-3.5 text-[#ff7597]" />
              {isPartner ? `Ateliê: ${currentPartner.brandName}` : 'Gestão da Casa Colaborativa'}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#ffffff]">
              {isPartner
                ? `Olá, ${currentPartner.ownerName}!`
                : 'Bem-vinda à gestão da casa.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#c9d9d0] max-w-xl font-light">
              {isPartner
                ? 'Acompanhe as vendas das suas peças, transparência de repasses e a escala de plantão da loja no Rio Anil Shopping.'
                : 'Painel operacional do coworking e loja colaborativa de artesanato no Rio Anil Shopping: vendas, estoque e repasses em um só lugar.'}
            </p>
          </div>

          {/* Quick Action in Header */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveView('artisan-portal')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#ffe4ee] hover:bg-[#ffd1e1] text-[#db2777] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Abrir a visão simplificada para o celular da produtora"
            >
              <Smartphone className="w-4 h-4 text-[#f43f7e]" />
              <span>Portal da Artesã</span>
            </button>
            <button
              onClick={() => setActiveView('pdv')}
              className="solid-button text-xs flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Abrir Balcão PDV</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="outline-button text-xs !border-[#5c1a3e] !text-[#ff7597] hover:!bg-[#2f0a1e]"
            >
              <Users className="w-4 h-4 text-[#ff7597]" />
              <span>Alternar Perfil</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 w-64 h-64 bg-[#ff7597]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real-Time Shift Banner */}
      <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 border border-[#fbcfe8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#db2777] flex items-center justify-center font-bold shrink-0 border border-[#fbcfe8]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#380c25] font-mono-craft">
                {activeShift ? 'Expediente Físico em Andamento' : 'Aguardando Operador no Balcão'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  activeShift ? 'bg-[#3c6b54] animate-pulse' : 'bg-[#f43f7e]'
                }`}
              />
            </div>
            <p className="text-xs text-[#863b63] mt-0.5">
              {activeShift ? (
                <>
                  Plantonista Responsável: <strong>{activeShift.operatorName}</strong> ({activeShift.partnerName}) • Início:{' '}
                  {new Date(activeShift.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </>
              ) : (
                'Nenhum artesão com plantão aberto neste momento. Inicie seu turno para registrar vendas.'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('shifts')}
          className="outline-button !py-2 !px-3.5 text-xs font-mono-craft self-start sm:self-auto"
        >
          <span>Ver Escala de Plantões</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>{isPartner ? 'Vendas da Minha Marca' : 'Faturamento Bruto'}</span>
            <DollarSign className="w-4 h-4 text-[#f43f7e]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-craft text-[#380c25]">
              R$ {totalGross.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] font-mono-craft text-[#3c6b54] font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {relevantSales.length} pedidos no período
            </span>
          </div>
        </div>

        {/* Net / Retention */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>{isPartner ? 'Meu Repasse Líquido' : 'Retenção P&B (10%)'}</span>
            <ArrowUpRight className="w-4 h-4 text-[#3c6b54]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-craft text-[#f43f7e]">
              R$ {netEarnings.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
              {isPartner ? 'Livre de taxas operacionais' : 'Fundo coletivo da casa'}
            </span>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Estoque no Shopping</span>
            <Package className="w-4 h-4 text-[#9b4f76]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-craft text-[#380c25]">
              {lowStockCount > 0 ? (
                <span className="text-[#f43f7e]">{lowStockCount} em alerta</span>
              ) : (
                <span className="text-[#3c6b54]">Abastecido</span>
              )}
            </div>
            <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
              {lowStockCount > 0 ? 'Itens próximos do mínimo' : 'Estoque regular'}
            </span>
          </div>
        </div>

        {/* Community / Shifts */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#fbcfe8] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono-craft text-[#9b4f76] mb-2">
            <span>Comunidade Coworking</span>
            <Users className="w-4 h-4 text-[#9b4f76]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono-craft text-[#380c25]">
              {partners.length} ateliês
            </div>
            <span className="text-[11px] font-mono-craft text-[#9b4f76] mt-1 block">
              Artesãs no Rio Anil Shopping
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-6 border border-[#fbcfe8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-medium text-lg text-[#380c25]">
                Evolução de Vendas (Últimos 7 dias)
              </h3>
              <p className="text-xs font-mono-craft text-[#9b4f76]">Volume consolidado no balcão presencial</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff0f5" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9b4f76' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9b4f76' }} />
                <Tooltip
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Vendas']}
                  contentStyle={{ backgroundColor: '#380c25', borderRadius: '12px', color: '#ffffff', fontSize: '12px', border: '1px solid #5c1a3e' }}
                />
                <Bar dataKey="vendas" fill="#f43f7e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales List (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-6 border border-[#fbcfe8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#fbcfe8] mb-3">
              <h3 className="font-display font-medium text-lg text-[#380c25]">
                Últimas Vendas no Balcão
              </h3>
              <button
                onClick={() => setActiveView('sales')}
                className="text-xs font-mono-craft text-[#f43f7e] hover:underline cursor-pointer"
              >
                Ver todas →
              </button>
            </div>

            <div className="divide-y divide-[#fff0f5]">
              {recentSales.length === 0 ? (
                <div className="py-8 text-center text-[#9b4f76] text-xs font-mono-craft">
                  Nenhuma venda recente registrada.
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs font-mono-craft text-[#380c25]">{sale.saleNumber}</div>
                      <div className="text-[11px] text-[#9b4f76]">
                        {sale.operatorName} • {sale.items.length} peças
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs font-mono-craft text-[#380c25]">
                        R$ {sale.totalGross.toFixed(2).replace('.', ',')}
                      </div>
                      <span className="text-[10px] font-mono-craft text-[#3c6b54] font-semibold">
                        {sale.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#fbcfe8]">
            <button
              onClick={() => setActiveView('settlements')}
              className="outline-button w-full !py-2.5 text-xs font-mono-craft flex items-center justify-center gap-1.5"
            >
              <span>Consultar Repasses Líquidos às Parceiras</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Central de Módulos da Gestão (Dashboard Modular Menu) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-medium text-xl text-[#380c25] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#f43f7e]" />
              <span>Menu de Módulos & Gestão Operacional</span>
            </h3>
            <p className="text-xs text-[#863b63] mt-0.5">
              Acesso rápido e organizado a todas as funções da casa colaborativa no Rio Anil Shopping
            </p>
          </div>
          <span className="text-[11px] font-mono-craft text-[#9b4f76] bg-white px-3 py-1 rounded-full border border-[#fbcfe8] self-start sm:self-auto">
            {isPartner ? 'Visão: Ateliê Parceiro' : 'Visão: Coordenação Geral'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: PDV Balcão */}
          <div
            onClick={() => setActiveView('pdv')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#f43f7e] flex items-center justify-center group-hover:bg-[#f43f7e] group-hover:text-white transition-all shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#f43f7e] text-white">
                  Frente de Caixa
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                PDV Balcão
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Vendas no balcão presencial, cálculo automático de comissões, PIX, dinheiro e comprovante digital.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Abrir Caixa</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Estoque no Shopping */}
          <div
            onClick={() => setActiveView('stock')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center group-hover:bg-[#380c25] group-hover:text-white transition-all shadow-2xs">
                  <Boxes className="w-5 h-5" />
                </div>
                {lowStockCount > 0 ? (
                  <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#ff7597] text-white">
                    {lowStockCount} em alerta
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#dff0e6] text-[#1f4e38]">
                    Regular
                  </span>
                )}
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Estoque no Shopping
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Controle de saldo físico nas prateleiras, aviso de reposição para as artesãs e histórico de entradas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Gerenciar Estoque</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Plantões & Escalas */}
          <div
            onClick={() => setActiveView('shifts')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center group-hover:bg-[#380c25] group-hover:text-white transition-all shadow-2xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#ffe4ee] text-[#db2777]">
                  {activeShift ? 'Plantonista Ativo' : 'Aguardando'}
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Plantões & Escala
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Calendário colaborativo da loja física, trocas de horário entre artesãs e registro de abertura/fechamento.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Ver Escala</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Produtos & Catálogo */}
          <div
            onClick={() => setActiveView('products')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center group-hover:bg-[#380c25] group-hover:text-white transition-all shadow-2xs">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {products.length} itens
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Produtos & Preços
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Cadastro de peças com código de barras, fotos, descrição autoral e precificação com comissão discriminada.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Catálogo Geral</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Fechamento de Repasses */}
          <div
            onClick={() => setActiveView('settlements')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#3c6b54] flex items-center justify-center group-hover:bg-[#1f4e38] group-hover:text-white transition-all shadow-2xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#dff0e6] text-[#1f4e38]">
                  Transparência
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Fechamento de Repasses
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Extratos detalhados de vendas, taxas de cartão já deduzidas e comprovante de transferência para as artesãs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Ver Fechamentos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Portal da Artesã */}
          <div
            onClick={() => setActiveView('artisan-portal')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffe4ee] text-[#db2777] flex items-center justify-center group-hover:bg-[#f43f7e] group-hover:text-white transition-all shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#f43f7e] text-white">
                  Versão Celular
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Portal da Artesã
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Interface leve pensada para o smartphone da produtora: acompanhar vendas do dia, avisar reposição e plantão.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Acessar no Celular</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Ateliês Parceiros */}
          <div
            onClick={() => setActiveView('partners')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center group-hover:bg-[#380c25] group-hover:text-white transition-all shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-[#ffe4ee] text-[#db2777]">
                  {partners.length} marcas
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Ateliês Parceiros
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Perfil de cada artesã, contatos, dados PIX, histórico de pontualidade e termos de cooperação.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Ver Ateliês</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Relatórios & Auditoria */}
          <div
            onClick={() => setActiveView('reports')}
            className="craft-card p-5 cursor-pointer group hover:border-[#f43f7e] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center group-hover:bg-[#380c25] group-hover:text-white transition-all shadow-2xs">
                  <FileBarChart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono-craft font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  Exportações
                </span>
              </div>
              <h4 className="font-display font-medium text-base text-[#380c25] group-hover:text-[#f43f7e] transition-colors">
                Relatórios Gerenciais
              </h4>
              <p className="text-xs text-[#863b63] mt-1 leading-relaxed">
                Curva ABC de produtos mais vendidos, faturamento por marca parceira e desempenho dos plantões.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs font-mono-craft text-[#f43f7e] font-semibold">
              <span>Abrir Relatórios</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
