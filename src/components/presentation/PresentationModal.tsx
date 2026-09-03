import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Store,
  Users,
  Compass,
  MapPin,
  Phone,
  Mail,
  Instagram,
  ShoppingBag,
  Gift,
  HandHeart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Share2,
  ExternalLink,
  Calendar,
  Building2,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    id: 'capa',
    badge: 'Conexão Criativa e Colaborativa',
    title: 'Projeto Social Pinta e Borda',
    subtitle: 'Levando a vida com arte e solidariedade!',
    category: 'Apresentação Institucional',
  },
  {
    id: 'origem',
    badge: 'História & Fundação',
    title: 'Nossa Origem & Propósito',
    subtitle: 'Desde 2008 transformando realidades por meio do artesanato e do amor ao próximo',
    category: 'História',
  },
  {
    id: 'impacto-social',
    badge: 'Solidariedade em Ação',
    title: 'O Coração Social do Projeto',
    subtitle: 'Ações filantrópicas itinerantes realizadas por voluntários dedicados',
    category: 'Impacto Social',
  },
  {
    id: 'loja-colaborativa',
    badge: 'Espaço Físico & Coworking',
    title: 'A Loja Colaborativa no Rio Anil Shopping',
    subtitle: 'Ponto nobre de conexão entre artesãos maranhenses e o público consumidor',
    category: 'Loja Física',
  },
  {
    id: 'marcas',
    badge: 'Marcas Autorais',
    title: 'Nossos 14 Ateliês Parceiros',
    subtitle: 'Mulheres empreendedoras e talentos maranhenses reunidos sob o mesmo teto',
    category: 'Portfólio',
  },
  {
    id: 'b2b-parcerias',
    badge: 'Oportunidade para Empresas & Eventos',
    title: 'Leve o Pinta e Borda para o seu Negócio',
    subtitle: 'Exposições itinerantes, feiras corporativas e brindes afetivos com impacto ESG',
    category: 'Parcerias B2B',
  },
  {
    id: 'contato',
    badge: 'Curadoria & Atendimento',
    title: 'Canais Oficiais & Como Participar',
    subtitle: 'Conecte-se conosco e faça parte dessa rede que move São Luís',
    category: 'Contato',
  },
];

const BRANDS = [
  {
    name: 'Di Toda Cor',
    founder: 'Keka (Idealizadora do Projeto)',
    phone: '(98) 98828-9123',
    whatsapp: '5598988289123',
    instagram: '@ditodacor',
    category: 'Arte Regional & Azulejaria',
    desc: 'Feito à mão e com o coração em São Luís do Maranhão. Azulejaria típica, casinhas coloniais, ecobags e peças que celebram a cultura maranhense.',
    tag: 'Fundadora',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Arte & Temperos',
    founder: 'Produtos Naturais',
    phone: '(98) 98164-2890',
    whatsapp: '5598981642890',
    instagram: '@artetemperos_',
    category: 'Gastronomia & Temperos Naturais',
    desc: 'Azeites aromatizados, favos de mel puros, sais de ervas, colorau caseiro, cúrcuma pura e temperos artesanais especiais.',
    tag: 'Gourmet Natural',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Armonizzare',
    founder: 'Saboaria & Cosmética Botânica',
    phone: '(98) 98165-8835',
    whatsapp: '5598981658835',
    instagram: '@armonizzare.co',
    category: 'Aromas & Saboaria Natural',
    desc: 'Sabonetes artesanais com argila branca e lavanda, home sprays botânicos e cosméticos naturais que despertam bem-estar.',
    tag: 'Autocuidado',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bordando Momentos',
    founder: 'Bordado Livre & Afeto',
    phone: '(98) 99239-6896',
    whatsapp: '5598992396896',
    instagram: '@_bordandomomentos',
    category: 'Bordado Livre & Joias Afetivas',
    desc: 'Bastidores bordados personalizados de maternidade, relicários, colares bordados com girassol, lavanda e rosas feitos ponto a ponto.',
    tag: 'Memória Afetiva',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bijuqueira',
    founder: 'Miçangas & Cultura Maranhense',
    phone: '(98) 98909-8963',
    whatsapp: '5598989098963',
    instagram: '@bijuqueiraa',
    category: 'Biojoias & Acessórios Étnicos',
    desc: 'Brincos artesanais de arara em miçangas, colares com figuras do bumba-meu-boi e peças inspiradas nas cores da bandeira do Maranhão.',
    tag: 'Regional Autêntico',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coisas da Kekel',
    founder: 'Crochê Contemporâneo',
    phone: '(98) 98833-9771',
    whatsapp: '5598988339771',
    instagram: '@coisasdakekel',
    category: 'Crochê Criativo & Laços',
    desc: 'Bolsas estruturadas de crochê com alças de couro, laços delicados com acabamento em pérolas e peças artesanais para todas as ocasiões.',
    tag: 'Crochê Autoral',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Donas do Mundo',
    founder: 'Linha "Na Lua Cheia"',
    phone: '(98) 99118-0613',
    whatsapp: '5598991180613',
    instagram: '@donasdomundo02',
    category: 'Velas Aromáticas & Terapia',
    desc: 'Velas aromáticas com cera vegetal em potes de vidro com tampa de madeira, cristais energéticos, autocuidado feminino e poemas acolhedores.',
    tag: 'Velas Botânicas',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Madre Artemis',
    founder: 'Macramê & Cristais',
    phone: '(98) 99171-5912',
    whatsapp: '5598991715912',
    instagram: '@madre.artemis',
    category: 'Macramê & Joalheria Mística',
    desc: 'Colares em macramê com pedras naturais (pedra da lua, amazonita, quartzo solar), pulseiras energéticas e amuletos artesanais.',
    tag: 'Pedras Naturais',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mishi Saike',
    founder: 'Cerâmica Artesanal',
    phone: '(98) 99179-9343',
    whatsapp: '5598991799343',
    instagram: '@mishisaikeceramica',
    category: 'Cerâmica de Alta Temperatura',
    desc: 'Xícaras orgânicas, canecas esmaltadas em tons de terracota e azul cobalto, pratos rústicos e peças utilitárias exclusivas modeladas à mão.',
    tag: 'Cerâmica de Ateliê',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pikena Biojóias',
    founder: 'Biojóias & Capim Dourado',
    phone: '(98) 99219-6969',
    whatsapp: '5598992196969',
    instagram: '@pikenabiojoias',
    category: 'Joalheria Natural & Capim Dourado',
    desc: 'Gargantilhas, colares e brincos confeccionados em capim dourado e sementes nobres da Amazônia e cerrado maranhense com acabamento sofisticado.',
    tag: 'Ouro Vegetal',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Preta Chic',
    founder: 'Design Afirmativo',
    phone: '(98) 97016-5274',
    whatsapp: '5598970165274',
    instagram: '@pretachicprodutos',
    category: 'Acessórios Autorais & Cerâmica Plástica',
    desc: 'Maxi brincos botânicos inspirados na folhagem Tinhorão (Caladium), peças geométricas contemporâneas e acessórios com identidade afro e regional.',
    tag: 'Design Afirmativo',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sereia Ateliê',
    founder: 'Papelaria Afetiva',
    phone: '(98) 98573-8538',
    whatsapp: '5598985738538',
    instagram: '@sereia.atellie',
    category: 'Encadernação Manual & Memórias',
    desc: 'Cadernos artesanais costurados à mão ("Em eterna reconstrução"), capas em papel kraft, lettering inspirador e peças para registrar memórias afetivas.',
    tag: 'Papelaria Afetiva',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tuta Bel? Criações da Yara',
    founder: 'Yara (Moda Feminina Autoral)',
    phone: '(98) 98446-5330',
    whatsapp: '5598984465330',
    instagram: '@tuta_bel',
    category: 'Moda Autoral & Patchwork',
    desc: 'Vestidos fluidos em estampas florais tropicais, chita estilizada, nécessaires e bolsas em patchwork colorido celebrando a essência maranhense.',
    tag: 'Moda Autoral',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vooa',
    founder: 'Óculos & Acessórios Contemporâneos',
    phone: '(98) 98163-9234',
    whatsapp: '5598981639234',
    instagram: '@use.vooa',
    category: 'Óculos de Sol & Design Urbano',
    desc: 'Óculos solares de design moderno, armações esportivas e casuais com proteção UV para acompanhar a luminosidade de São Luís com muito estilo.',
    tag: 'Design Solar',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80',
  },
];

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#230716]/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#fff5f8] rounded-3xl max-w-5xl w-full shadow-2xl border border-[#fbcfe8] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Topbar */}
        <div className="px-6 py-4 bg-[#ffffff] border-b border-[#fbcfe8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#380c25] text-[#ffffff] flex items-center justify-center font-display font-medium text-sm border border-[#5c1a3e]">
              p b
            </div>
            <div>
              <span className="text-[10px] font-mono-craft text-[#db2777] uppercase block">
                Dossiê & Apresentação Institucional
              </span>
              <h3 className="font-display font-medium text-[#380c25] text-sm sm:text-base">
                Conexão Criativa e Colaborativa • Projeto Pinta e Borda
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-craft text-[#9b4f76] hidden sm:inline-block">
              Capítulo {currentSlideIndex + 1} de {SLIDES.length}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#fff0f5] hover:bg-[#fbcfe8] text-[#380c25] flex items-center justify-center transition-colors cursor-pointer border border-[#fbcfe8]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Selector Mini-Nav */}
        <div className="bg-[#fff0f5]/50 px-6 py-2 border-b border-[#fbcfe8] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 no-scrollbar">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(index)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-mono-craft transition-colors cursor-pointer ${
                index === currentSlideIndex
                  ? 'bg-[#380c25] text-[#ffffff] shadow-xs'
                  : 'text-[#863b63] hover:bg-[#fff0f5] hover:text-[#380c25]'
              }`}
            >
              {index + 1}. {slide.category}
            </button>
          ))}
        </div>

        {/* Slide Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Slide 0: Capa */}
          {currentSlide.id === 'capa' && (
            <div className="space-y-8 text-center max-w-3xl mx-auto py-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff0f5] text-[#380c25] text-xs font-mono-craft border border-[#fbcfe8]">
                <Sparkles className="w-3.5 h-3.5 text-[#f43f7e]" />
                Conexão Criativa e Colaborativa @projetopintaebordaslz
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#380c25] leading-tight">
                  Projeto Social <br />
                  <span className="text-[#f43f7e] italic">Pinta e Borda</span>
                </h1>
                <p className="font-display text-xl sm:text-2xl text-[#863b63] italic font-light">
                  "Levando a vida com arte e solidariedade!"
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#863b63] leading-relaxed max-w-2xl mx-auto font-light">
                Uma rede autônoma de empreendedorismo social que conecta mais de 14 marcas autorais de mulheres
                maranhenses, gerando autonomia econômica, geração de renda e sustentando ações voluntárias
                itinerantes em hospitais e comunidades em vulnerabilidade de São Luís.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#db2777] flex items-center justify-center font-bold mb-2">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-medium font-display text-sm text-[#380c25]">Fundado em 2008</h4>
                  <p className="text-[11px] text-[#863b63] mt-1 font-light">Criado pela artista Keka (@ditodacor) com base no afeto e na cooperação feminina.</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#380c25] flex items-center justify-center font-bold mb-2">
                    <Store className="w-4 h-4" />
                  </div>
                  <h4 className="font-medium font-display text-sm text-[#380c25]">Loja no Shopping</h4>
                  <p className="text-[11px] text-[#863b63] mt-1 font-light">Rio Anil Shopping (Piso 2, em frente à Marisa) com vitrine e balcão coletivo.</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#3c6b54] flex items-center justify-center font-bold mb-2">
                    <HandHeart className="w-4 h-4" />
                  </div>
                  <h4 className="font-medium font-display text-sm text-[#380c25]">100% Autônomo</h4>
                  <p className="text-[11px] text-[#863b63] mt-1 font-light">Sem dependência partidária ou governamental, sustentado por união e economia real.</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 1: Origem */}
          {currentSlide.id === 'origem' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                  {currentSlide.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">{currentSlide.subtitle}</p>
              </div>

              <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#fbcfe8] shadow-2xs space-y-4 text-xs sm:text-sm text-[#863b63] leading-relaxed font-light">
                <p>
                  O <strong className="text-[#380c25] font-medium">Projeto Pinta e Borda</strong> é um coletivo autônomo formado por voluntárias, em sua grande maioria
                  <strong className="text-[#380c25] font-medium"> mulheres artesãs e pequenas empreendedoras</strong>.
                </p>
                <p>
                  Criado em <strong className="text-[#380c25] font-medium">2008 pela artista Keka (@ditodacor)</strong>, foi carinhosamente abraçado por amigas e ateliês parceiros
                  no intuito de exercer o amor ao próximo através de ações solidárias realizadas de forma itinerante por toda a Ilha de São Luís.
                </p>
                <p>
                  A essência do projeto está firmemente pautada na solidariedade por meio do <strong className="text-[#380c25] font-medium">empreendedorismo social</strong>,
                  atuando como um acolhedor <strong className="text-[#380c25] font-medium">"guarda-chuva colaborativo"</strong> que capacita, fortalece e impulsiona pequenas marcas e ateliês.
                </p>

                <div className="p-4 bg-[#fff0f5]/70 rounded-2xl border border-[#fbcfe8] text-[#380c25]">
                  <div className="font-mono-craft text-xs uppercase flex items-center gap-1.5 mb-1 text-[#db2777]">
                    <CheckCircle2 className="w-4 h-4 text-[#db2777]" />
                    Independência & Autonomia
                  </div>
                  <p className="text-xs leading-relaxed font-light text-[#863b63]">
                    O Pinta e Borda não recebe repasses partidários ou estatais. Mantém-se através do voluntariado, da contribuição
                    das artesãs cooperadas, de palestras, oficinas e da venda de produtos sociais autênticos com split transparente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Impacto Social */}
          {currentSlide.id === 'impacto-social' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                  {currentSlide.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">{currentSlide.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#db2777] flex items-center justify-center font-bold">
                    🥣
                  </div>
                  <h3 className="font-display font-medium text-base text-[#380c25]">Sopões nos Hospitais</h3>
                  <p className="text-xs text-[#863b63] leading-relaxed font-light">
                    Alimento reconfortante e calor humano distribuído para acompanhantes e familiares em salas de espera de hospitais públicos de São Luís.
                  </p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#380c25] flex items-center justify-center font-bold">
                    🎨
                  </div>
                  <h3 className="font-display font-medium text-base text-[#380c25]">Recreação Infantil</h3>
                  <p className="text-xs text-[#863b63] leading-relaxed font-light">
                    Momentos lúdicos com brinquedos, contação de histórias, oficinas de arte e acolhimento para crianças em comunidades e enfermarias.
                  </p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#fff0f5] text-[#3c6b54] flex items-center justify-center font-bold">
                    🧵
                  </div>
                  <h3 className="font-display font-medium text-base text-[#380c25]">Oficinas Formativas</h3>
                  <p className="text-xs text-[#863b63] leading-relaxed font-light">
                    Capacitação artesanal com mulheres em situação de vulnerabilidade, ensinando técnicas de costura, cerâmica e miçangas para renda imediata.
                  </p>
                </div>
              </div>

              <div className="bg-[#380c25] text-[#ffffff] p-6 rounded-3xl border border-[#5c1a3e] space-y-2 shadow-md">
                <h4 className="font-display text-lg text-[#ff7597]">
                  A Destinação Cooperativa da Loja
                </h4>
                <p className="text-xs text-[#c9d9d0] leading-relaxed font-light">
                  As marcas parceiras que expõem no espaço colaborativo destinam voluntariamente uma fração das vendas para abastecer
                  diretamente as ações sociais do Projeto Pinta e Borda ao longo do ano. Assim, cada compra no balcão tem impacto social real na ponta.
                </p>
              </div>
            </div>
          )}

          {/* Slide 3: Loja Colaborativa */}
          {currentSlide.id === 'loja-colaborativa' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                  {currentSlide.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">{currentSlide.subtitle}</p>
              </div>

              <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#fbcfe8] shadow-2xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#380c25] text-[#ffffff] flex items-center justify-center shrink-0 border border-[#5c1a3e]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-xl text-[#380c25]">
                      Quiosque Físico: Rio Anil Shopping • São Luís / MA
                    </h3>
                    <p className="text-xs text-[#863b63] mt-1 font-light">
                      Localização nobre: <strong className="text-[#380c25] font-medium">2º Piso, próximo à Praça de Alimentação e em frente à Loja Marisa</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-4 bg-[#fff5f8] rounded-2xl border border-[#fbcfe8]">
                    <h4 className="font-display font-medium text-base text-[#380c25] mb-1">Como Funciona a Parceria?</h4>
                    <p className="text-[#863b63] leading-relaxed font-light">
                      As marcas interessadas em contribuir com o projeto devem se cadastrar inicialmente como <strong className="text-[#380c25]">voluntárias</strong>,
                      vivenciando de perto as etapas das ações sociais antes de integrar a vitrine física no shopping.
                    </p>
                  </div>

                  <div className="p-4 bg-[#fff5f8] rounded-2xl border border-[#fbcfe8]">
                    <h4 className="font-display font-medium text-base text-[#380c25] mb-1">Incentivo ao Empreendedorismo</h4>
                    <p className="text-[#863b63] leading-relaxed font-light">
                      Mulheres e pequenos negócios maranhenses unem forças para diluir custos fixos de um dos maiores shoppings do estado,
                      praticando rodízio de balcão e atendimento com a alma do feito à mão.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Marcas Parceiras */}
          {currentSlide.id === 'marcas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                    {currentSlide.badge}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                    {currentSlide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">
                    Conheça os 14 ateliês autorais maranhenses que dão vida e identidade ao Pinta e Borda.
                  </p>
                </div>
                <span className="text-xs font-mono-craft px-3 py-1 bg-[#fff0f5] text-[#380c25] rounded-full self-start sm:self-auto border border-[#fbcfe8]">
                  14 Ateliês Oficiais
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                {BRANDS.map((brand) => (
                  <div
                    key={brand.name}
                    className="bg-[#ffffff] rounded-3xl p-5 border border-[#fbcfe8] hover:border-[#f43f7e] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono-craft uppercase px-2.5 py-0.5 rounded-full bg-[#fff0f5] text-[#db2777] border border-[#fbcfe8]">
                          {brand.tag}
                        </span>
                        <span className="text-[10px] font-mono-craft text-[#9b4f76]">{brand.category}</span>
                      </div>

                      <h4 className="font-display font-medium text-lg text-[#380c25]">
                        {brand.name}
                      </h4>
                      <p className="text-xs text-[#9b4f76] font-mono-craft mb-2">{brand.founder}</p>

                      <p className="text-xs text-[#863b63] leading-relaxed mb-4 font-light">
                        {brand.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#fbcfe8] flex items-center justify-between text-xs">
                      <a
                        href={`https://instagram.com/${brand.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#380c25] hover:text-[#f43f7e] font-mono-craft flex items-center gap-1"
                      >
                        <Instagram className="w-3.5 h-3.5 text-[#f43f7e]" />
                        {brand.instagram}
                      </a>

                      <a
                        href={`https://wa.me/${brand.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3c6b54] hover:underline font-mono-craft flex items-center gap-1 font-medium"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {brand.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 5: B2B Parcerias */}
          {currentSlide.id === 'b2b-parcerias' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                  {currentSlide.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">{currentSlide.subtitle}</p>
              </div>

              <div className="bg-[#380c25] text-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#5c1a3e] shadow-md space-y-4">
                <span className="text-xs font-mono-craft text-[#ff7597] uppercase">
                  Chamada para Empreendedores e Gestores
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#ffffff] leading-snug">
                  "Que tal disponibilizar um espaço no seu empreendimento ou evento para uma exposição organizada com muitos produtos lindos e de marcas autorais de mulheres maranhenses?"
                </h3>
                <p className="text-xs text-[#a9c2b4] font-mono-craft">
                  (Extraído do catálogo oficial do Projeto Pinta e Borda - Página 18)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#380c25] flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-medium text-base text-[#380c25]">Ilhas em Shoppings & Hotéis</h4>
                  <p className="text-[#863b63] font-light">Pop-up stores organizadas com mix curado de artesanato maranhense e presença das criadoras.</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#db2777] flex items-center justify-center font-bold">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-medium text-base text-[#380c25]">Brindes Afetivos ESG</h4>
                  <p className="text-[#863b63] font-light">Presentes de fim de ano e kits corporativos com produtos naturais, cerâmica e azulejaria com causa real.</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#fbcfe8] shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#3c6b54] flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-medium text-base text-[#380c25]">Feiras & Convenções</h4>
                  <p className="text-[#863b63] font-light">Estandes criativos em congressos e eventos culturais, levando a identidade autêntica do Maranhão.</p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 6: Contato */}
          {currentSlide.id === 'contato' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-xs font-mono-craft text-[#db2777] uppercase">
                  {currentSlide.badge}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25] mt-1">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#863b63] mt-1 font-light">{currentSlide.subtitle}</p>
              </div>

              <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#fbcfe8] shadow-2xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-display font-medium text-xl text-[#380c25]">
                      Informações & Curadoria
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-3 text-[#863b63]">
                        <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#380c25] flex items-center justify-center shrink-0 border border-[#fbcfe8]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-[#380c25]">Telefone / WhatsApp</div>
                          <a href="https://wa.me/5598988289123" target="_blank" rel="noreferrer" className="text-[#f43f7e] hover:underline font-mono-craft">
                            (98) 9 8828-9123 (Keka da @ditodacor)
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[#863b63]">
                        <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#380c25] flex items-center justify-center shrink-0 border border-[#fbcfe8]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-[#380c25]">E-mail Oficial</div>
                          <a href="mailto:projetopintaebordaslz@gmail.com" className="text-[#863b63] hover:underline font-mono-craft">
                            projetopintaebordaslz@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[#863b63]">
                        <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#db2777] flex items-center justify-center shrink-0 border border-[#fbcfe8]">
                          <Instagram className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-[#380c25]">Instagram</div>
                          <a href="https://instagram.com/projetopintaebordaslz" target="_blank" rel="noreferrer" className="text-[#f43f7e] hover:underline font-mono-craft">
                            @projetopintaebordaslz
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:border-l sm:border-[#fbcfe8] sm:pl-6">
                    <h3 className="font-display font-medium text-xl text-[#380c25]">
                      Ponto Físico no Shopping
                    </h3>

                    <div className="flex items-start gap-3 text-xs text-[#863b63]">
                      <div className="w-8 h-8 rounded-lg bg-[#fff0f5] text-[#380c25] flex items-center justify-center shrink-0 border border-[#fbcfe8]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="leading-relaxed font-light">
                        <div className="font-medium text-[#380c25]">Rio Anil Shopping</div>
                        <p className="text-[#863b63] mt-0.5">
                          2º Piso, Próximo à Praça de Alimentação e em frente à Loja Marisa.
                        </p>
                        <p className="text-[#9b4f76] font-mono-craft mt-1">São Luís / MA</p>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/5598988289123?text=Ol%C3%A1%2C%20Keka!%20Gostaria%20de%20conversar%20sobre%20uma%20parceria%20com%20o%20Projeto%20Pinta%20e%20Borda."
                      target="_blank"
                      rel="noreferrer"
                      className="solid-button w-full !py-3 text-xs flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Falar Direto com a Keka no WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Slide Navigation */}
        <div className="px-6 py-4 bg-[#ffffff] border-t border-[#fbcfe8] flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`px-4 py-2 rounded-full text-xs font-mono-craft transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed text-[#9b4f76] bg-[#fff0f5]'
                : 'bg-[#fff0f5] hover:bg-[#fbcfe8] text-[#380c25]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Capítulo Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-6 bg-[#380c25]' : 'w-2 bg-[#fbcfe8]'
                }`}
              />
            ))}
          </div>

          {currentSlideIndex < SLIDES.length - 1 ? (
            <button
              onClick={handleNext}
              className="solid-button !py-2 !px-4 text-xs font-mono-craft flex items-center gap-1.5"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="solid-button !py-2 !px-4 text-xs font-mono-craft flex items-center gap-1.5"
            >
              Concluir Apresentação
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
