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

const COLORS = ['#2e1420', '#c85a78', '#dc9b86', '#3c6b54', '#8a4157', '#644855', '#ca8974', '#8e727e'];

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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c85a78] font-mono-craft">
            Inteligência Coletiva & BI
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#2e1420]">
            Relatórios & Indicadores
          </h2>
          <p className="text-xs sm:text-sm text-[#8e727e] mt-1 font-light">
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
          className="outline-button text-xs font-mono-craft flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#c85a78]" />
          <span>Exportar Relatório (JSON)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-craft">
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#edd5dc] shadow-2xs">
          <span className="text-xs text-[#8e727e] uppercase font-semibold">Faturamento Bruto</span>
          <div className="text-2xl font-bold text-[#2e1420] mt-1">
            R$ {totalVolume.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-[#8e727e] mt-1 block">Volume total de peças vendidas</span>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#edd5dc] shadow-2xs">
          <span className="text-xs text-[#8e727e] uppercase font-semibold">Volume de Atendimentos</span>
          <div className="text-2xl font-bold text-[#c85a78] mt-1">
            {totalSalesCount} transações
          </div>
          <span className="text-[11px] text-[#8e727e] mt-1 block">Cupons emitidos no balcão</span>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#edd5dc] shadow-2xs">
          <span className="text-xs text-[#8e727e] uppercase font-semibold">Ticket Médio</span>
          <div className="text-2xl font-bold text-[#3c6b54] mt-1">
            R$ {ticketMedio.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-[#8e727e] mt-1 block">Média por cliente atendido</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Brand (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl p-6 border border-[#edd5dc] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-lg text-[#2e1420]">
              Vendas por Marca / Ateliê (R$)
            </h3>
            <span className="text-xs text-[#8e727e] font-mono-craft">Consolidado</span>
          </div>

          <div className="h-72 w-full pt-4 font-mono-craft">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByBrand} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edd5dc" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#8e727e' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#8e727e' }} />
                <Tooltip
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Vendas']}
                  contentStyle={{ backgroundColor: '#2e1420', borderRadius: '12px', color: '#ffffff', fontSize: '12px', border: '1px solid #2e1420' }}
                />
                <Bar dataKey="value" fill="#c85a78" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Payment Method (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl p-6 border border-[#edd5dc] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-lg text-[#2e1420]">
              Distribuição por Meio de Pagamento
            </h3>
          </div>

          <div className="h-72 w-full pt-4 font-mono-craft">
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
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2).replace('.', ',')}`, 'Total']}
                  contentStyle={{ backgroundColor: '#2e1420', borderRadius: '12px', color: '#ffffff', fontSize: '12px', border: '1px solid #2e1420' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#edd5dc] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#edd5dc] flex items-center justify-between">
          <h3 className="font-display font-medium text-lg text-[#2e1420]">
            Produtos Mais Vendidos no Balcão
          </h3>
          <span className="text-xs text-[#8e727e] font-mono-craft">Top itens com maior saída</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6ebef]/70 border-b border-[#edd5dc] text-[#8e727e] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Peça Artesanal</th>
                <th className="py-3 px-4 font-semibold text-center">Unidades Vendidas</th>
                <th className="py-3 px-4 font-semibold text-right">Faturamento Gerado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ebef] text-[#2e1420]">
              {topProducts.map((prod, idx) => (
                <tr key={prod.name} className="hover:bg-[#f6ebef]/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#2e1420] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#f6ebef] text-[#2e1420] text-[10px] font-bold font-mono-craft flex items-center justify-center border border-[#edd5dc]">
                      {idx + 1}
                    </span>
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono-craft text-[#2e1420]">
                    {prod.quantity} un.
                  </td>
                  <td className="py-3 px-4 text-right font-bold font-mono-craft text-[#3c6b54]">
                    R$ {prod.total.toFixed(2).replace('.', ',')}
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
