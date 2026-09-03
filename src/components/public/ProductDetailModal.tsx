import React from 'react';
import { X, MessageCircle, Store, Check, AlertCircle, Tag, Sparkles } from 'lucide-react';
import { Product, Partner } from '../../types';
import { handleImageError, FALLBACK_PRODUCT_IMAGE, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

interface ProductDetailModalProps {
  product: Product | null;
  partner: Partner | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  partner,
  onClose,
}) => {
  if (!product) return null;

  // PRD Section 8.4 WhatsApp automated message template:
  // "Olá! Vi o produto "{PRODUTO}" no Pinta e Borda e gostaria de saber mais informações."
  const encodedMsg = encodeURIComponent(
    `Olá! Vi o produto "${product.name}" no Pinta e Borda e gostaria de saber mais informações.`
  );

  const cleanPhone = partner?.whatsapp ? partner.whatsapp.replace(/\D/g, '') : '5598981234567';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4">
      <div className="bg-[#ffffff] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#fbcfe8] overflow-hidden relative animate-in fade-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-[#5c1a3e] bg-white/95 hover:bg-[#fff0f5] p-2 rounded-full shadow-xs border border-[#fbcfe8] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-[#fff0f5] relative min-h-[260px] md:min-h-[380px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-[#f43f7e] text-white text-[11px] font-mono-craft px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#ff7597]" />
              Destaque do Ateliê
            </div>
          )}
        </div>

        {/* Product Info & CTA */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand Header */}
            {partner && (
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#fbcfe8] mb-3">
                <img
                  src={partner.brandLogo}
                  alt={partner.brandName}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                  className="w-9 h-9 rounded-full object-cover border border-[#fbcfe8] shadow-2xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#380c25] uppercase tracking-wider font-mono-craft">
                    {partner.brandName}
                  </h4>
                  <p className="text-[11px] text-[#f43f7e] font-mono-craft">Artesã: {partner.ownerName}</p>
                </div>
              </div>
            )}

            <div className="text-[11px] font-mono-craft text-[#9b4f76] mb-1">SKU: {product.sku}</div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#380c25] leading-snug mb-2">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono-craft text-2xl sm:text-3xl font-bold text-[#f43f7e]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-[#9b4f76] font-mono-craft">em até 3x no cartão</span>
            </div>

            <p className="text-[#863b63] text-xs sm:text-sm leading-relaxed mb-5 font-light">
              {product.description}
            </p>

            {/* Physical Availability badge */}
            <div className="bg-[#fff0f5]/70 rounded-2xl p-4 border border-[#fbcfe8] mb-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#380c25] flex items-center gap-1.5 font-mono-craft">
                  <Store className="w-4 h-4 text-[#f43f7e]" />
                  Casa Colaborativa Rio Anil:
                </span>
                {product.stock > 0 ? (
                  <span className="font-bold text-[#1f4e38] bg-[#dff0e6] px-2.5 py-0.5 rounded-md border border-[#bcdbc7] flex items-center gap-1 text-[11px] font-mono-craft">
                    <Check className="w-3 h-3" />
                    {product.stock} un. na casa
                  </span>
                ) : (
                  <span className="font-bold text-[#db2777] bg-[#fdf0f4] px-2.5 py-0.5 rounded-md border border-[#ffe4ee] flex items-center gap-1 text-[11px] font-mono-craft">
                    <AlertCircle className="w-3 h-3" />
                    Sob encomenda
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#863b63]">
                Localização: Rio Anil Shopping, 2º Piso (em frente à Loja Marisa) • São Luís/MA
              </p>
              <p className="text-[11px] text-[#f43f7e] font-medium font-mono-craft">
                Retirada imediata no quiosque ou entrega combinada com a artesã.
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="solid-button w-full !py-3 px-4 flex items-center justify-center gap-2 cursor-pointer text-center text-xs sm:text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp com o Ateliê</span>
            </a>
            <p className="text-[11px] text-center text-[#9b4f76] font-mono-craft mt-2">
              Atendimento direto com a artesã maranhense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
