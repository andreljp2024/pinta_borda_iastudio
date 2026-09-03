import React, { useState } from 'react';
import {
  Image,
  Upload,
  Sparkles,
  Check,
  RefreshCw,
  Palette,
  Eye,
  Sliders,
  AlertCircle,
  FileImage,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_PINTA_BORDA_LOGO_SVG } from '../../mockData';

// Curated preset logos for Pinta e Borda
const LOGO_PRESETS = [
  {
    id: 'official-circular',
    name: 'Brasão Circular Oficial (Rosa & Borgonha)',
    description: 'Logo vetorial com monograma central "pb", bordado tracejado e créditos do Rio Anil Shopping.',
    url: OFFICIAL_PINTA_BORDA_LOGO_SVG,
  },
  {
    id: 'monogram-dark',
    name: 'Monograma Nobre Borgonha Profundo',
    description: 'Versão em tons escuros e sóbrios, ideal para sacolas de papel kraft e selos adesivos.',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="48" fill="%232b071c"/><circle cx="150" cy="115" r="54" fill="%23f43f7e" opacity="0.15"/><circle cx="150" cy="115" r="48" stroke="%23ffb8ce" stroke-width="2.5"/><text x="150" y="125" text-anchor="middle" fill="%23ffb8ce" font-family="serif" font-size="34" font-weight="bold">pb</text><text x="150" y="204" text-anchor="middle" fill="%23ffffff" font-family="serif" font-size="23" font-weight="600">pinta e borda</text><text x="150" y="226" text-anchor="middle" fill="%23ffb8ce" font-family="sans-serif" font-size="10" font-weight="600" letter-spacing="3">COLETIVO AUTORAL</text><text x="150" y="246" text-anchor="middle" fill="%23d88ca9" font-family="sans-serif" font-size="9">SÃO LUÍS • MARANHÃO</text></svg>',
  },
  {
    id: 'botanical-rose',
    name: 'Identidade Botânica & Afeto Maranhense',
    description: 'Emblema suave com textura floral em tons rose gold e tipografia clássica.',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="48" fill="%23fdf2f8"/><circle cx="150" cy="120" r="56" fill="%23ffffff" stroke="%23f43f7e" stroke-width="2"/><path d="M125 120c12-25 38-25 50 0M150 78v84M130 98l40 0" stroke="%23db2777" stroke-width="3" stroke-linecap="round"/><circle cx="150" cy="120" r="14" fill="%23fce7f3"/><text x="150" y="210" text-anchor="middle" fill="%23380c25" font-family="serif" font-size="24" font-weight="bold">pinta e borda</text><text x="150" y="232" text-anchor="middle" fill="%23db2777" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="2.5">CASA COLABORATIVA</text></svg>',
  },
  {
    id: 'minimalist-craft',
    name: 'Minimalista Contemporâneo',
    description: 'Design limpo e moderno com alto contraste e elegância atemporal.',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="48" fill="%23ffffff" stroke="%23fbcfe8" stroke-width="3"/><circle cx="150" cy="115" r="46" fill="%23380c25"/><text x="150" y="125" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="28" font-weight="800">P&amp;B</text><text x="150" y="200" text-anchor="middle" fill="%23380c25" font-family="sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">pinta &amp; borda</text><text x="150" y="222" text-anchor="middle" fill="%23e11d48" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2">MARCAS AUTORAIS</text></svg>',
  },
];

export const LogoSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useApp();

  const [currentLogo, setCurrentLogo] = useState(storeSettings.logoUrl);
  const [customUrl, setCustomUrl] = useState('');
  const [tagline, setTagline] = useState(storeSettings.tagline);
  const [primaryColor, setPrimaryColor] = useState(storeSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(storeSettings.secondaryColor);
  const [accentColor, setAccentColor] = useState(storeSettings.accentColor);

  const [isSaved, setIsSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('O arquivo excede o limite de 2MB. Escolha uma imagem mais leve.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCurrentLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setCurrentLogo(customUrl.trim());
    setCustomUrl('');
  };

  const handleSave = () => {
    updateStoreSettings({
      logoUrl: currentLogo,
      tagline,
      primaryColor,
      secondaryColor,
      accentColor,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    setCurrentLogo(OFFICIAL_PINTA_BORDA_LOGO_SVG);
    setTagline('Casa colaborativa de marcas autorais, afetos e identidade maranhense.');
    setPrimaryColor('#f43f7e');
    setSecondaryColor('#380c25');
    setAccentColor('#1f4e38');
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fff0f5] text-[#f43f7e]">
              <Image className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-[#380c25]">
              Logo & Identidade Visual da Pinta e Borda
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Personalize o logotipo oficial, cores institucionais e elementos de apresentação da loja colaborativa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-xs font-semibold shadow-md shadow-[#f43f7e]/20 flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Salvo com Sucesso!
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Salvar Logo & Identidade
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Preview & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#f43f7e]" />
                Pré-visualização do Logotipo
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#db2777]">
                Ao Vivo
              </span>
            </div>

            {/* Big Light Mode Card */}
            <div className="p-8 rounded-2xl bg-[#fff5f8] border border-[#fbcfe8]/60 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-[#fbcfe8] flex items-center justify-center">
                <img
                  src={currentLogo}
                  alt="Logo Pinta e Borda"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#380c25] mt-4">
                Pinta e Borda
              </h4>
              <p className="text-xs text-[#f43f7e] font-semibold tracking-widest uppercase">
                Casa Colaborativa
              </p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs italic">
                "{tagline}"
              </p>
            </div>

            {/* Context Previews */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Simulação em Aplicações Reais
              </p>

              {/* In App Header Context */}
              <div className="p-3 rounded-xl bg-[#380c25] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-0.5 border border-white/20">
                    <img
                      src={currentLogo}
                      alt="Mini Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-xs text-white">Pinta e Borda</p>
                    <p className="text-[9px] text-[#ffb8ce] uppercase tracking-wider">Shopping Rio Anil</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80">
                  Cabeçalho
                </span>
              </div>

              {/* On Kraft Paper Bag / Sticker */}
              <div className="p-3 rounded-xl bg-[#e8dbcc] border border-[#d8c5b0] text-[#3d2719] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/90 p-1 shadow-xs border border-[#3d2719]/20">
                    <img
                      src={currentLogo}
                      alt="Tag Bag"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-xs text-[#3d2719]">Tag de Embalagem & Sacola</p>
                    <p className="text-[10px] text-[#71543e]">Artesanato com Alma Maranhense</p>
                  </div>
                </div>
                <ShoppingBag className="w-4 h-4 text-[#71543e]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logo Options & Palette (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Logo Selection Presets */}
          <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f43f7e]" />
              Modelos Oficiais de Logotipo
            </h3>
            <p className="text-xs text-stone-600">
              Selecione uma das versões oficiais pré-desenhadas para a casa colaborativa ou faça upload da sua própria arte:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LOGO_PRESETS.map((preset) => {
                const isSelected = currentLogo === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCurrentLogo(preset.url)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#f43f7e] bg-[#fff5f8] ring-2 ring-[#f43f7e]/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-white p-1 flex items-center justify-center">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#380c25] truncate">
                          {preset.name}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-tight line-clamp-2 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 p-1 rounded-full bg-[#f43f7e] text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Upload or Custom URL */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#380c25] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#f43f7e]" />
                Upload de Novo Arquivo ou URL
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Upload Button */}
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-200 hover:border-[#f43f7e] rounded-xl cursor-pointer bg-stone-50/50 hover:bg-[#fff5f8]/30 transition-all text-center">
                  <FileImage className="w-6 h-6 text-stone-400 mb-1" />
                  <span className="text-xs font-semibold text-[#380c25]">
                    Carregar Arquivo Local
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    PNG, JPG, SVG até 2MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input */}
                <div className="flex flex-col justify-between p-3.5 border border-stone-200 rounded-xl bg-stone-50/30">
                  <span className="text-xs font-semibold text-[#380c25] block mb-1">
                    Informar Link / URL da Imagem
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://exemplo.com/logo.svg"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#f43f7e]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={!customUrl.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#380c25] hover:bg-[#59163b] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Link público para arquivo SVG ou PNG
                  </span>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          {/* Slogan & Color Palette Configuration */}
          <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#f43f7e]" />
              Paleta de Cores & Slogan Institucional
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Slogan / Frase de Identidade
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Casa colaborativa de marcas autorais, afetos e identidade maranhense."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Exibido no rodapé do portal público e nos comunicados oficiais.
              </span>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Cor Primária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-xs text-[#380c25] font-semibold uppercase">
                    {primaryColor}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Rosa Cerrado</span>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Cor Secundária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-xs text-[#380c25] font-semibold uppercase">
                    {secondaryColor}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Borgonha Profundo</span>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Cor de Destaque
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-xs text-[#380c25] font-semibold uppercase">
                    {accentColor}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Verde Guarnicê</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
