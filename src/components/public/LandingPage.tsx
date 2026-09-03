import React, { useState, useMemo } from 'react';
import {
  Store,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Clock,
  Instagram,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Heart,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Partner } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';

export const LandingPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { products, partners, categories, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [priceOrder, setPriceOrder] = useState<'default' | 'asc' | 'desc'>('default');

  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isPublished || !p.isActive) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const brand = partners.find((pt) => pt.id === p.partnerId)?.brandName.toLowerCase() || '';
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = brand.includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Category match
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Partner match
      if (selectedPartner !== 'all' && p.partnerId !== selectedPartner) {
        return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Featured
      if (featuredOnly && !p.isFeatured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (priceOrder === 'asc') return a.price - b.price;
      if (priceOrder === 'desc') return b.price - a.price;
      return 0;
    });
  }, [products, partners, searchQuery, selectedCategory, selectedPartner, inStockOnly, featuredOnly, priceOrder]);

  const activePartnerForModal = activeModalProduct
    ? partners.find((p) => p.id === activeModalProduct.partnerId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] to-[#FAF8F5] border-b border-stone-200 pt-12 pb-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wide border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Rio Anil Shopping • São Luís/MA
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                O ponto de encontro do <span className="text-amber-800 italic">artesanato autoral</span> maranhense.
              </h1>

              <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                O <strong>Pinta e Borda</strong> é uma loja colaborativa e espaço de coworking onde
                mais de uma dezena de marcas autorais dividem um ponto físico nobre, oferecendo biojóias,
                velas aromáticas, costura criativa, bordados e cerâmicas botânicas exclusivas.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalogo"
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  Ver Catálogo Físico
                </a>

                <a
                  href="#marcas"
                  className="px-6 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Conhecer as Marcas
                </a>

                <button
                  onClick={() => setActiveView('pdv')}
                  className="px-4 py-3 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold text-sm transition-colors cursor-pointer border border-rose-200 flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  Balcão PDV
                </button>
              </div>

              {/* Badges / Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-xs text-stone-600">
                <div>
                  <div className="font-bold text-stone-900 text-lg">100%</div>
                  <div>Autoral & Feito à Mão</div>
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-lg">13+</div>
                  <div>Ateliês Maranhenses</div>
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-lg">Diário</div>
                  <div>Plantão com Artesãos</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80"
                  alt="Espaço Pinta e Borda no Rio Anil Shopping"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                    Rio Anil Shopping • Piso 1
                  </span>
                  <h3 className="font-serif-display text-xl font-bold">
                    Visite nossa loja física ou converse direto com os artesãos no WhatsApp
                  </h3>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-xl p-3.5 shadow-xl border border-stone-200 flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">Economia Criativa Viva</div>
                  <div className="text-stone-500">Compre direto de quem cria com afeto.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Showcase Section (PRD Section 2 e 8.2) */}
      <section id="marcas" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              As Marcas do Pinta e Borda
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3">
              Cada ateliê possui identidade própria e um artesão dedicado. Conheça quem dá vida ao nosso espaço colaborativo.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#FAF8F5] rounded-xl p-4 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={partner.brandLogo}
                      alt={partner.brandName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h4 className="font-serif-display font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors">
                        {partner.brandName}
                      </h4>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {partner.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                    {partner.brandDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">{partner.ownerName}</span>
                  <a
                    href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1!%20Conheci%20a%20${encodeURIComponent(partner.brandName)}%20pelo%20Pinta%20e%20Borda.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Contato
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Catalog Section (PRD Section 8.3 & 8.4) */}
      <section id="catalogo" className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wide uppercase text-amber-800">
                Pronta Entrega no Shopping
              </span>
              <h2 className="font-serif-display text-3xl font-bold text-stone-900 mt-1">
                Catálogo Físico da Loja
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Veja o que está exposto no Rio Anil Shopping e converse direto com o artesão responsável no WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <span>{filteredProducts.length} itens encontrados</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs mb-8 space-y-4">
            {/* Search Input and Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produto, marca ou SKU..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Partner Filter */}
              <div>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                >
                  <option value="all">Todas as Marcas Autorais</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Order */}
              <div>
                <select
                  value={priceOrder}
                  onChange={(e) => setPriceOrder(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                >
                  <option value="default">Ordenar: Padrão</option>
                  <option value="asc">Menor Preço</option>
                  <option value="desc">Maior Preço</option>
                </select>
              </div>
            </div>

            {/* Quick check pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                  inStockOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                ✓ Em estoque na loja física
              </button>

              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                  featuredOnly
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                ★ Apenas Destaques do Ateliê
              </button>

              {(searchQuery || selectedCategory !== 'all' || selectedPartner !== 'all' || inStockOnly || featuredOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPartner('all');
                    setInStockOnly(false);
                    setFeaturedOnly(false);
                    setPriceOrder('default');
                  }}
                  className="text-amber-800 hover:underline ml-auto font-medium cursor-pointer"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const partner = partners.find((p) => p.id === prod.partnerId);
                return (
                  <div
                    key={prod.id}
                    onClick={() => setActiveModalProduct(prod)}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Stock badge */}
                      <div className="absolute top-2.5 right-2.5">
                        {prod.stock > 0 ? (
                          <span className="bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            {prod.stock} un. em loja
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-200 shadow-xs">
                            Sob Encomenda
                          </span>
                        )}
                      </div>

                      {prod.isFeatured && (
                        <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          Destaque
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        {partner && (
                          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider mb-1">
                            {partner.brandName}
                          </div>
                        )}
                        <h4 className="font-serif-display font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors line-clamp-2">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-stone-400 block leading-none">Preço</span>
                          <span className="text-base font-bold text-stone-900">
                            R$ {prod.price.toFixed(2)}
                          </span>
                        </div>

                        <span className="text-xs text-emerald-700 group-hover:text-emerald-800 font-semibold flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          Consultar
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif-display text-lg font-bold text-stone-800">
                Nenhum produto encontrado com os filtros atuais
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Tente buscar por outro termo ou remover filtros para ver mais peças artesanais.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section: Coworking & Loja Colaborativa */}
      <section id="sobre" className="py-16 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
                O Conceito Pinta e Borda
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Mais do que uma vitrine: um modelo cooperativo de sustentabilidade artesanal.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Manter uma loja própria em shopping center é um desafio para artesãos individuais. O
                <strong> Pinta e Borda</strong> resolve isso através do compartilhamento de custos:
                cada marca possui seu espaço físico dedicado, e todos os artesãos se revezam em
                escalas de plantão, atendendo clientes e operando as vendas de forma coletiva.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-sm">Estoque Compartilhado:</strong>
                    <span className="text-stone-300 text-xs block">
                      Cada peça possui código SKU exclusivo vinculado ao seu criador.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-sm">Escala de Plantão Solidária:</strong>
                    <span className="text-stone-300 text-xs block">
                      Quem está no balcão vende as peças de todas as marcas com carinho e conhecimento autoral.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-sm">Transparência Financeira:</strong>
                    <span className="text-stone-300 text-xs block">
                      Repasses automáticos com cálculo de taxas congeladas e prestação de contas auditável.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 sm:p-8 border border-stone-700 space-y-6">
              <h3 className="font-serif-display text-xl font-bold text-amber-300">
                Quer expor no Pinta e Borda?
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Se você produz artesanato autoral no Maranhão e busca um espaço físico estruturado no
                Rio Anil Shopping, junte-se ao nosso coworking. Trabalhamos com contrato transparente:
                mensalidade fixa, rateio proporcional de taxas e escala de atendimento.
              </p>

              <div className="p-4 bg-stone-900/60 rounded-xl border border-stone-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Modelo:</span>
                  <span className="text-white font-semibold">Coworking + Loja Colaborativa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Ponto:</span>
                  <span className="text-white font-semibold">Rio Anil Shopping (Piso 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Vendas:</span>
                  <span className="text-white font-semibold">PDV Balcão + WhatsApp Direto</span>
                </div>
              </div>

              <a
                href="https://wa.me/5598981234567?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20como%20expor%20minha%20marca%20no%20Pinta%20e%20Borda."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Falar com a Coordenação da Loja
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section (PRD Section 8.2) */}
      <section id="localizacao" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-stone-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-semibold uppercase text-amber-800">
                Venha nos visitar
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
                Pinta e Borda no Rio Anil Shopping
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
                Estamos localizados no Piso 1 do Rio Anil Shopping, em São Luís/MA, oferecendo uma experiência
                acolhedora onde você pode sentir as texturas, testar aromas e conhecer pessoalmente os criadores das peças.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Endereço:</strong>
                    <div className="text-stone-600">
                      Av. São Luís Rei de França, 8 - Turu, São Luís - MA, 65065-470
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Horário de Funcionamento:</strong>
                    <div className="text-stone-600">
                      Segunda a Sábado: 10h às 22h<br />
                      Domingos e Feriados: 13h às 21h
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="font-serif-display font-bold text-stone-900">
                Área Restrita de Gestão
              </h4>
              <p className="text-xs text-stone-500">
                Espaço exclusivo para artesãos e administradores operarem o balcão, gerenciarem expedientes e consultarem repasses.
              </p>
              <button
                onClick={() => {
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Acessar Painel do Artesão / PDV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif-display font-bold text-xs">
              P&B
            </div>
            <span className="text-stone-200 font-semibold font-serif-display text-sm">
              Pinta e Borda
            </span>
            <span>• Coworking & Loja Colaborativa de Artesanato</span>
          </div>

          <div className="text-center sm:text-right">
            <div>Rio Anil Shopping, São Luís/MA • Versão 2.0</div>
            <div className="text-stone-600 mt-0.5">Plataforma Digital de Operação Compartilhada</div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        partner={activePartnerForModal}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
};
