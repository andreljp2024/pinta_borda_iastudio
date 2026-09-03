import React from 'react';
import { X, MessageCircle, Store, Check, AlertCircle, Tag, Sparkles } from 'lucide-react';
import { Product, Partner } from '../../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#253a35]/60 backdrop-blur-xs p-4">
      <div className="bg-[#fffaf2] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#ded6ca] overflow-hidden relative animate-in fade-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-[#38524a] bg-white/95 hover:bg-[#ede5d8] p-2 rounded-full shadow-xs border border-[#ded6ca] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-[#ede5d8] relative min-h-[260px] md:min-h-[380px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-[#b56f55] text-white text-[11px] font-mono-craft px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#d4ba84]" />
              Destaque do Ateliê
            </div>
          )}
        </div>

        {/* Product Info & CTA */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand Header */}
            {partner && (
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#ded6ca] mb-3">
                <img
                  src={partner.brandLogo}
                  alt={partner.brandName}
                  className="w-9 h-9 rounded-full object-cover border border-[#ded6ca] shadow-2xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#253a35] uppercase tracking-wider font-mono-craft">
                    {partner.brandName}
                  </h4>
                  <p className="text-[11px] text-[#a66e53] font-mono-craft">Artesã: {partner.ownerName}</p>
                </div>
              </div>
            )}

            <div className="text-[11px] font-mono-craft text-[#7d8c83] mb-1">SKU: {product.sku}</div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#253a35] leading-snug mb-2">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono-craft text-2xl sm:text-3xl font-bold text-[#b56f55]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-[#7d8c83] font-mono-craft">em até 3x no cartão</span>
            </div>

            <p className="text-[#52615a] text-xs sm:text-sm leading-relaxed mb-5 font-light">
              {product.description}
            </p>

            {/* Physical Availability badge */}
            <div className="bg-[#ede5d8]/70 rounded-2xl p-4 border border-[#ded6ca] mb-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#253a35] flex items-center gap-1.5 font-mono-craft">
                  <Store className="w-4 h-4 text-[#b56f55]" />
                  Casa Colaborativa Rio Anil:
                </span>
                {product.stock > 0 ? (
                  <span className="font-bold text-[#1f4e38] bg-[#dff0e6] px-2.5 py-0.5 rounded-md border border-[#bcdbc7] flex items-center gap-1 text-[11px] font-mono-craft">
                    <Check className="w-3 h-3" />
                    {product.stock} un. na casa
                  </span>
                ) : (
                  <span className="font-bold text-[#824f3c] bg-[#faebe6] px-2.5 py-0.5 rounded-md border border-[#f0cfc5] flex items-center gap-1 text-[11px] font-mono-craft">
                    <AlertCircle className="w-3 h-3" />
                    Sob encomenda
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#52615a]">
                Localização: Rio Anil Shopping, 2º Piso (em frente à Loja Marisa) • São Luís/MA
              </p>
              <p className="text-[11px] text-[#b56f55] font-medium font-mono-craft">
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
            <p className="text-[11px] text-center text-[#7d8c83] font-mono-craft mt-2">
              Atendimento direto com a artesã maranhense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
