import React, { useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
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
      if (s.status === 'CANCELADA') return false;
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
      {/* Welcome & Context Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {isPartner ? `Ateliê: ${currentPartner.brandName}` : 'Painel de Gestão Integrada'}
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight">
              {isPartner
                ? `Olá, ${currentPartner.ownerName}!`
                : 'Painel Geral Pinta e Borda'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              {isPartner
                ? 'Acompanhe as vendas das suas peças, transparência de repasses e a escala de plantão da loja no Rio Anil Shopping.'
                : 'Visão executiva e operacional do coworking e loja colaborativa de artesanato no Rio Anil Shopping.'}
            </p>
          </div>

          {/* Quick Action in Header */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveView('pdv')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Store className="w-4 h-4" />
              Abrir Balcão PDV
            </button>
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-300" />
              Alternar Perfil
            </button>
          </div>
        </div>

        {/* Ambient artistic accent */}
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real-Time Shift Banner (PRD Section 27 & 28) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-800">
                {activeShift ? 'Expediente Físico em Andamento' : 'Aguardando Operador no Balcão'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  activeShift ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {activeShift ? (
                <>
                  Artesão Responsável: <strong>{activeShift.operatorName}</strong> ({activeShift.partnerName}) • Entrada:{' '}
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
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Ver Escala de Plantões</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{isPartner ? 'Vendas da Minha Marca' : 'Faturamento Bruto'}</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              R$ {totalGross.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {relevantSales.length} pedidos realizados
            </span>
          </div>
        </div>

        {/* Net / Retention */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{isPartner ? 'Meu Repasse Líquido' : 'Retenção P&B (10%)'}</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-800">
              R$ {netEarnings.toFixed(2)}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              {isPartner ? 'Livre de taxas de máquina' : 'Comissão operacional da loja'}
            </span>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Estoque no Shopping</span>
            <Package className="w-4 h-4 text-stone-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {lowStockCount > 0 ? (
                <span className="text-amber-800">{lowStockCount} em alerta</span>
              ) : (
                <span className="text-emerald-700">Abastecido</span>
              )}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              {lowStockCount > 0 ? 'Itens próximos do mínimo' : 'Estoque regular'}
            </span>
          </div>
        </div>

        {/* Community / Shifts */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Comunidade Coworking</span>
            <Users className="w-4 h-4 text-stone-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900">
              {partners.length} marcas
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              Artesãos no Rio Anil Shopping
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display font-bold text-base text-stone-900">
                Evolução de Vendas (Últimos 7 dias)
              </h3>
              <p className="text-xs text-stone-500">Volume consolidado no balcão presencial</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Vendas']}
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="vendas" fill="#B45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="font-serif-display font-bold text-base text-stone-900">
                Últimas Vendas no Balcão
              </h3>
              <button
                onClick={() => setActiveView('sales')}
                className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                Ver todas
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recentSales.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  Nenhuma venda recente registrada.
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-stone-900">{sale.saleNumber}</div>
                      <div className="text-[11px] text-stone-500">
                        {sale.operatorName} • {sale.items.length} itens
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-stone-900">
                        R$ {sale.totalGross.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {sale.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => setActiveView('settlements')}
              className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Consultar Repasses Líquidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
