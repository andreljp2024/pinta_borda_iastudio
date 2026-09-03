import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';

const COLORS = ['#9A3412', '#E11D48', '#059669', '#2563EB', '#7C3AED', '#D97706', '#0D9488', '#4B5563'];

export const ReportsView: React.FC = () => {
  const { sales, partners, products, categories, userRole, currentPartner } = useApp();

  const [period, setPeriod] = useState<'30D' | 'ALL'>('ALL');

  // Filter sales if partner role
  const scopedSales = useMemo(() => {
    return sales.filter((s) => {
      if (s.status === 'CANCELADA') return false;
      if (userRole === 'PARTNER' && currentPartner) {
        return s.items.some((it) => it.partnerId === currentPartner.id);
      }
      return true;
    });
  }, [sales, userRole, currentPartner]);

  // Total metrics
  const totalVolume = useMemo(() => {
    return scopedSales.reduce((acc, s) => acc + s.totalGross, 0);
  }, [scopedSales]);

  const totalSalesCount = scopedSales.length;
  const ticketMedio = totalSalesCount > 0 ? totalVolume / totalSalesCount : 0;

  // Chart 1: Sales by Brand (PRD Section 29.1)
  const salesByBrand = useMemo(() => {
    const map = new Map<string, number>();
    scopedSales.forEach((s) => {
      s.items.forEach((it) => {
        if (userRole === 'PARTNER' && currentPartner && it.partnerId !== currentPartner.id) return;
        const current = map.get(it.partnerName) || 0;
        map.set(it.partnerName, current + it.subtotal);
      });
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [scopedSales, userRole, currentPartner]);

  // Chart 2: Sales by Payment Method (PRD Section 29.2)
  const salesByPaymentMethod = useMemo(() => {
    const map = new Map<string, number>();
    scopedSales.forEach((s) => {
      const current = map.get(s.paymentMethod) || 0;
      map.set(s.paymentMethod, current + s.totalGross);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));
  }, [scopedSales]);

  // Chart 3: Top Selling Products
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; total: number }>();
    scopedSales.forEach((s) => {
      s.items.forEach((it) => {
        if (userRole === 'PARTNER' && currentPartner && it.partnerId !== currentPartner.id) return;
        const prev = map.get(it.productId) || { name: it.productName, quantity: 0, total: 0 };
        map.set(it.productId, {
          name: it.productName,
          quantity: prev.quantity + it.quantity,
          total: prev.total + it.subtotal,
        });
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [scopedSales, userRole, currentPartner]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Inteligência Coletiva & BI
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Relatórios & Indicadores
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Métricas de desempenho comercial da loja física no Rio Anil Shopping.
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scopedSales, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `relatorio-pinta-e-borda-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-stone-500" />
          Exportar Relatório (JSON)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 uppercase font-semibold">Faturamento Bruto</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            R$ {totalVolume.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Volume total de peças vendidas</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 uppercase font-semibold">Volume de Atendimentos</span>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {totalSalesCount} transações
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Cupons emitidos no balcão</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 uppercase font-semibold">Ticket Médio</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            R$ {ticketMedio.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Média por cliente atendido</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Brand (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              Vendas por Marca / Ateliê (R$)
            </h3>
            <span className="text-xs text-stone-400 font-medium">Consolidado</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByBrand} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Vendas']}
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#9A3412" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Payment Method (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              Distribuição por Meio de Pagamento
            </h3>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByPaymentMethod}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, 'Total']}
                  contentStyle={{ backgroundColor: '#1C1917', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif-display font-bold text-base text-stone-900">
            Produtos Mais Vendidos no Balcão
          </h3>
          <span className="text-xs text-stone-500 font-medium">Top itens com maior saída</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Peça Artesanal</th>
                <th className="py-3 px-4 font-semibold text-center">Unidades Vendidas</th>
                <th className="py-3 px-4 font-semibold text-right">Faturamento Gerado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {topProducts.map((prod, idx) => (
                <tr key={prod.name} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-stone-900">
                    {prod.quantity} un.
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800">
                    R$ {prod.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
