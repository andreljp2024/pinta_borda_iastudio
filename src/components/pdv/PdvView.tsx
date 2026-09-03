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
      <div className="bg-[#fffaf2] rounded-2xl p-4 border border-[#ded6ca] shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ede5d8] text-[#824f3c] flex items-center justify-center font-bold border border-[#ded6ca]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7d8c83] font-mono-craft">
                Ponto de Venda • Rio Anil Shopping
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#3c6b54] animate-pulse" />
            </div>
            <div className="text-sm font-bold text-[#253a35]">
              Operador em Atendimento:{' '}
              <span className="text-[#b56f55] font-semibold">
                {activeShift ? activeShift.operatorName : 'Administrador Geral'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono-craft">
          {activeShift ? (
            <button
              onClick={onOpenShiftModal}
              className="outline-button !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-[#b56f55]" />
              Trocar Operador / Encerrar Turno
            </button>
          ) : (
            <button
              onClick={onOpenShiftModal}
              className="solid-button !py-1.5 !px-3 text-xs flex items-center gap-1.5"
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
          <div className="bg-[#fffaf2] rounded-2xl p-4 border border-[#ded6ca] shadow-2xs space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#7d8c83] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, SKU (ex: TUT-001) ou ateliê..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#ded6ca] focus:outline-none focus:ring-2 focus:ring-[#b56f55]/20 focus:border-[#b56f55] bg-white placeholder-[#7d8c83]"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-craft">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                  selectedCategoryId === 'all'
                    ? 'bg-[#253a35] text-[#fffaf2] font-semibold'
                    : 'bg-[#ede5d8] text-[#52615a] hover:bg-[#e4d8c5]'
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
                      ? 'bg-[#253a35] text-[#fffaf2] font-semibold'
                      : 'bg-[#ede5d8] text-[#52615a] hover:bg-[#e4d8c5]'
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
                  className={`bg-[#fffaf2] rounded-xl p-3 border transition-all flex flex-col justify-between select-none ${
                    isOutOfStock
                      ? 'opacity-50 border-[#ded6ca] cursor-not-allowed'
                      : 'border-[#ded6ca] hover:border-[#b56f55] hover:shadow-sm cursor-pointer active:scale-98'
                  }`}
                >
                  <div>
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-[#ede5d8] mb-2">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-[#253a35]/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono-craft">
                        {prod.sku}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#b56f55] truncate font-mono-craft">
                      {partner?.brandName || 'Artesão'}
                    </div>
                    <h4 className="font-medium text-xs text-[#253a35] line-clamp-2 leading-tight mt-0.5 font-display">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#ded6ca] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#253a35] font-mono-craft">
                        R$ {prod.price.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-[10px] text-[#7d8c83] font-mono-craft">
                        {prod.stock} em estoque
                      </div>
                    </div>
                    <button
                      disabled={isOutOfStock}
                      className="w-7 h-7 rounded-lg bg-[#ede5d8] hover:bg-[#b56f55] hover:text-white flex items-center justify-center text-[#824f3c] transition-colors border border-[#ded6ca]"
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
          <div className="bg-[#fffaf2] rounded-2xl border border-[#ded6ca] shadow-2xs p-5 flex flex-col justify-between">
            <div>
              {/* Cart Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ded6ca]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#b56f55]" />
                  <h3 className="font-display font-medium text-base text-[#253a35]">
                    Carrinho Multi-Marca
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-[#b56f55] hover:text-[#824f3c] hover:underline cursor-pointer font-mono-craft"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#ede5d8] max-h-60 overflow-y-auto my-3 pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-[#7d8c83] text-xs font-mono-craft">
                    Nenhum produto adicionado ao carrinho ainda. Clique nos itens ao lado para vender.
                  </div>
                ) : (
                  cart.map((item) => {
                    const partner = partners.find((p) => p.id === item.product.partnerId);
                    return (
                      <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-[#253a35] truncate font-display">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-[#b56f55] font-mono-craft">
                            {partner?.brandName} • R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded6ca] flex items-center justify-center text-[#253a35] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#253a35] font-mono-craft">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-[#ede5d8] hover:bg-[#ded6ca] flex items-center justify-center text-[#253a35] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="w-6 h-6 rounded text-[#7d8c83] hover:text-[#b56f55] flex items-center justify-center ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right font-bold text-xs text-[#253a35] shrink-0 w-16 font-mono-craft">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Multi-brand Ownership Summary Tag */}
              {brandBreakdown.length > 1 && (
                <div className="bg-[#ede5d8]/70 rounded-xl p-2.5 border border-[#ded6ca] mb-3 text-[11px] text-[#253a35] space-y-1 font-mono-craft">
                  <div className="font-bold flex items-center gap-1 text-[#b56f55]">
                    <Sparkles className="w-3 h-3 text-[#b56f55]" />
                    Venda Compartilhada ({brandBreakdown.length} marcas):
                  </div>
                  {brandBreakdown.map((b) => (
                    <div key={b.brandName} className="flex justify-between text-[#52615a]">
                      <span>{b.brandName} ({b.count} itens):</span>
                      <span className="font-semibold text-[#253a35]">R$ {b.gross.toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Methods (PRD Section 17, 18, 20, 21) */}
              <div className="space-y-3 pt-2 border-t border-[#ded6ca]">
                <label className="block text-xs font-bold text-[#253a35] uppercase tracking-wide font-mono-craft">
                  Forma de Pagamento
                </label>

                {/* Method selector tabs */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono-craft">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDITO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'CREDITO'
                        ? 'bg-[#253a35] text-white border-[#253a35] shadow-xs'
                        : 'bg-[#ede5d8] border-[#ded6ca] text-[#253a35] hover:bg-[#e4d8c5]'
                    }`}
                  >
                    Crédito
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DEBITO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'DEBITO'
                        ? 'bg-[#253a35] text-white border-[#253a35] shadow-xs'
                        : 'bg-[#ede5d8] border-[#ded6ca] text-[#253a35] hover:bg-[#e4d8c5]'
                    }`}
                  >
                    Débito
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX_CENTRALIZADO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'PIX_CENTRALIZADO' || paymentMethod === 'PIX_DIRETO'
                        ? 'bg-[#1f4e38] text-white border-[#1f4e38] shadow-xs'
                        : 'bg-[#ede5d8] border-[#ded6ca] text-[#253a35] hover:bg-[#e4d8c5]'
                    }`}
                  >
                    Pix
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('DINHEIRO')}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      paymentMethod === 'DINHEIRO'
                        ? 'bg-[#253a35] text-white border-[#253a35] shadow-xs'
                        : 'bg-[#ede5d8] border-[#ded6ca] text-[#253a35] hover:bg-[#e4d8c5]'
                    }`}
                  >
                    Dinheiro
                  </button>
                </div>

                {/* Credit Configuration */}
                {paymentMethod === 'CREDITO' && (
                  <div className="bg-[#ede5d8]/60 p-3 rounded-xl border border-[#ded6ca] space-y-2.5 text-xs font-mono-craft">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#52615a] mb-1">
                          Bandeira
                        </label>
                        <select
                          value={cardBrand}
                          onChange={(e) => setCardBrand(e.target.value as any)}
                          className="w-full p-2 bg-white rounded-lg border border-[#ded6ca] text-xs focus:outline-none"
                        >
                          <option value="VISA">Visa</option>
                          <option value="MASTERCARD">Mastercard</option>
                          <option value="ELO">Elo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#52615a] mb-1">
                          Parcelas
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border border-[#ded6ca] text-xs focus:outline-none"
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
                  <div className="bg-[#ede5d8]/60 p-3 rounded-xl border border-[#ded6ca] space-y-2 text-xs font-mono-craft">
                    <div className="flex items-center justify-between">
                      <span className="text-[#52615a]">Bandeira:</span>
                      <div className="flex gap-2">
                        {(['VISA', 'MASTERCARD', 'ELO'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setCardBrand(b)}
                            className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                              cardBrand === b ? 'bg-[#253a35] text-white' : 'bg-white border border-[#ded6ca] text-[#253a35]'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#52615a] flex justify-between">
                      <span>Taxa Stone Débito:</span>
                      <span className="font-semibold text-[#253a35]">{feePct}%</span>
                    </div>
                  </div>
                )}

                {/* Pix Configuration (PRD Section 20) */}
                {(paymentMethod === 'PIX_CENTRALIZADO' || paymentMethod === 'PIX_DIRETO') && (
                  <div className="bg-[#eaf4ef] p-3.5 rounded-xl border border-[#bed8c7] space-y-3 text-xs font-mono-craft">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-[#1f4e38]" />
                      <div>
                        <div className="font-bold text-[#1f4e38]">
                          {paymentMethod === 'PIX_CENTRALIZADO' ? 'Pix Centralizado Pinta e Borda' : 'Pix Direto Marca'}
                        </div>
                        <div className="text-[10px] text-[#2e684c]">
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
                        className="flex-1 py-1.5 px-2 bg-white hover:bg-[#d9ede2] rounded-lg border border-[#bed8c7] font-semibold text-[#1f4e38] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {pixCopied ? <Check className="w-3.5 h-3.5 text-[#1f4e38]" /> : <Copy className="w-3.5 h-3.5" />}
                        {pixCopied ? 'Chave Copiada!' : 'Copiar Chave Pix'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPixWebhookConfirmed(true)}
                        className={`py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer ${
                          pixWebhookConfirmed
                            ? 'bg-[#1f4e38] text-white'
                            : 'bg-[#2d7353] text-white hover:bg-[#1f4e38]'
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
                  <div className="bg-[#ede5d8]/60 p-3 rounded-xl border border-[#ded6ca] space-y-2 text-xs font-mono-craft">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[#52615a] font-semibold">Valor Recebido (R$):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                        placeholder={totalGross.toFixed(2)}
                        className="w-28 p-1.5 bg-white border border-[#ded6ca] rounded text-right font-bold text-[#253a35]"
                      />
                    </div>
                    {cashReceived > totalGross && (
                      <div className="flex justify-between items-center bg-[#dff0e6] p-2 rounded text-[#1f4e38] font-bold">
                        <span>Troco a Devolver:</span>
                        <span>R$ {(cashReceived - totalGross).toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Customer info with WhatsApp digital receipt incentive */}
                <div className="pt-2 border-t border-[#ded6ca] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-craft">
                    <span className="font-semibold text-[#253a35] flex items-center gap-1.5">
                      <span className="text-emerald-700">📱</span> Comprovante Digital via WhatsApp
                    </span>
                    <span className="text-[10px] text-[#7d8c83] bg-[#ede5d8] px-2 py-0.5 rounded-full font-medium">
                      Sem papel • Sustentável
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nome do Cliente (opcional)"
                        className="w-full p-2 bg-white border border-[#ded6ca] rounded-xl text-xs text-[#253a35] focus:outline-none focus:border-[#1f4e38]"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="WhatsApp do Cliente (DDD)"
                        className="w-full pl-7 pr-2 py-2 bg-white border border-[#ded6ca] rounded-xl text-xs text-[#253a35] focus:outline-none focus:border-[#1f4e38]"
                      />
                      <span className="absolute left-2.5 top-2.5 text-[#7d8c83] text-[11px]">📱</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Settlement & Checkout Button (PRD Section 16, 19, 22) */}
            <div className="pt-4 border-t border-[#ded6ca] space-y-3 mt-4">
              <div className="bg-[#ede5d8]/50 rounded-xl p-3 text-xs space-y-1 border border-[#ded6ca] font-mono-craft">
                <div className="flex justify-between text-[#52615a]">
                  <span>Subtotal Bruto:</span>
                  <span className="font-semibold text-[#253a35]">R$ {totalGross.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[#52615a]">
                  <span>Taxa Máquina ({feePct}% congelada):</span>
                  <span className="text-[#b56f55] font-medium">- R$ {estimatedFeeAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[#52615a]">
                  <span>Comissão Pinta e Borda (10%):</span>
                  <span className="text-[#52615a] font-medium">- R$ {estimatedCommissionAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[#1f4e38] font-bold pt-1 border-t border-[#ded6ca]">
                  <span>Repasse Líquido aos Artesãos:</span>
                  <span>R$ {estimatedTotalNet.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Total Banner */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#7d8c83] uppercase font-semibold font-mono-craft">Total a Cobrar</span>
                  <div className="text-2xl font-bold text-[#253a35] font-mono-craft">
                    R$ {totalGross.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinalizeSale}
                  disabled={cart.length === 0}
                  className={`solid-button !py-3.5 !px-6 text-sm flex items-center gap-2 cursor-pointer ${
                    cart.length === 0 ? 'opacity-40 !cursor-not-allowed' : ''
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
