import React, { useState, useMemo } from 'react';
import {
  Heart,
  Store,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Instagram,
  ArrowRight,
  ShoppingBag,
  Users,
  CheckCircle2,
  Share2,
  MessageCircle,
  UserPlus,
  Search,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VolunteerRegistrationModal } from './VolunteerRegistrationModal';
import { ProductDetailModal } from './ProductDetailModal';
import { Product } from '../../types';
import { handleImageError, FALLBACK_PRODUCT_IMAGE, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

// The 14 official partner brands of Pinta e Borda
export const BRANDS_DOSSIE = [
  {
    id: 'ditodacor',
    number: '01',
    symbol: '✺',
    name: 'Di Toda Cor',
    founder: 'Keka (Fundadora do Coletivo)',
    segment: 'Arte Regional & Azulejaria',
    categoryGroup: 'decor',
    categoryName: 'Arte & Decor',
    phone: '(98) 98828-9123',
    whatsapp: '5598988289123',
    instagram: '@ditodacor',
    tag: 'Curadoria & Fundação',
    desc: 'Azulejos maranhenses esmaltados à mão, ímãs decorativos, canecas afetivas e oratórios coloridos inspirados na tradição luso-maranhense de São Luís.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'armonizzare',
    number: '02',
    symbol: '⌁',
    name: 'Armonizzare Aromas',
    founder: 'Eliane Rocha',
    segment: 'Aromas & Velas Vegetais',
    categoryGroup: 'aromas',
    categoryName: 'Casa & Bem-estar',
    phone: '(98) 98114-1422',
    whatsapp: '5598981141422',
    instagram: '@armonizzarearomas',
    tag: 'Aromaterapia',
    desc: 'Velas aromáticas em cera vegetal de coco, difusores de varetas e home sprays com fragrâncias reconfortantes de alecrim silvestre, flor de cerejeira e bergamota.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'bordandomomentos',
    number: '03',
    symbol: '◌',
    name: 'Bordando Momentos',
    founder: 'Arlete Ferreira',
    segment: 'Bordado Livre & Bastidores',
    categoryGroup: 'decor',
    categoryName: 'Arte & Decor',
    phone: '(98) 98177-8321',
    whatsapp: '5598981778321',
    instagram: '@bordandomomentos.slz',
    tag: 'Bordado Manual',
    desc: 'Bastidores decorativos com pontos livres, almofadas bordadas com poesia maranhense e toalhas personalizadas celebrando memórias de afeto.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'pikenabiojoias',
    number: '04',
    symbol: '✦',
    name: 'Pikena Biojóias',
    founder: 'Marilene Santos',
    segment: 'Capim Dourado & Sementes',
    categoryGroup: 'acessorios',
    categoryName: 'Acessórios',
    phone: '(98) 99219-6969',
    whatsapp: '5598992196969',
    instagram: '@pikenabiojoias',
    tag: 'Ouro Vegetal',
    desc: 'Gargantilhas, colares e brincos confeccionados em capim dourado e sementes nobres do cerrado e da Amazônia maranhense com acabamento nobre.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'donasdomundo',
    number: '05',
    symbol: '✿',
    name: 'Donas do Mundo',
    founder: 'Cláudia Regina',
    segment: 'Costura Criativa & Ecobags',
    categoryGroup: 'moda',
    categoryName: 'Moda autoral',
    phone: '(98) 98845-6677',
    whatsapp: '5598988456677',
    instagram: '@donasdomundo.atelie',
    tag: 'Costura Criativa',
    desc: 'Ecobags de lona resistente, nécessaires impermeáveis, mochilas estampadas e carteiras práticas para o cotidiano urbano da mulher moderna.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'pretachic',
    number: '06',
    symbol: '⬡',
    name: 'Preta Chic',
    founder: 'Josy Santos',
    segment: 'Acessórios & Cerâmica Plástica',
    categoryGroup: 'acessorios',
    categoryName: 'Acessórios',
    phone: '(98) 97016-5274',
    whatsapp: '5598970165274',
    instagram: '@pretachicprodutos',
    tag: 'Design Afirmativo',
    desc: 'Maxi brincos botânicos inspirados no tinhorão, peças geométricas em cerâmica plástica e acessórios afirmativos com identidade afro-maranhense.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'sereiaatelie',
    number: '07',
    symbol: '✺',
    name: 'Sereia Ateliê',
    founder: 'Renata Castro',
    segment: 'Encadernação Manual & Papelaria',
    categoryGroup: 'decor',
    categoryName: 'Arte & Decor',
    phone: '(98) 98573-8538',
    whatsapp: '5598985738538',
    instagram: '@sereia.atellie',
    tag: 'Papelaria Afetiva',
    desc: 'Cadernos artesanais costurados na lombada com linha de algodão, planners não-datados e cartões em papel kraft para eternizar momentos.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'tutabel',
    number: '08',
    symbol: '◌',
    name: 'Tuta Belô Criações',
    founder: 'Yara Mendes',
    segment: 'Moda Autoral & Patchwork',
    categoryGroup: 'moda',
    categoryName: 'Moda autoral',
    phone: '(98) 98446-5330',
    whatsapp: '5598984465330',
    instagram: '@tuta_bel',
    tag: 'Moda Autoral',
    desc: 'Vestidos fluidos em viscose com estampas tropicais, peças em chita estilizada e nécessaires em patchwork colorido que respiram São Luís.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'artetemperos',
    number: '09',
    symbol: '✦',
    name: 'Arte & Temperos',
    founder: 'Dona Socorro',
    segment: 'Gourmet Artesanal & Geleias',
    categoryGroup: 'gourmet',
    categoryName: 'Gourmet',
    phone: '(98) 98711-2233',
    whatsapp: '5598987112233',
    instagram: '@arteetemperos.slz',
    tag: 'Sabores do Maranhão',
    desc: 'Geleias artesanais de pimenta de cheiro com maracujá, molhos agridoces regionais e licores caseiros preparados com frutas nativas.',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'madreartemis',
    number: '10',
    symbol: '✿',
    name: 'Madre Artemis',
    founder: 'Talita Pinheiro',
    segment: 'Cosmética Natural & Saboaria',
    categoryGroup: 'aromas',
    categoryName: 'Casa & Bem-estar',
    phone: '(98) 98234-5566',
    whatsapp: '5598982345566',
    instagram: '@madreartemis',
    tag: 'Biocosméticos',
    desc: 'Sabonetes 100% vegetais saponificados a frio com argilas maranhenses, óleo de babaçu puro e óleos essenciais terapêuticos.',
    image: 'https://images.unsplash.com/photo-1607006314640-1a7c505872c6?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'mishisaike',
    number: '11',
    symbol: '⬡',
    name: 'Mishi Saike',
    founder: 'Michele Sayuri',
    segment: 'Cerâmica & Kokedamas',
    categoryGroup: 'decor',
    categoryName: 'Arte & Decor',
    phone: '(98) 98412-9900',
    whatsapp: '5598984129900',
    instagram: '@mishi.saike',
    tag: 'Design Botânico',
    desc: 'Kokedamas japonesas com plantas tropicais e vasos cerâmicos modelados no torno com esmaltes minerais formulados no ateliê.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'vooa',
    number: '12',
    symbol: '✺',
    name: 'Vooa',
    founder: 'Camila Alencar',
    segment: 'Óculos & Design Solar',
    categoryGroup: 'acessorios',
    categoryName: 'Acessórios',
    phone: '(98) 98163-9234',
    whatsapp: '5598981639234',
    instagram: '@use.vooa',
    tag: 'Design Solar',
    desc: 'Óculos solares de design contemporâneo com armações em acetato italiano e proteção UV total para viver o sol do Maranhão.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'bijuqueira',
    number: '13',
    symbol: '◌',
    name: 'Bijuqueira',
    founder: 'Luciana Farias',
    segment: 'Miçangas & Acessórios Praianos',
    categoryGroup: 'acessorios',
    categoryName: 'Acessórios',
    phone: '(98) 98122-3344',
    whatsapp: '5598981223344',
    instagram: '@bijuqueira.slz',
    tag: 'Vibe Solar',
    desc: 'Colares de miçangas de vidro coloridas, tornozeleiras com búzios naturais e chokers inspirados no litoral e na maresia da Ilha.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'coisasdakekel',
    number: '14',
    symbol: '✦',
    name: 'Coisas da Kekel',
    founder: 'Raquel Diniz',
    segment: 'Crochê Moderno & Fio de Malha',
    categoryGroup: 'decor',
    categoryName: 'Arte & Decor',
    phone: '(98) 98311-5522',
    whatsapp: '5598983115522',
    instagram: '@coisasdakekel',
    tag: 'Crochê Afetivo',
    desc: 'Cestos organizadores em fio de malha ecológico, porta-copos artesanais e clutches em crochê com texturas ricas e tons terrosos.',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=700&auto=format&fit=crop&q=80',
  },
];

export const LandingPage: React.FC<{
  onOpenAuth: () => void;
  onOpenPresentation?: () => void;
}> = ({ onOpenAuth, onOpenPresentation }) => {
  const { setActiveView, products, partners } = useApp();

  // Category filter for the catalog section
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Category filter for the brands section
  const [brandCategoryFilter, setBrandCategoryFilter] = useState('ALL');

  // Selected brand for slide-in drawer
  const [selectedBrandDrawer, setSelectedBrandDrawer] = useState<typeof BRANDS_DOSSIE[0] | null>(null);

  // Selected product for detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Volunteer Modal
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  // Favorites state for catalog products
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Filter products for the catalog section
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        (selectedCategory === 'acessorios' && p.category.toLowerCase().includes('acess')) ||
        (selectedCategory === 'aromas' && (p.category.toLowerCase().includes('aroma') || p.category.toLowerCase().includes('bem'))) ||
        (selectedCategory === 'moda' && p.category.toLowerCase().includes('moda')) ||
        (selectedCategory === 'decor' && (p.category.toLowerCase().includes('decor') || p.category.toLowerCase().includes('arte'))) ||
        (selectedCategory === 'gourmet' && p.category.toLowerCase().includes('gourmet'));

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Filter brands for the "Marcas com alma" section
  const filteredBrands = useMemo(() => {
    if (brandCategoryFilter === 'ALL') return BRANDS_DOSSIE;
    return BRANDS_DOSSIE.filter((b) => b.categoryGroup === brandCategoryFilter);
  }, [brandCategoryFilter]);

  const selectedProductPartner = useMemo(() => {
    if (!selectedProduct) return null;
    return partners.find((p) => p.id === selectedProduct.partnerId) || null;
  }, [selectedProduct, partners]);

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#380c25]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-[#fce7f3] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-mono-craft uppercase tracking-[0.22em] text-[#f43f7e] font-medium">
                <span className="w-7 h-[1.5px] bg-[#f43f7e]" />
                <span>Feito à mão, feito com intenção</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-[68px] leading-[1.08] text-[#380c25] font-medium tracking-tight">
                Onde o feito à mão{' '}
                <em className="font-normal italic text-[#f43f7e]">encontra</em>{' '}
                novas histórias.
              </h1>

              {/* Sub-paragraph */}
              <p className="text-base sm:text-lg text-[#6d244c] leading-relaxed max-w-xl font-light">
                Uma casa colaborativa em São Luís que reúne marcas autorais, encontros afetivos e
                peças que carregam o tempo, o cuidado e a identidade de quem cria.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalogo"
                  className="solid-button large flex items-center gap-2"
                >
                  <span>Conheça o catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#marcas"
                  className="outline-button large"
                >
                  Ver marcas da casa
                </a>

                <button
                  onClick={() => setIsVolunteerModalOpen(true)}
                  className="outline-button large !border-dashed text-[#f43f7e] hover:text-[#380c25]"
                >
                  Quero expor / Apoiar
                </button>
              </div>

              {/* Maker Avatar Stack */}
              <div className="pt-4 flex items-center gap-4 border-t border-[#fce7f3] max-w-md">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-[#fff5f8] object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="Keka"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-[#fff5f8] object-cover"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                    alt="Artesã"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-[#fff5f8] object-cover"
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
                    alt="Artesã"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                  />
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-[#fff5f8] bg-[#ffe4ee] text-[#be185d] text-xs font-mono-craft font-bold">
                    +14
                  </div>
                </div>
                <div className="text-xs font-mono-craft text-[#6d244c] leading-tight">
                  <strong className="block text-[#380c25] font-semibold">14 ateliês independentes</strong>
                  em um só endereço compartilhado
                </div>
              </div>
            </div>

            {/* Right Architectural Hero Art Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="hero-art w-full max-w-[420px] aspect-[4/5] relative">
                {/* Architectural arch background photo */}
                <div className="photo-shape w-full h-full relative overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                    alt="Ateliê Pinta e Borda"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#420f2c]/90 via-[#420f2c]/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-[#ffffff]">
                    <span className="text-[10px] font-mono-craft uppercase tracking-[0.22em] text-[#ff7597] font-semibold block mb-1">
                      Rio Anil Shopping · Piso 2
                    </span>
                    <h3 className="font-display text-2xl font-medium leading-tight">
                      Acolhimento, arte e autonomia feminina.
                    </h3>
                  </div>
                </div>

                {/* Sun disk element */}
                <div className="art-sun" />

                {/* Floating terracotta craft badge */}
                <div className="card-one text-[#ffffff]">
                  <span className="text-[9px] font-mono-craft uppercase tracking-[0.2em] text-[#fdf0f4] block">
                    Curadoria
                  </span>
                  <div className="font-display text-lg leading-tight font-medium">
                    feito à mão
                  </div>
                  <span className="text-[10px] text-[#fdf0f4]/90 font-mono-craft block mt-1">
                    com afeto maranhense
                  </span>
                </div>

                {/* Floating card two */}
                <div className="card-two">
                  <div className="text-xs font-mono-craft text-[#be185d] uppercase font-bold tracking-wider">
                    Casa Colaborativa
                  </div>
                  <div className="font-display text-sm font-medium text-[#380c25]">
                    São Luís · Maranhão
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TICKER / BRAND RIBBON */}
      <div className="bg-[#fff0f5] border-b border-[#fce7f3] py-3.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
          <span className="text-[10px] font-mono-craft uppercase tracking-[0.25em] text-[#be185d] font-bold shrink-0">
            Criações que têm história ·
          </span>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-mono-craft text-[#6d244c]">
            {BRANDS_DOSSIE.map((brand, idx) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandDrawer(brand)}
                className="hover:text-[#f43f7e] transition-colors cursor-pointer flex items-center gap-2 shrink-0"
              >
                <span className="text-[#f43f7e]">{brand.symbol}</span>
                <span className="font-medium text-[#380c25]">{brand.name}</span>
                {idx < BRANDS_DOSSIE.length - 1 && (
                  <span className="text-[#f9a8d4] font-light">·</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SECTION "O ESPAÇO" (#sobre) */}
      <section id="sobre" className="py-20 sm:py-28 border-b border-[#fbcfe8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left architectural photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-[4/5]">
                <div className="photo-shape w-full h-full relative overflow-hidden shadow-xl border border-[#fbcfe8]">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80"
                    alt="Espaço Pinta e Borda"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                  />
                  <div className="absolute inset-0 bg-[#380c25]/20" />
                </div>
                <div className="card-two !bottom-6 !-left-4 !top-auto">
                  <div className="text-[9px] font-mono-craft text-[#f43f7e] uppercase tracking-[0.2em]">
                    Manifesto
                  </div>
                  <div className="font-display text-base font-medium text-[#380c25] italic">
                    "Um lugar para criar, partilhar e viver de arte."
                  </div>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <div className="text-xs font-mono-craft uppercase tracking-[0.2em] text-[#f43f7e] font-medium">
                  01 · O espaço & o coletivo
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#380c25] leading-tight">
                  Mais que uma loja.{' '}
                  <span className="italic text-[#f43f7e]">Um ponto de encontro.</span>
                </h2>
              </div>

              <div className="space-y-4 text-base text-[#863b63] leading-relaxed font-light">
                <p>
                  O <strong>Pinta e Borda</strong> nasceu em 2008 pelas mãos da artista plástica e artesã <strong>Keka (@ditodacor)</strong> como um projeto social itinerante. Com o tempo, transformou-se na primeira casa colaborativa em shopping center voltada exclusivamente ao artesanato autoral do Maranhão.
                </p>
                <p>
                  Aqui operamos sob a lógica de <strong>coworking artesanal</strong>: compartilhamento de nichos físicos, divisão mútua de custos de locação, e rodízio colaborativo no balcão de vendas.
                </p>
                <p>
                  <strong>Sem atravessadores:</strong> 90% do valor de cada peça vai direto para a artesã criadora, enquanto 10% sustenta a manutenção coletiva do espaço e as ações solidárias do projeto.
                </p>
              </div>

              {/* 3 Coworking Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#fff0f5]/70 border border-[#fbcfe8] space-y-2">
                  <div className="font-mono-craft text-xs text-[#f43f7e] font-bold">01</div>
                  <h4 className="font-display text-lg font-medium text-[#380c25]">
                    Coworking Criativo
                  </h4>
                  <p className="text-xs text-[#863b63] leading-relaxed">
                    Nichos personalizados onde cada ateliê expõe sua identidade de forma profissional.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#fff0f5]/70 border border-[#fbcfe8] space-y-2">
                  <div className="font-mono-craft text-xs text-[#f43f7e] font-bold">02</div>
                  <h4 className="font-display text-lg font-medium text-[#380c25]">
                    Escala Cooperativa
                  </h4>
                  <p className="text-xs text-[#863b63] leading-relaxed">
                    Plantonistas treinadas que atendem e vendem produtos de todas as colegas com mesmo carinho.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#fff0f5]/70 border border-[#fbcfe8] space-y-2">
                  <div className="font-mono-craft text-xs text-[#f43f7e] font-bold">03</div>
                  <h4 className="font-display text-lg font-medium text-[#380c25]">
                    Split Transparente
                  </h4>
                  <p className="text-xs text-[#863b63] leading-relaxed">
                    Fechamento quinzenal automatizado com extrato detalhado por Pix e zero retenções ocultas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION "CATÁLOGO DA CASA" (#catalogo) */}
      <section id="catalogo" className="py-20 sm:py-28 border-b border-[#fbcfe8] bg-[#fff8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs font-mono-craft uppercase tracking-[0.2em] text-[#f43f7e] font-medium">
                02 · Catálogo da casa
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#380c25]">
                Feito para levar para a vida.
              </h2>
              <p className="text-sm sm:text-base text-[#6d244c] max-w-lg font-light">
                Peças exclusivas disponíveis para pronta entrega na loja física do Rio Anil Shopping ou sob encomenda direta com a artesã.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Buscar por peça ou ateliê..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#fce7f3] bg-[#ffffff] text-xs font-mono-craft text-[#380c25] placeholder-[#7a9186] focus:outline-none focus:border-[#f43f7e] focus:ring-1 focus:ring-[#f43f7e]/20 shadow-xs"
              />
              <Search className="w-4 h-4 text-[#7a9186] absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'ALL', label: 'Todos os produtos' },
              { id: 'acessorios', label: 'Acessórios & Biojóias' },
              { id: 'aromas', label: 'Casa & Bem-estar' },
              { id: 'moda', label: 'Moda autoral' },
              { id: 'decor', label: 'Arte & Azulejaria' },
              { id: 'gourmet', label: 'Gourmet regional' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono-craft whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#420f2c] text-[#ffffff] font-medium shadow-xs'
                    : 'bg-[#fff0f5] text-[#6d244c] hover:bg-[#fce7f3] hover:text-[#380c25]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const isFav = favorites[product.id];
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="craft-card group cursor-pointer p-4 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Artwork Container */}
                    <div className="w-full aspect-[4/4.5] rounded-2xl bg-[#ffe4ee] relative overflow-hidden mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Heart button */}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-[#f43f7e] text-white shadow-xs'
                            : 'bg-white/85 text-[#6d244c] hover:text-[#f43f7e]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      {/* Featured badge */}
                      {product.isFeatured && (
                        <div className="absolute bottom-3 left-3 bg-[#420f2c]/90 text-[#ff7597] text-[10px] font-mono-craft px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#ff7597]" />
                          Destaque
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono-craft uppercase tracking-wider text-[#f43f7e] font-medium truncate">
                        {product.partnerName}
                      </div>
                      <h3 className="font-display text-lg font-medium text-[#380c25] group-hover:text-[#f43f7e] transition-colors leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 mt-2 border-t border-[#fce7f3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono-craft text-[#7a9186] block">Preço</span>
                      <span className="font-mono-craft font-bold text-lg text-[#380c25]">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <span className="text-xs font-mono-craft font-semibold text-[#f43f7e] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Catalog Callout */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setActiveView('store')}
              className="solid-forest-button large inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#ff7597]" />
              <span>Acessar vitrine digital completa ({products.length} peças)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. SECTION "MARCAS COM ALMA" (#marcas) - Botanical Forest Green */}
      <section id="marcas" className="py-20 sm:py-28 bg-[#420f2c] text-[#ffffff] border-b border-[#2a071b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs font-mono-craft uppercase tracking-[0.25em] text-[#ff7597] font-semibold">
                03 · Quem faz acontecer
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#ffffff]">
                Marcas com alma.
              </h2>
              <p className="text-sm sm:text-base text-[#c9d9d0] max-w-xl font-light">
                Conheça as artesãs, designers e empreendedoras que tecem a identidade cultural da nossa casa.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'decor', label: 'Arte & Decor' },
                { id: 'acessorios', label: 'Acessórios' },
                { id: 'aromas', label: 'Aromas' },
                { id: 'moda', label: 'Moda' },
                { id: 'gourmet', label: 'Gourmet' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBrandCategoryFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono-craft transition-all cursor-pointer ${
                    brandCategoryFilter === f.id
                      ? 'bg-[#ff7597] text-[#420f2c] font-bold shadow-xs'
                      : 'bg-[#501535] text-[#c9d9d0] hover:bg-[#2d5246] hover:text-[#ffffff]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => setSelectedBrandDrawer(brand)}
                className="bg-[#501535]/70 hover:bg-[#501535] rounded-3xl p-6 border border-[#501535] hover:border-[#ff7597] transition-all cursor-pointer group flex flex-col justify-between space-y-6 shadow-sm hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-craft text-[#ff7597] pb-4 border-b border-[#501535]">
                    <span className="font-semibold">{brand.number}</span>
                    <span className="text-lg">{brand.symbol}</span>
                    <span className="text-[10px] tracking-widest uppercase bg-[#2a071b] px-2.5 py-0.5 rounded-full text-[#c9d9d0]">
                      {brand.categoryName}
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="font-display text-2xl font-medium text-[#ffffff] group-hover:text-[#ff7597] transition-colors">
                      {brand.name}
                    </h3>
                    <p className="text-xs font-mono-craft text-[#9ebfb0]">
                      {brand.segment} · por {brand.founder}
                    </p>
                    <p className="text-xs text-[#ebdce2] leading-relaxed pt-2 line-clamp-3 font-light">
                      {brand.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#501535] text-xs font-mono-craft text-[#ff7597]">
                  <span>{brand.instagram}</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[#ffffff] group-hover:text-[#ff7597]">
                    Conhecer ateliê →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION "VISITE A CASA" (#visite) */}
      <section id="visite" className="py-20 sm:py-28 border-b border-[#fbcfe8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono-craft uppercase tracking-[0.2em] text-[#f43f7e] font-medium">
                04 · Visite a casa
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#380c25] leading-tight">
                Venha tomar um café conosco.
              </h2>
              <p className="text-base text-[#863b63] leading-relaxed font-light">
                Estamos de portas abertas todos os dias no Rio Anil Shopping, reunindo o melhor da produção artesanal maranhense com acolhimento e afeto.
              </p>

              <div className="space-y-4 pt-4 text-sm">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fff0f5]/60 border border-[#fbcfe8]">
                  <MapPin className="w-5 h-5 text-[#f43f7e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#380c25] font-semibold">Endereço</strong>
                    <span className="text-[#863b63] text-xs leading-relaxed block">
                      Rio Anil Shopping, Piso 2 (em frente à Loja Marisa)
                      <br />
                      Avenida São Luís Rei de França, Turu — São Luís / MA
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fff0f5]/60 border border-[#fbcfe8]">
                  <Clock className="w-5 h-5 text-[#f43f7e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#380c25] font-semibold">Horários de Funcionamento</strong>
                    <span className="text-[#863b63] text-xs leading-relaxed block">
                      Segunda a Sábado: 10h às 22h
                      <br />
                      Domingos e Feriados: 14h às 20h
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fff0f5]/60 border border-[#fbcfe8]">
                  <Phone className="w-5 h-5 text-[#f43f7e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#380c25] font-semibold">Contato & Curadoria</strong>
                    <span className="text-[#863b63] text-xs leading-relaxed block">
                      WhatsApp: (98) 98828-9123 (Keka)
                      <br />
                      Instagram: @ditodacor · @pintaeborda
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5598988289123?text=Ol%C3%A1%2C%20Keka!%20Gostaria%20de%20visitar%20a%20Casa%20Pinta%20e%20Borda."
                  target="_blank"
                  rel="noreferrer"
                  className="solid-button text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar no WhatsApp com a Keka</span>
                </a>

                <button
                  onClick={() => setIsVolunteerModalOpen(true)}
                  className="outline-button text-sm"
                >
                  <UserPlus className="w-4 h-4 text-[#f43f7e]" />
                  <span>Cadastrar Ateliê / Voluntariado</span>
                </button>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[440px] rounded-3xl p-8 bg-[#380c25] text-[#ffffff] border border-[#5c1a3e] space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#ff7597]/10 blur-2xl pointer-events-none" />

                <div className="brand-mark text-[#ff7597]">
                  <span>p</span>
                  <span>b</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono-craft tracking-[0.2em] uppercase text-[#ff7597]">
                    Casa Colaborativa
                  </div>
                  <h3 className="font-display text-3xl font-medium leading-tight">
                    "Levando a vida com arte e solidariedade."
                  </h3>
                </div>

                <p className="text-xs text-[#a9c2b4] leading-relaxed font-light">
                  Fundado em 2008 sem qualquer vínculo estatal ou partidário, o projeto é mantido pelo afeto e dedicação de dezenas de mulheres maranhenses que acreditam no poder transformador do artesanato autoral.
                </p>

                <div className="pt-4 border-t border-[#5c1a3e] flex items-center justify-between text-xs font-mono-craft text-[#ff7597]">
                  <span>São Luís · Maranhão</span>
                  <span>Desde 2008</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-[#fff0f5] border-t border-[#fbcfe8] text-[#863b63] text-xs font-mono-craft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="brand-mark text-[#380c25]">
              <span>p</span>
              <span>b</span>
            </div>
            <div>
              <div className="font-display text-base font-medium text-[#380c25]">
                pinta <em className="italic font-normal text-[#f43f7e]">e</em> borda
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#f43f7e]">
                casa colaborativa · são luís / ma
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <a href="#sobre" className="hover:text-[#f43f7e] transition-colors">
              O espaço
            </a>
            <a href="#marcas" className="hover:text-[#f43f7e] transition-colors">
              Marcas
            </a>
            <a href="#catalogo" className="hover:text-[#f43f7e] transition-colors">
              Catálogo
            </a>
            <a href="#visite" className="hover:text-[#f43f7e] transition-colors">
              Visite
            </a>
            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="text-[#f43f7e] font-bold hover:underline cursor-pointer"
              >
                Dossiê
              </button>
            )}
            <button
              onClick={() => setActiveView('artisan-portal')}
              className="text-[#1f4e38] font-bold hover:underline cursor-pointer"
            >
              Portal da Artesã
            </button>
          </div>

          <div className="text-[11px] text-[#9b4f76]">
            © {new Date().getFullYear()} Pinta e Borda · Feito à mão com afeto.
          </div>
        </div>
      </footer>

      {/* 8. SLIDE-IN BRAND DETAIL DRAWER (`brand-drawer`) */}
      {selectedBrandDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedBrandDrawer(null)}
            className="absolute inset-0 bg-[#380c25]/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#ffffff] border-l border-[#fbcfe8] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                {/* Header with Close */}
                <div className="flex items-center justify-between pb-4 border-b border-[#fbcfe8]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-[#f43f7e] font-mono-craft">
                      {selectedBrandDrawer.symbol}
                    </span>
                    <span className="text-xs font-mono-craft uppercase tracking-widest text-[#f43f7e]">
                      Ateliê {selectedBrandDrawer.number}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedBrandDrawer(null)}
                    className="p-2 rounded-full hover:bg-[#fff0f5] text-[#863b63] cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Brand Image & Header */}
                <div className="space-y-4">
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#fbcfe8]">
                    <img
                      src={selectedBrandDrawer.image}
                      alt={selectedBrandDrawer.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-3xl font-medium text-[#380c25]">
                      {selectedBrandDrawer.name}
                    </h3>
                    <p className="text-xs font-mono-craft text-[#f43f7e] mt-1">
                      {selectedBrandDrawer.segment}
                    </p>
                  </div>
                </div>

                {/* Founder Info */}
                <div className="p-4 rounded-2xl bg-[#fff0f5]/70 border border-[#fbcfe8] space-y-1">
                  <span className="text-[10px] font-mono-craft uppercase tracking-wider text-[#9b4f76] block">
                    Criadora responsável
                  </span>
                  <div className="font-display text-base font-medium text-[#380c25]">
                    {selectedBrandDrawer.founder}
                  </div>
                  <div className="text-xs font-mono-craft text-[#f43f7e]">
                    {selectedBrandDrawer.instagram}
                  </div>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono-craft uppercase tracking-wider text-[#9b4f76]">
                    Sobre a marca
                  </h4>
                  <p className="text-sm text-[#863b63] leading-relaxed font-light">
                    {selectedBrandDrawer.desc}
                  </p>
                </div>

                {/* Coworking presence badge */}
                <div className="p-3 bg-[#fbf3f5] rounded-xl border border-[#cbe0d3] text-[#380c25] flex items-center gap-2.5 text-xs">
                  <Store className="w-4 h-4 text-[#3c6b54] shrink-0" />
                  <div>
                    <strong className="block font-medium">Nicho ativo no Rio Anil Shopping</strong>
                    <span className="text-[11px] text-[#6a3f53]">
                      Peças disponíveis para pronta entrega na casa física.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#fbcfe8] space-y-3">
                <a
                  href={`https://wa.me/${selectedBrandDrawer.whatsapp}?text=${encodeURIComponent(
                    `Olá! Encontrei o ateliê ${selectedBrandDrawer.name} na vitrine do Pinta e Borda e gostaria de conhecer mais sobre suas peças!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="solid-button w-full !py-3 flex items-center justify-center gap-2 text-center text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp com o Ateliê</span>
                </a>

                <button
                  onClick={() => {
                    setSelectedBrandDrawer(null);
                    setActiveView('store');
                  }}
                  className="outline-button w-full !py-3 flex items-center justify-center gap-2 text-center text-xs font-mono-craft"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ver peças na Loja Virtual</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        partner={selectedProductPartner}
        onClose={() => setSelectedProduct(null)}
      />

      {/* 10. VOLUNTEER REGISTRATION MODAL */}
      <VolunteerRegistrationModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
    </div>
  );
};
