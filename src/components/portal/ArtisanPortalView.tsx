import React, { useState, useMemo } from 'react';
import {
  Smartphone,
  Sparkles,
  TrendingUp,
  Package,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Plus,
  Send,
  Calendar,
  Store,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  X,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Partner, Product, SaleItem } from '../../types';

export const ArtisanPortalView: React.FC = () => {
  const {
    partners,
    currentPartner,
    userRole,
    setUserRole,
    products,
    sales,
    shifts,
    settlements,
    monthlyFees,
    activeShift,
    addStockMovement,
    setActiveView,
    navigateToStoreWithPartner,
  } = useApp();

  // Active selected partner for the portal (defaults to currentPartner or first partner)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    currentPartner?.id || partners[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'SALES' | 'STOCK' | 'SHIFTS' | 'SHARE'>('SALES');
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Restock Modal State
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState<number>(5);
  const [restockSuccessMsg, setRestockSuccessMsg] = useState<string | null>(null);

  // Shift Swap Request Modal
  const [isShiftSwapOpen, setIsShiftSwapOpen] = useState(false);
  const [targetSwapPartnerId, setTargetSwapPartnerId] = useState<string>('');
  const [swapReason, setSwapReason] = useState<string>('');
  const [swapSuccess, setSwapSuccess] = useState(false);

  const activePartner: Partner = useMemo(() => {
    return (
      partners.find((p) => p.id === selectedPartnerId) ||
      currentPartner ||
      partners[0]
    );
  }, [partners, selectedPartnerId, currentPartner]);

  // Filter products for this artisan
  const partnerProducts = useMemo(() => {
    return products.filter((p) => p.partnerId === activePartner?.id);
  }, [products, activePartner?.id]);

  // Critical stock products (stock <= minStock or 0)
  const lowStockProducts = useMemo(() => {
    return partnerProducts.filter((p) => p.stock <= p.minStock);
  }, [partnerProducts]);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Sales containing items from this artisan
  const partnerSalesData = useMemo(() => {
    if (!activePartner) return { todayGross: 0, todayNet: 0, todayCount: 0, monthGross: 0, monthNet: 0, recentItems: [] };

    let todayGross = 0;
    let todayNet = 0;
    let todayCount = 0;
    let monthGross = 0;
    let monthNet = 0;

    const recentItems: {
      saleId: string;
      saleNumber: string;
      timestamp: string;
      productName: string;
      quantity: number;
      subtotal: number;
      netAmount: number;
      operatorName: string;
      paymentMethod: string;
    }[] = [];

    sales.forEach((sale) => {
      if (sale.status === 'CANCELADO' || sale.status === 'ESTORNADO') return;

      const isToday = sale.timestamp.startsWith(todayStr);

      sale.items.forEach((item) => {
        if (item.partnerId === activePartner.id) {
          // Gross & Net for this item
          const gross = item.subtotal;
          const net = item.netAmountToPartner;

          monthGross += gross;
          monthNet += net;

          if (isToday) {
            todayGross += gross;
            todayNet += net;
            todayCount += item.quantity;
          }

          recentItems.push({
            saleId: sale.id,
            saleNumber: sale.saleNumber,
            timestamp: sale.timestamp,
            productName: item.productName,
            quantity: item.quantity,
            subtotal: gross,
            netAmount: net,
            operatorName: sale.operatorName,
            paymentMethod: sale.paymentMethod,
          });
        }
      });
    });

    recentItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      todayGross,
      todayNet,
      todayCount,
      monthGross,
      monthNet,
      recentItems: recentItems.slice(0, 15),
    };
  }, [sales, activePartner, todayStr]);

  // Next scheduled shift for this artisan
  const partnerShifts = useMemo(() => {
    if (!activePartner) return [];
    return shifts
      .filter((s) => s.partnerId === activePartner.id)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [shifts, activePartner]);

  const nextShift = useMemo(() => {
    return (
      partnerShifts.find(
        (s) => s.status === 'AGENDADO' || s.status === 'ATIVO'
      ) || null
    );
  }, [partnerShifts]);

  // Monthly fee status
  const currentMonthlyFee = useMemo(() => {
    if (!activePartner) return null;
    return monthlyFees.find((f) => f.partnerId === activePartner.id) || null;
  }, [monthlyFees, activePartner]);

  // Latest settlement
  const latestSettlement = useMemo(() => {
    if (!activePartner) return null;
    return settlements.find((s) => s.partnerId === activePartner.id) || null;
  }, [settlements, activePartner]);

  // Copy Pix Key
  const handleCopyPix = () => {
    if (!activePartner?.pixKey) return;
    navigator.clipboard.writeText(activePartner.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  // Copy Store Link
  const handleCopyStoreLink = () => {
    const link = `${window.location.origin}/#loja?marca=${activePartner?.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp share catalog
  const handleShareCatalogWhatsApp = () => {
    const text =
      `Olá! ✨ Conheça as peças autorais do *${activePartner.brandName}* na *Pinta e Borda — Casa Colaborativa*!\n\n` +
      `Estamos no *Rio Anil Shopping* (São Luís/MA) com produtos feitos à mão com muito carinho e identidade maranhense.\n\n` +
      `🛍️ Veja nosso catálogo autoral na vitrine digital:\n` +
      `${window.location.origin}/#loja\n\n` +
      `Venha nos visitar no quiosque ou me mande mensagem para reservar sua peça favorita! 🌿`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Handle restock submission
  const handleExecuteRestock = () => {
    if (!restockProduct || restockQty <= 0) return;

    addStockMovement({
      productId: restockProduct.id,
      type: 'ENTRADA',
      quantityChanged: Number(restockQty),
      reason: `Reposição direta pelo ateliê (${activePartner.brandName}) levada ao quiosque`,
    });

    setRestockSuccessMsg(`Sucesso! +${restockQty} un. adicionadas ao estoque de ${restockProduct.name}.`);
    setTimeout(() => {
      setRestockSuccessMsg(null);
      setIsRestockOpen(false);
      setRestockProduct(null);
      setRestockQty(5);
    }, 1800);
  };

  // WhatsApp restock notice to attendant
  const handleNotifyAttendantWhatsApp = (product: Product) => {
    const attendantName = activeShift?.operatorName || 'Equipe do Balcão';
    const text =
      `Olá, ${attendantName}! 🌿\n` +
      `Aqui é a *${activePartner.ownerName}* do *${activePartner.brandName}*.\n\n` +
      `Vi pelo Portal da Artesã que o item *"${product.name}"* está com estoque baixo (${product.stock} un.).\n` +
      `Estou preparando novas peças no ateliê para levar ao Rio Anil Shopping em breve! ✨`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] pb-16">
      {/* Top Header & Mode Switcher Bar */}
      <div className="bg-[#253a35] text-[#fffaf2] border-b border-[#1b2b27] px-4 py-3 sticky top-18 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f4e38] border border-[#3c6b54] flex items-center justify-center text-[#d4ba84]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-semibold text-base leading-none">
                  Portal da Artesã
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#d4ba84]/20 text-[#d4ba84] font-mono-craft border border-[#d4ba84]/30">
                  Visão Produtora
                </span>
              </div>
              <p className="text-[11px] text-[#c9d9d0] font-mono-craft mt-0.5">
                Acompanhamento em tempo real direto do seu ateliê
              </p>
            </div>
          </div>

          {/* Controls: Partner Selector & Smartphone View Switcher */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick Partner Switcher */}
            <div className="flex items-center gap-1.5 bg-[#1b2b27] px-2.5 py-1.5 rounded-xl border border-[#30483f]">
              <span className="text-[10px] font-mono-craft text-[#95b19f] uppercase tracking-wider">
                Ateliê:
              </span>
              <select
                value={activePartner.id}
                onChange={(e) => {
                  setSelectedPartnerId(e.target.value);
                  setUserRole('PARTNER', e.target.value);
                }}
                className="bg-transparent text-xs text-[#fffaf2] font-semibold focus:outline-none cursor-pointer pr-2"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#253a35] text-white">
                    {p.brandName} ({p.ownerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Simulation Frame Toggle */}
            <button
              onClick={() => setIsMobileSimulated(!isMobileSimulated)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-craft flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isMobileSimulated
                  ? 'bg-[#d4ba84] text-[#253a35] font-bold border-[#d4ba84]'
                  : 'bg-[#1b2b27] text-[#c9d9d0] hover:text-white border-[#30483f]'
              }`}
              title="Simular visualização idêntica à tela de um celular"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isMobileSimulated ? 'Modo Celular Ativo' : 'Simular Celular'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container (can be framed into mobile phone container or wide view) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div
          className={`mx-auto transition-all duration-300 ${
            isMobileSimulated
              ? 'max-w-[414px] bg-[#fffaf2] rounded-[42px] border-[10px] border-[#253a35] shadow-2xl p-4 min-h-[780px] relative overflow-hidden'
              : 'w-full'
          }`}
        >
          {/* Simulated phone ear speaker if framed */}
          {isMobileSimulated && (
            <div className="w-28 h-4 bg-[#253a35] rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1b2b27] mr-2" />
              <div className="w-12 h-1 bg-[#1b2b27] rounded-full" />
            </div>
          )}

          {/* Header Card: Artisan Brand Profile Banner */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ded6ca] shadow-xs mb-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ede5d8]/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.brandLogo}
                  alt={activePartner.brandName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#b56f55]/30 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display font-semibold text-lg text-[#253a35] leading-tight">
                      {activePartner.brandName}
                    </h2>
                    <span className="inline-block w-2 h-2 rounded-full bg-[#82c39a]" title="Ateliê Ativo" />
                  </div>
                  <p className="text-xs text-[#52615a] font-medium">
                    {activePartner.ownerName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono-craft text-[#7d8c83]">
                    <span className="text-[#b56f55] font-semibold">{activePartner.category}</span>
                    <span>•</span>
                    <span>{partnerProducts.length} peças cadastradas</span>
                  </div>
                </div>
              </div>

              {/* Balcão Live Status Badge */}
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaf4ef] border border-[#bed8c7] text-[#1f4e38] text-[10px] font-mono-craft font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1f4e38] animate-pulse" />
                  <span>Loja Aberta</span>
                </div>
                <p className="text-[10px] text-[#7d8c83] font-mono-craft mt-1">
                  Shopping Rio Anil
                </p>
              </div>
            </div>

            {/* Quick Balcão Attendant Info */}
            <div className="mt-3.5 pt-3 border-t border-[#ede5d8] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-craft">
              <div className="flex items-center gap-1.5 text-[#52615a]">
                <Store className="w-3.5 h-3.5 text-[#b56f55]" />
                <span>Plantão no balcão agora:</span>
                <strong className="text-[#253a35]">
                  {activeShift ? activeShift.operatorName : 'Equipe Pinta e Borda'}
                </strong>
              </div>

              {/* View brand in public catalog */}
              <button
                onClick={() => navigateToStoreWithPartner(activePartner.id)}
                className="text-[11px] text-[#b56f55] hover:text-[#8f523c] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Minha Vitrine</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Navigation Tabs (Optimized for thumb tapping) */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#ede5d8]/70 rounded-2xl border border-[#ded6ca] mb-4 font-mono-craft text-xs">
            <button
              onClick={() => setActiveTab('SALES')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'SALES'
                  ? 'bg-[#253a35] text-[#fffaf2] shadow-xs'
                  : 'text-[#52615a] hover:text-[#253a35]'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] truncate">Meu Caixa</span>
            </button>

            <button
              onClick={() => setActiveTab('STOCK')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                activeTab === 'STOCK'
                  ? 'bg-[#253a35] text-[#fffaf2] shadow-xs'
                  : 'text-[#52615a] hover:text-[#253a35]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="text-[10px] truncate">Reposição</span>
              {lowStockProducts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#b56f55]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('SHIFTS')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'SHIFTS'
                  ? 'bg-[#253a35] text-[#fffaf2] shadow-xs'
                  : 'text-[#52615a] hover:text-[#253a35]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-[10px] truncate">Plantões</span>
            </button>

            <button
              onClick={() => setActiveTab('SHARE')}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'SHARE'
                  ? 'bg-[#253a35] text-[#fffaf2] shadow-xs'
                  : 'text-[#52615a] hover:text-[#253a35]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] truncate">Divulgar</span>
            </button>
          </div>

          {/* TAB 1: MEU CAIXA & VENDAS EM TEMPO REAL */}
          {activeTab === 'SALES' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Highlight Hero Card: Vendas de Hoje */}
              <div className="bg-gradient-to-br from-[#253a35] to-[#1a2c28] text-white rounded-3xl p-5 border border-[#1b2b27] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-craft text-[#d4ba84] uppercase tracking-wider font-semibold">
                    Vendas no Balcão de Hoje
                  </span>
                  <span className="text-[10px] font-mono-craft text-[#95b19f] bg-white/10 px-2 py-0.5 rounded-full">
                    {partnerSalesData.todayCount} {partnerSalesData.todayCount === 1 ? 'peça vendida' : 'peças vendidas'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <p className="text-[10px] text-[#c9d9d0] font-mono-craft">Líquido a receber hoje:</p>
                    <div className="text-3xl font-display font-bold text-white tracking-tight">
                      R$ {partnerSalesData.todayNet.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#c9d9d0] font-mono-craft">Bruto faturado:</p>
                    <p className="text-sm font-bold text-[#d4ba84] font-mono-craft">
                      R$ {partnerSalesData.todayGross.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                {/* Progress / Accumulated info */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-craft text-[#c9d9d0]">
                  <span>Acumulado no Mês Atual:</span>
                  <span className="font-bold text-white">
                    R$ {partnerSalesData.monthNet.toFixed(2).replace('.', ',')} líquido
                  </span>
                </div>
              </div>

              {/* Financial Status Cards (Pix & Monthly fee) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-craft text-xs">
                {/* Pix Registration Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ded6ca] shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#7d8c83]">
                      Chave Pix p/ Repasse
                    </span>
                    <button
                      onClick={handleCopyPix}
                      className="text-[11px] text-[#1f4e38] hover:text-[#133425] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1f4e38]" />
                          <span>Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-bold text-[#253a35] text-xs truncate">
                    {activePartner.pixKey || 'Não cadastrada'}
                  </p>
                  <p className="text-[10px] text-[#7d8c83] mt-0.5">
                    Titular: {activePartner.pixHolderName || activePartner.ownerName}
                  </p>
                </div>

                {/* Monthly Space Fee */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ded6ca] shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#7d8c83]">
                      Mensalidade do Espaço
                    </span>
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                        currentMonthlyFee?.status === 'PAGO'
                          ? 'bg-[#dff0e6] text-[#1f4e38]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}
                    >
                      {currentMonthlyFee?.status === 'PAGO' ? 'Em dia' : 'Aberta'}
                    </span>
                  </div>
                  <p className="font-bold text-[#253a35] text-xs">
                    R$ {activePartner.contract.monthlyFee.toFixed(2).replace('.', ',')} / mês
                  </p>
                  <p className="text-[10px] text-[#7d8c83] mt-0.5">
                    Comissão da casa: {activePartner.contract.salesCommissionRate}%
                  </p>
                </div>
              </div>

              {/* Feed: Peças Vendidas Recentemente */}
              <div className="bg-white rounded-2xl p-4 border border-[#ded6ca] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm text-[#253a35]">
                    Últimas Vendas no Shopping
                  </h3>
                  <span className="text-[10px] font-mono-craft text-[#7d8c83]">
                    Atualizado em tempo real
                  </span>
                </div>

                {partnerSalesData.recentItems.length === 0 ? (
                  <div className="text-center py-6 text-[#7d8c83] font-mono-craft text-xs">
                    <p>Nenhuma venda registrada recentemente para este ateliê.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#ede5d8] font-mono-craft text-xs">
                    {partnerSalesData.recentItems.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[#253a35] leading-snug">
                            {item.quantity}x {item.productName}
                          </p>
                          <p className="text-[10px] text-[#7d8c83] mt-0.5">
                            Cupom {item.saleNumber} • Por {item.operatorName} • {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#1f4e38]">
                            + R$ {item.netAmount.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-[10px] text-[#7d8c83]">
                            (Bruto R$ {item.subtotal.toFixed(2).replace('.', ',')})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REPOSIÇÃO DE ESTOQUE */}
          {activeTab === 'STOCK' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Alert Banner if items are low */}
              {lowStockProducts.length > 0 ? (
                <div className="bg-[#fff3ed] border border-[#f7c8b4] p-3.5 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#b56f55] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-[#94442a]">
                      Atenção: {lowStockProducts.length} {lowStockProducts.length === 1 ? 'peça precisa' : 'peças precisam'} de reposição
                    </p>
                    <p className="text-[#a66e53] text-[11px] mt-0.5 font-light">
                      Itens que esgotaram ou estão abaixo do estoque de segurança no quiosque do shopping.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#eaf4ef] border border-[#bed8c7] p-3.5 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1f4e38] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-[#1f4e38]">Estoque no shopping saudável!</p>
                    <p className="text-[#2e684c] text-[11px] mt-0.5 font-light">
                      Todas as suas peças cadastradas estão com estoque acima do limite mínimo no quiosque.
                    </p>
                  </div>
                </div>
              )}

              {/* Product Stock List */}
              <div className="bg-white rounded-2xl p-4 border border-[#ded6ca] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm text-[#253a35]">
                    Peças no Quiosque do Rio Anil
                  </h3>
                  <span className="text-[10px] font-mono-craft text-[#7d8c83]">
                    {partnerProducts.length} itens no total
                  </span>
                </div>

                <div className="divide-y divide-[#ede5d8]">
                  {partnerProducts.map((product) => {
                    const isZero = product.stock === 0;
                    const isLow = product.stock > 0 && product.stock <= product.minStock;

                    return (
                      <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#ded6ca] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-xs text-[#253a35] truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-[#7d8c83] font-mono-craft">
                              R$ {product.price.toFixed(2).replace('.', ',')} • SKU: {product.sku}
                            </p>

                            {/* Stock badge */}
                            <div className="flex items-center gap-1.5 mt-1 font-mono-craft">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isZero
                                    ? 'bg-[#fee2e2] text-[#991b1b]'
                                    : isLow
                                    ? 'bg-[#fef3c7] text-[#92400e]'
                                    : 'bg-[#eaf4ef] text-[#1f4e38]'
                                }`}
                              >
                                {isZero
                                  ? 'Esgotado (0 un)'
                                  : isLow
                                  ? `Crítico (${product.stock} un)`
                                  : `${product.stock} em estoque`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions: Restock button & WhatsApp notice */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setRestockProduct(product);
                              setIsRestockOpen(true);
                            }}
                            className="p-2 bg-[#ede5d8] hover:bg-[#ded6ca] text-[#253a35] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Lançar reposição de estoque"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline font-mono-craft text-[10px]">Repor</span>
                          </button>

                          <button
                            onClick={() => handleNotifyAttendantWhatsApp(product)}
                            className="p-2 bg-[#dff0e6] hover:bg-[#c2e5d0] text-[#1f4e38] rounded-xl text-xs cursor-pointer transition-colors"
                            title="Avisar no WhatsApp que está levando reposição"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLANTÕES & ESCALA */}
          {activeTab === 'SHIFTS' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Next shift hero card */}
              <div className="bg-white rounded-3xl p-5 border border-[#ded6ca] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#b56f55]" />
                    <span className="text-xs font-mono-craft text-[#52615a] uppercase font-bold">
                      Seu Próximo Plantão no Shopping
                    </span>
                  </div>
                  {nextShift && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dff0e6] text-[#1f4e38] font-mono-craft">
                      Confirmado
                    </span>
                  )}
                </div>

                {nextShift ? (
                  <div className="bg-[#fffaf2] p-4 rounded-2xl border border-[#ede5d8] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display font-semibold text-base text-[#253a35]">
                        {new Date(nextShift.startTime).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                        })}
                      </p>
                      <p className="text-xs font-mono-craft font-bold text-[#b56f55]">
                        10:00 às 16:00
                      </p>
                    </div>
                    <p className="text-xs text-[#7d8c83] font-mono-craft">
                      Local: Quiosque Pinta e Borda • Rio Anil Shopping (Piso L2)
                    </p>
                    <p className="text-[11px] text-[#52615a]">
                      Operador responsável escalado:{' '}
                      <strong className="text-[#253a35]">{nextShift.operatorName}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#ede5d8]/40 border border-[#ded6ca] text-center text-xs text-[#7d8c83] font-mono-craft">
                    <p>Você não possui nenhum plantão pendente na escala desta semana.</p>
                  </div>
                )}

                {/* Actions: Request Swap or Swap with another artisan */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 font-mono-craft text-xs">
                  <button
                    onClick={() => {
                      setIsShiftSwapOpen(true);
                      setSwapSuccess(false);
                    }}
                    className="flex-1 py-2.5 px-3 bg-[#ede5d8] hover:bg-[#ded6ca] text-[#253a35] rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Solicitar Troca de Plantão</span>
                  </button>

                  <button
                    onClick={() => setActiveView('shifts')}
                    className="py-2.5 px-3 border border-[#ded6ca] text-[#52615a] hover:text-[#253a35] rounded-xl font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ver Escala Completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collaborative Policy Info */}
              <div className="bg-[#ede5d8]/60 p-4 rounded-2xl border border-[#ded6ca] text-xs text-[#52615a] space-y-1.5">
                <p className="font-bold text-[#253a35] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1f4e38]" />
                  Regimento de Plantões Colaborativos
                </p>
                <p className="text-[11px] leading-relaxed">
                  Cada ateliê cumpre turnos pré-agendados no balcão para garantir o atendimento aos clientes do shopping. Em caso de imprevisto, solicite a troca com até 24h de antecedência ou acione a diarista do coletivo (taxa diária R$ 60,00).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DIVULGAÇÃO & WHATSAPP */}
          {activeTab === 'SHARE' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl p-5 border border-[#ded6ca] shadow-2xs space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-base text-[#253a35]">
                    Divulgue suas Peças aos Clientes
                  </h3>
                  <p className="text-xs text-[#52615a] mt-0.5">
                    Compartilhe o link da sua marca na loja oficial ou envie um convite acolhedor para seus contatos do WhatsApp.
                  </p>
                </div>

                {/* Direct Link Box */}
                <div className="bg-[#fffaf2] p-3.5 rounded-2xl border border-[#ded6ca] space-y-2 font-mono-craft text-xs">
                  <span className="text-[10px] text-[#7d8c83] uppercase font-bold">
                    Seu Link Direto na Vitrine:
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-[#ded6ca]">
                    <span className="text-xs text-[#253a35] font-semibold truncate">
                      pintaeborda.com.br/loja?marca={activePartner.id}
                    </span>
                    <button
                      onClick={handleCopyStoreLink}
                      className="px-2.5 py-1 bg-[#1f4e38] text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct WhatsApp Share Button */}
                <button
                  onClick={handleShareCatalogWhatsApp}
                  className="w-full py-3 px-4 bg-[#1f4e38] hover:bg-[#153a2a] text-white rounded-2xl font-mono-craft text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Compartilhar Convite no WhatsApp</span>
                </button>

                {/* Mini Preview of Message */}
                <div className="bg-[#e6ebe7] p-3 rounded-2xl border border-[#ded6ca]">
                  <p className="text-[10px] font-mono-craft text-[#52615a] uppercase font-bold mb-1">
                    Mensagem que será enviada:
                  </p>
                  <div className="bg-[#dcf8c6] p-3 rounded-xl text-[11px] text-[#111b21] leading-relaxed">
                    ✨ Conheça as peças autorais do <strong>{activePartner.brandName}</strong> na <strong>Pinta e Borda — Casa Colaborativa</strong> no Rio Anil Shopping... Venha nos visitar ou reserve sua peça favorita! 🌿
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK RESTOCK MODAL */}
      {isRestockOpen && restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#253a35]/65 backdrop-blur-xs p-4">
          <div className="bg-[#fffaf2] rounded-3xl max-w-sm w-full shadow-2xl border border-[#ded6ca] overflow-hidden p-5 animate-in fade-in zoom-in-95 font-mono-craft text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded6ca]">
              <h3 className="font-display font-semibold text-base text-[#253a35]">
                Repor Estoque no Quiosque
              </h3>
              <button
                onClick={() => setIsRestockOpen(false)}
                className="p-1 text-[#7d8c83] hover:text-[#253a35] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={restockProduct.imageUrl}
                  alt={restockProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#ded6ca]"
                />
                <div>
                  <p className="font-semibold text-[#253a35] text-xs">{restockProduct.name}</p>
                  <p className="text-[11px] text-[#7d8c83]">Estoque atual: {restockProduct.stock} un.</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#52615a] mb-1 font-semibold">
                  Quantidade levada ao quiosque:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRestockQty(Math.max(1, restockQty - 1))}
                    className="w-10 h-10 bg-white border border-[#ded6ca] rounded-xl text-base font-bold text-[#253a35] cursor-pointer hover:bg-[#ede5d8]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="flex-1 h-10 text-center bg-white border border-[#ded6ca] rounded-xl font-bold text-sm text-[#253a35] focus:outline-none focus:border-[#1f4e38]"
                  />
                  <button
                    type="button"
                    onClick={() => setRestockQty(restockQty + 1)}
                    className="w-10 h-10 bg-white border border-[#ded6ca] rounded-xl text-base font-bold text-[#253a35] cursor-pointer hover:bg-[#ede5d8]"
                  >
                    +
                  </button>
                </div>
              </div>

              {restockSuccessMsg && (
                <div className="p-2 bg-[#dff0e6] text-[#1f4e38] rounded-xl text-center font-bold text-[11px] animate-in fade-in">
                  {restockSuccessMsg}
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleExecuteRestock}
                className="flex-1 py-2.5 bg-[#1f4e38] hover:bg-[#153a2a] text-white rounded-xl font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Confirmar Reposição
              </button>
              <button
                type="button"
                onClick={() => setIsRestockOpen(false)}
                className="py-2.5 px-3 bg-[#ede5d8] text-[#52615a] hover:text-[#253a35] rounded-xl font-medium cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHIFT SWAP REQUEST MODAL */}
      {isShiftSwapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#253a35]/65 backdrop-blur-xs p-4">
          <div className="bg-[#fffaf2] rounded-3xl max-w-sm w-full shadow-2xl border border-[#ded6ca] overflow-hidden p-5 animate-in fade-in zoom-in-95 font-mono-craft text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded6ca]">
              <h3 className="font-display font-semibold text-base text-[#253a35]">
                Solicitar Troca de Plantão
              </h3>
              <button
                onClick={() => setIsShiftSwapOpen(false)}
                className="p-1 text-[#7d8c83] hover:text-[#253a35] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-[#52615a]">
                Selecione a artesã com quem você combinou a troca de turno ou solicite à coordenação:
              </p>

              <div>
                <label className="block text-[11px] text-[#52615a] mb-1 font-semibold">
                  Artesã / Ateliê Substituto:
                </label>
                <select
                  value={targetSwapPartnerId}
                  onChange={(e) => setTargetSwapPartnerId(e.target.value)}
                  className="w-full p-2 bg-white border border-[#ded6ca] rounded-xl text-xs text-[#253a35] focus:outline-none"
                >
                  <option value="">Selecione a parceira...</option>
                  {partners
                    .filter((p) => p.id !== activePartner.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brandName} ({p.ownerName})
                      </option>
                    ))}
                  <option value="DIARISTA">Contratar Diarista do Coletivo (R$ 60)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#52615a] mb-1 font-semibold">
                  Motivo / Observação:
                </label>
                <textarea
                  rows={2}
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="Ex: Produção intensa de encomendas para feira..."
                  className="w-full p-2 bg-white border border-[#ded6ca] rounded-xl text-xs text-[#253a35] focus:outline-none"
                />
              </div>

              {swapSuccess && (
                <div className="p-2 bg-[#dff0e6] text-[#1f4e38] rounded-xl text-center font-bold text-[11px] animate-in fade-in">
                  Solicitação enviada ao grupo de coordenação do quiosque!
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSwapSuccess(true);
                  setTimeout(() => {
                    setIsShiftSwapOpen(false);
                    setSwapSuccess(false);
                    setTargetSwapPartnerId('');
                    setSwapReason('');
                  }, 1800);
                }}
                className="flex-1 py-2.5 bg-[#1f4e38] hover:bg-[#153a2a] text-white rounded-xl font-semibold cursor-pointer transition-colors"
              >
                Enviar Solicitação
              </button>
              <button
                type="button"
                onClick={() => setIsShiftSwapOpen(false)}
                className="py-2.5 px-3 bg-[#ede5d8] text-[#52615a] hover:text-[#253a35] rounded-xl font-medium cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
