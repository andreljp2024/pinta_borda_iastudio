import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  Phone,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Store,
  Tag,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Partner } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';

export const VirtualStoreView: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { products, partners, categories, setActiveView, storePartnerFilter, setStorePartnerFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPartner, setSelectedPartner] = useState<string>(storePartnerFilter || 'ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name'>('name');

  // Keep selectedPartner in sync with storePartnerFilter when it changes externally
  React.useEffect(() => {
    if (storePartnerFilter) {
      setSelectedPartner(storePartnerFilter);
    }
  }, [storePartnerFilter]);

  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartner(partnerId);
    setStorePartnerFilter(partnerId);
  };

  const currentPartnerInfo = useMemo(() => {
    return partners.find((p) => p.id === selectedPartner);
  }, [partners, selectedPartner]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.partnerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;

      const matchesPartner =
        selectedPartner === 'ALL' || product.partnerId === selectedPartner;

      return matchesSearch && matchesCategory && matchesPartner;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [products, searchQuery, selectedCategory, selectedPartner, sortBy]);

  const activePartnerCount = partners.filter((p) => p.status === 'ATIVO').length;

  return (
    <div className="min-h-screen bg-[#f8f5ef] pb-24 text-[#253a35]">
      {/* Header Banner */}
      <div className="bg-[#253a35] text-[#fffaf2] border-b border-[#38524a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <button
                onClick={() => setActiveView('landing')}
                className="inline-flex items-center gap-1.5 text-xs font-mono-craft text-[#d4ba84] hover:text-[#fffaf2] transition-colors cursor-pointer mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar à Página Inicial
              </button>
              <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#fffaf2]">
                Vitrine Digital & Catálogo Físico
              </h1>
              <p className="text-[#c9d9d0] text-xs sm:text-sm leading-relaxed font-light">
                Explore o acervo exclusivo de peças autorais disponíveis no quiosque do{' '}
                <strong className="text-[#fffaf2] font-semibold">Rio Anil Shopping (2º Piso, em frente à Marisa)</strong>. Compre diretamente
                com o ateliê responsável via WhatsApp com entrega ou retirada no local.
              </p>
            </div>

            {/* Quick Shopping Info Pill */}
            <div className="bg-[#1f332d] rounded-2xl p-4 border border-[#38524a] text-xs space-y-2 shrink-0 md:max-w-xs shadow-md">
              <div className="flex items-center gap-2 text-[#d4ba84] font-medium font-mono-craft">
                <Store className="w-4 h-4" />
                <span>Ponto de Retirada & Balcão</span>
              </div>
              <p className="text-[#c9d9d0] text-[11px] leading-snug">
                Rio Anil Shopping, Piso 2, São Luís/MA. Segunda a sábado das 10h às 22h.
              </p>
              <div className="pt-1 text-[11px] font-mono-craft text-[#a9c2b4] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3c6b54] animate-pulse" />
                {products.length} peças catalogadas de {activePartnerCount} ateliês
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sticky top-16 z-20 bg-[#fffaf2]/95 backdrop-blur-md border-b border-[#ded6ca] py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8c83]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por peça, técnica, SKU ou ateliê..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#ded6ca] bg-[#f8f5ef] text-xs font-mono-craft text-[#253a35] placeholder-[#7d8c83] focus:outline-hidden focus:border-[#b56f55] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-craft text-[#7d8c83] hover:text-[#253a35] cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Filter by Partner */}
            <div className="flex items-center gap-2">
              <select
                value={selectedPartner}
                onChange={(e) => handlePartnerChange(e.target.value)}
                className="px-3.5 py-2.5 rounded-full border border-[#ded6ca] bg-[#f8f5ef] text-xs font-mono-craft text-[#253a35] focus:outline-hidden focus:border-[#b56f55] cursor-pointer"
              >
                <option value="ALL">Todos os Ateliês ({partners.length})</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.brandName}
                  </option>
                ))}
              </select>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-full border border-[#ded6ca] bg-[#f8f5ef] text-xs font-mono-craft text-[#253a35] focus:outline-hidden focus:border-[#b56f55] cursor-pointer"
              >
                <option value="name">Ordenar: Nome A-Z</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-full font-mono-craft whitespace-nowrap transition-all cursor-pointer text-xs ${
                selectedCategory === 'ALL'
                  ? 'bg-[#253a35] text-[#fffaf2] font-medium shadow-xs'
                  : 'bg-[#ede5d8] text-[#52615a] hover:bg-[#ded6ca] hover:text-[#253a35]'
              }`}
            >
              Todas as Peças ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-4 py-2 rounded-full font-mono-craft whitespace-nowrap transition-all cursor-pointer text-xs ${
                  selectedCategory === cat.code
                    ? 'bg-[#253a35] text-[#fffaf2] font-medium shadow-xs'
                    : 'bg-[#ede5d8] text-[#52615a] hover:bg-[#ded6ca] hover:text-[#253a35]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Selected Partner Highlight Banner */}
        {currentPartnerInfo && (
          <div className="mb-8 bg-[#fffaf2] rounded-3xl p-6 border border-[#ded6ca] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentPartnerInfo.brandLogo}
                alt={currentPartnerInfo.brandName}
                className="w-16 h-16 rounded-2xl object-cover border border-[#ded6ca] shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ede5d8] text-[#824f3c] font-mono-craft text-[10px] tracking-wider uppercase border border-[#ded6ca]">
                    Ateliê Autoral Maranhense
                  </span>
                </div>
                <h2 className="font-display text-2xl font-medium text-[#253a35] mt-0.5">
                  {currentPartnerInfo.brandName}
                </h2>
                <p className="text-xs text-[#52615a] mt-0.5 font-light">
                  Artesã criadora: <strong className="text-[#253a35] font-medium">{currentPartnerInfo.ownerName}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {currentPartnerInfo.whatsapp && (
                <a
                  href={`https://wa.me/${currentPartnerInfo.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Vi%20as%20pe%C3%A7as%20da%20${encodeURIComponent(currentPartnerInfo.brandName)}%20na%20Loja%20Virtual%20do%20Pinta%20e%20Borda.`}
                  target="_blank"
                  rel="noreferrer"
                  className="solid-button !py-2 !px-3.5 text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp do Ateliê</span>
                </a>
              )}
              {currentPartnerInfo.instagram && (
                <a
                  href={`https://instagram.com/${currentPartnerInfo.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button !py-2 !px-3.5 text-xs font-mono-craft flex items-center gap-1.5"
                >
                  <span>{currentPartnerInfo.instagram}</span>
                </a>
              )}
              <button
                onClick={() => handlePartnerChange('ALL')}
                className="px-3.5 py-2 rounded-full bg-[#ede5d8] hover:bg-[#ded6ca] text-[#253a35] font-mono-craft text-xs transition-colors cursor-pointer border border-[#ded6ca]"
              >
                Ver todos os ateliês
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-[#52615a] font-mono-craft">
            Exibindo <strong className="text-[#253a35]">{filteredProducts.length}</strong> peças autorais
            {selectedPartner !== 'ALL' && (
              <span className="ml-1 text-[#b56f55]">
                do ateliê {partners.find((p) => p.id === selectedPartner)?.brandName}
              </span>
            )}
          </div>

          {(selectedCategory !== 'ALL' || selectedPartner !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                handlePartnerChange('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-mono-craft text-[#b56f55] hover:underline cursor-pointer"
            >
              Redefinir filtros
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#fffaf2] rounded-3xl p-12 text-center border border-[#ded6ca] space-y-4 max-w-md mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#ede5d8] text-[#824f3c] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-medium text-[#253a35]">
              Nenhuma peça encontrada
            </h3>
            <p className="text-xs text-[#52615a] font-light leading-relaxed">
              Não localizamos produtos para os filtros aplicados. Tente buscar por outros termos ou verifique todas as categorias.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedPartner('ALL');
                setSearchQuery('');
              }}
              className="solid-button text-xs !py-2.5 !px-5 inline-block"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const partner = partners.find((p) => p.id === product.partnerId);
              const isLowStock = product.stockPhysical <= 2 && product.stockPhysical > 0;
              const isOutOfStock = product.stockPhysical === 0;

              return (
                <div
                  key={product.id}
                  className="bg-[#fffaf2] rounded-3xl border border-[#ded6ca] overflow-hidden hover:border-[#b56f55] hover:shadow-lg transition-all flex flex-col group p-3.5"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-[#ede5d8] cursor-pointer"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <span className="px-2.5 py-1 rounded-full bg-[#253a35]/85 backdrop-blur-xs text-[#fffaf2] text-[10px] font-mono-craft">
                        {product.partnerName}
                      </span>
                      {product.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#b56f55] text-white text-[9px] font-mono-craft flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-[#d4ba84]" /> Destaque
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                      {isOutOfStock ? (
                        <span className="px-2 py-1 rounded-md bg-[#253a35]/85 text-[#c9d9d0] text-[10px] font-mono-craft">
                          Sob encomenda
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-1 rounded-md bg-[#ede5d8] text-[#824f3c] text-[10px] font-mono-craft font-bold border border-[#ded6ca]">
                          Últimas {product.stockPhysical} un.
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-[#fffaf2]/95 text-[#253a35] text-[10px] font-mono-craft border border-[#ded6ca] shadow-2xs">
                          {product.stockPhysical} na casa
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-3 px-1 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#7d8c83] font-mono-craft mb-1">
                        <span>{product.sku}</span>
                        <span>{product.category}</span>
                      </div>
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-display font-medium text-[#253a35] text-lg leading-snug group-hover:text-[#b56f55] transition-colors cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#52615a] mt-1 line-clamp-2 leading-relaxed font-light">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#ded6ca]/70 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-[#7d8c83] block uppercase font-mono-craft">
                            Preço no Shopping
                          </span>
                          <span className="font-mono-craft font-bold text-lg text-[#253a35]">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {product.price >= 60 && (
                          <span className="text-[10px] text-[#7d8c83] font-mono-craft">
                            em até 3x no cartão
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 py-2 px-3 bg-[#ede5d8] hover:bg-[#ded6ca] text-[#253a35] rounded-xl text-xs font-mono-craft transition-colors cursor-pointer border border-[#ded6ca]"
                        >
                          Ver Detalhes
                        </button>

                        <a
                          href={`https://wa.me/55${(partner?.phone || '98988289123').replace(/\D/g, '')}?text=Ol%C3%A1!%20Vi%20a%20pe%C3%A7a%20*%22${encodeURIComponent(
                            product.name
                          )}%22*%20(SKU%3A%20${product.sku})%20no%20cat%C3%A1logo%20do%20Pinta%20e%20Borda%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Comprar direto com a artesã no WhatsApp"
                          className="p-2.5 bg-[#b56f55] hover:bg-[#965a44] text-white rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          partner={partners.find((p) => p.id === selectedProduct.partnerId)}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
