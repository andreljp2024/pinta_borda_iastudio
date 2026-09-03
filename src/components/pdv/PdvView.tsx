import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Store,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Product, PaymentMethod, Sale } from '../../types';
import { ReceiptModal } from './ReceiptModal';

export const PdvView: React.FC<{ onOpenShiftModal: () => void }> = ({ onOpenShiftModal }) => {
  const {
    products,
    partners,
    categories,
    activeShift,
    createSale,
    getApplicableFeeRule,
    feeRules,
  } = useApp();

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Cart
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Payment configuration
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDITO');
  const [terminalName, setTerminalName] = useState('Stone Maquininha Balcão');
  const [cardBrand, setCardBrand] = useState<'VISA' | 'MASTERCARD' | 'ELO'>('VISA');
  const [installments, setInstallments] = useState<number>(1);
  const [cashReceived, setCashReceived] = useState<number>(0);

  // Pix dynamic state
  const [pixCopied, setPixCopied] = useState(false);
  const [pixWebhookConfirmed, setPixWebhookConfirmed] = useState(false);

  // Success modal
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Filter products for PDV
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const brand = partners.find((pt) => pt.id === p.partnerId)?.brandName.toLowerCase() || '';
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          brand.includes(q)
        );
      }
      return true;
    });
  }, [products, partners, searchQuery, selectedCategoryId]);

  // Cart totals
  const totalGross = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // Fee calculation in real-time
  const applicableRule = useMemo(() => {
    return getApplicableFeeRule(paymentMethod, cardBrand, installments);
  }, [getApplicableFeeRule, paymentMethod, cardBrand, installments]);

  const feePct = applicableRule ? applicableRule.feePercentage : 0;
  const estimatedFeeAmount = Math.round((totalGross * (feePct / 100)) * 100) / 100;
  const estimatedCommissionAmount = Math.round((totalGross * 0.10) * 100) / 100;
  const estimatedTotalNet = Math.round((totalGross - estimatedFeeAmount - estimatedCommissionAmount) * 100) / 100;

  // Breakdown by brand for transparency in cart
  const brandBreakdown = useMemo(() => {
    const map = new Map<string, { brandName: string; gross: number; count: number }>();
    cart.forEach((item) => {
      const partner = partners.find((p) => p.id === item.product.partnerId);
      const brandName = partner ? partner.brandName : 'Artesão';
      const prev = map.get(item.product.partnerId) || { brandName, gross: 0, count: 0 };
      map.set(item.product.partnerId, {
        brandName,
        gross: prev.gross + item.product.price * item.quantity,
        count: prev.count + item.quantity,
      });
    });
    return Array.from(map.values());
  }, [cart, partners]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`O produto "${product.name}" está sem estoque no balcão.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Limite de estoque atingido (${product.stock} un. disponíveis).`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.product.stock) {
              alert(`Limite de estoque atingido (${item.product.stock} un. disponíveis).`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCashReceived(0);
    setPixWebhookConfirmed(false);
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar.');
      return;
    }

    if (paymentMethod === 'DINHEIRO' && cashReceived > 0 && cashReceived < totalGross) {
      alert(`Valor recebido em dinheiro (R$ ${cashReceived.toFixed(2)}) é menor que o total da venda.`);
      return;
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#E11D48', '#059669', '#4F46E5'],
      });
    } catch {
      // ignore
    }

    const sale = createSale({
      items: cart,
      paymentMethod,
      terminalName,
      cardBrand: paymentMethod === 'DEBITO' || paymentMethod === 'CREDITO' ? cardBrand : undefined,
      installments: paymentMethod === 'CREDITO' ? installments : 1,
      cashReceived: paymentMethod === 'DINHEIRO' ? (cashReceived || totalGross) : undefined,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
    });

    setCompletedSale(sale);
    handleClearCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Operator Shift Alert Bar (PRD Section 13 & 15) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-stone-500">
                Ponto de Venda • Rio Anil Shopping
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-sm font-bold text-stone-900">
              Operador em Atendimento:{' '}
              <span className="text-amber-900 font-semibold">
                {activeShift ? activeShift.operatorName : 'Administrador Geral'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeShift ? (
            <button
              onClick={onOpenShiftModal}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Trocar Operador / Encerrar Turno
            </button>
          ) : (
            <button
              onClick={onOpenShiftModal}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              Registrar Entrada de Expediente
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Selection Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, SKU (ex: TUT-001) ou marca..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                  selectedCategoryId === 'all'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                    selectedCategoryId === cat.id
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const partner = partners.find((p) => p.id === prod.partnerId);
              const isOutOfStock = prod.stock <= 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => !isOutOfStock && handleAddToCart(prod)}
                  className={`bg-white rounded-xl p-3 border transition-all flex flex-col justify-between select-none ${
                    isOutOfStock
                      ? 'opacity-50 border-stone-200 cursor-not-allowed'
                      : 'border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer active:scale-98'
                  }`}
                >
                  <div>
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                        {prod.sku}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 truncate">
                      {partner?.brandName || 'Artesão'}
                    </div>
                    <h4 className="font-semibold text-xs text-stone-900 line-clamp-2 leading-tight mt-0.5">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        R$ {prod.price.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {prod.stock} em estoque
                      </div>
                    </div>
                    <button
                      disabled={isOutOfStock}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-amber-600 hover:text-white flex items-center justify-center text-stone-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Brand Cashier & Payment Cart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif-display font-bold text-base text-stone-900">
                    Carrinho Multi-Marca
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto my-3 pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 text-xs">
                    Nenhum produto adicionado ao carrinho ainda. Clique nos itens ao lado para vender.
                  </div>
                ) : (
                  cart.map((item) => {
                    const partner = partners.find((p) => p.id === item.product.partnerId);
                    return (
                      <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-stone-900 truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-amber-800 font-medium">
                            {partner?.brandName} • R$ {item.product.price.toFixed(2)} un.
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="w-6 h-6 rounded text-stone-400 hover:text-rose-600 flex items-center justify-center ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right font-bold text-xs text-stone-900 shrink-0 w-16">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Multi-brand Ownership Summary Tag */}
              {brandBreakdown.length > 1 && (
                <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/60 mb-3 text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    Venda Compartilhada ({brandBreakdown.length} marcas):
                  </div>
                  {brandBreakdown.map((b) => (
                    <div key={b.brandName} className="flex justify-between text-stone-600">
                      <span>{b.brandName} ({b.count} itens):</span>
                      <span className="font-semibold text-stone-900">R$ {b.gross.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Methods (PRD Section 17, 18, 20, 21) */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                  Forma de Pagamento
                </label>

                {/* Method selector tabs */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDITO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'CREDITO'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Crédito
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DEBITO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'DEBITO'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Débito
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX_CENTRALIZADO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'PIX_CENTRALIZADO' || paymentMethod === 'PIX_DIRETO'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Pix
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DINHEIRO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'DINHEIRO'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Dinheiro
                  </button>
                </div>

                {/* Credit Configuration */}
                {paymentMethod === 'CREDITO' && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Bandeira
                        </label>
                        <select
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value as any)}
                          className="w-full p-2 bg-white rounded-lg border border-stone-200 text-xs focus:outline-none"
                        >
                          <option value="VISA">Visa</option>
                          <option value="MASTERCARD">Mastercard</option>
                          <option value="ELO">Elo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Parcelas
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border border-stone-200 text-xs focus:outline-none"
                        >
                          <option value={1}>1x à vista ({applicableRule?.feePercentage || 3.99}%)</option>
                          <option value={2}>2x (7.89%)</option>
                          <option value={3}>3x (7.89%)</option>
                          <option value={4}>4x (7.89%)</option>
                          <option value={6}>6x (7.89%)</option>
                          <option value={10}>10x (11.49%)</option>
                          <option value={12}>12x (11.49%)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Debit Configuration */}
                {paymentMethod === 'DEBITO' && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600">Bandeira:</span>
                      <div className="flex gap-2">
                        {(['VISA', 'MASTERCARD', 'ELO'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setCardBrand(b)}
                            className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                              cardBrand === b ? 'bg-stone-900 text-white' : 'bg-white border text-stone-700'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-stone-500 flex justify-between">
                      <span>Taxa Stone Débito:</span>
                      <span className="font-semibold text-stone-800">{feePct}%</span>
                    </div>
                  </div>
                )}

                {/* Pix Configuration (PRD Section 20) */}
                {(paymentMethod === 'PIX_CENTRALIZADO' || paymentMethod === 'PIX_DIRETO') && (
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-700" />
                      <div>
                        <div className="font-bold text-emerald-900">
                          {paymentMethod === 'PIX_CENTRALIZADO' ? 'Pix Centralizado Pinta e Borda' : 'Pix Direto Marca'}
                        </div>
                        <div className="text-[10px] text-emerald-700">
                          Chave CNPJ: 28.919.022/0001-87 (Pinta e Borda Coworking)
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136289190220001875204000053039865802BR5924PINTA E BORDA COWORKING');
                          setPixCopied(true);
                          setTimeout(() => setPixCopied(false), 2000);
                        }}
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-300 font-semibold text-emerald-800 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {pixCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {pixCopied ? 'Chave Copiada!' : 'Copiar Chave Pix'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPixWebhookConfirmed(true)}
                        className={`py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer ${
                          pixWebhookConfirmed
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {pixWebhookConfirmed ? 'Confirmado!' : 'Confirmar Recebimento'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Cash Configuration */}
                {paymentMethod === 'DINHEIRO' && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-stone-600 font-semibold">Valor Recebido (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                        placeholder={totalGross.toFixed(2)}
                        className="w-28 p-1.5 bg-white border border-stone-300 rounded text-right font-bold text-stone-900"
                      />
                    </div>
                    {cashReceived > totalGross && (
                      <div className="flex justify-between items-center bg-emerald-50 p-2 rounded text-emerald-800 font-bold">
                        <span>Troco a Devolver:</span>
                        <span>R$ {(cashReceived - totalGross).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Customer info */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome do Cliente (opcional)"
                    className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp do Cliente"
                    className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Financial Settlement & Checkout Button (PRD Section 16, 19, 22) */}
            <div className="pt-4 border-t border-stone-200 space-y-3 mt-4">
              <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1 border border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Bruto:</span>
                  <span className="font-semibold text-stone-900">R$ {totalGross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Taxa Máquina ({feePct}% congelada):</span>
                  <span className="text-rose-700 font-medium">- R$ {estimatedFeeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Comissão Pinta e Borda (10%):</span>
                  <span className="text-stone-700 font-medium">- R$ {estimatedCommissionAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold pt-1 border-t border-stone-200">
                  <span>Repasse Líquido aos Artesãos:</span>
                  <span>R$ {estimatedTotalNet.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Banner */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-semibold">Total a Cobrar</span>
                  <div className="text-2xl font-bold text-stone-900">
                    R$ {totalGross.toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinalizeSale}
                  disabled={cart.length === 0}
                  className={`py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    cart.length === 0
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                      : 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-900/20 active:scale-98'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>CONCLUIR VENDA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable / Shareable Receipt Modal */}
      <ReceiptModal sale={completedSale} onClose={() => setCompletedSale(null)} />
    </div>
  );
};
