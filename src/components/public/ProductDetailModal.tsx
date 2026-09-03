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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-stone-600 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-stone-100 relative min-h-[260px] md:min-h-[380px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Destaque do Ateliê
            </div>
          )}
        </div>

        {/* Product Info & CTA */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand Header */}
            {partner && (
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 mb-3">
                <img
                  src={partner.brandLogo}
                  alt={partner.brandName}
                  className="w-8 h-8 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                    {partner.brandName}
                  </h4>
                  <p className="text-[11px] text-stone-500">{partner.ownerName}</p>
                </div>
              </div>
            )}

            <div className="text-xs font-mono text-stone-400 mb-1">SKU: {product.sku}</div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 leading-snug mb-2">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-amber-900">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-stone-500">em até 3x no cartão</span>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Physical Availability badge */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-stone-500" />
                  Disponibilidade na Loja Física:
                </span>
                {product.stock > 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {product.stock} un. em estoque
                  </span>
                ) : (
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Sob encomenda
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Localização: Rio Anil Shopping (Piso 1, Próximo à Praça Central) • São Luís/MA
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Action (PRD Section 8.4) */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Falar no WhatsApp da Marca</span>
            </a>
            <p className="text-[11px] text-center text-stone-400 mt-2">
              Atendimento direto com o artesão ou visita presencial na loja física.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
