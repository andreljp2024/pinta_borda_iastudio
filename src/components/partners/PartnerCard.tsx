import React, { useState } from 'react';
import {
  MessageCircle,
  Instagram,
  Edit2,
  Copy,
  Check,
  Eye,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Power,
} from 'lucide-react';
import { Partner, UserRole } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

interface PartnerCardProps {
  partner: Partner;
  productCount: number;
  totalStock: number;
  userRole: UserRole;
  onViewDetail: (partner: Partner) => void;
  onEdit: (partner: Partner) => void;
  onToggleStatus?: (partnerId: string) => void;
  onOpenPortal: (partner: Partner) => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  productCount,
  totalStock,
  userRole,
  onViewDetail,
  onEdit,
  onToggleStatus,
  onOpenPortal,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!partner.pixKey) return;
    navigator.clipboard.writeText(partner.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const monthlyFee = partner.monthlyFee ?? partner.contract?.monthlyFee ?? 350;
  const commissionRate = partner.commissionPercentage ?? partner.contract?.salesCommissionRate ?? 10;
  const worksShifts = partner.worksShifts ?? (partner.contract?.shiftRequirement === 'REGULAR');
  const spaceType = partner.spaceType || 'Nicho Central';
  const status = partner.status || partner.contract?.status || 'ATIVO';

  const statusConfig = {
    ATIVO: {
      bg: 'bg-[#dff0e6]',
      text: 'text-[#1f4e38]',
      border: 'border-[#bcdbc7]',
      label: 'Ativo',
    },
    INATIVO: {
      bg: 'bg-stone-100',
      text: 'text-stone-600',
      border: 'border-stone-300',
      label: 'Inativo',
    },
    SUSPENSO: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Suspenso',
    },
    PENDENTE: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      label: 'Pendente',
    },
    ENCERRADO: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      label: 'Encerrado',
    },
  }[status] || {
    bg: 'bg-[#fff0f5]',
    text: 'text-[#863b63]',
    border: 'border-[#fbcfe8]',
    label: status,
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs hover:border-[#f43f7e]/40 hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={partner.brandLogo}
              alt={partner.brandName}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#fbcfe8] shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-display font-medium text-[#380c25] text-base truncate">
                  {partner.brandName}
                </h4>
              </div>
              <span className="text-xs text-[#9b4f76] font-light block truncate">
                {partner.ownerName}
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#fff0f5] text-[#863b63] border border-[#fbcfe8]">
                {partner.category}
              </span>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-craft border shrink-0 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#863b63] line-clamp-2 mb-4 font-light leading-relaxed">
          {partner.brandDescription || 'Ateliê autoral participante da casa colaborativa Pinta e Borda no Rio Anil Shopping.'}
        </p>

        {/* Specs and Operational Details */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#fff0f5]/60 rounded-xl p-3 border border-[#fbcfe8] mb-4 font-mono-craft">
          <div>
            <span className="text-[#9b4f76] block text-[10px] uppercase font-semibold">Espaço na Loja</span>
            <strong className="text-[#380c25] block truncate" title={spaceType}>
              {spaceType}
            </strong>
          </div>

          <div>
            <span className="text-[#9b4f76] block text-[10px] uppercase font-semibold">Mensalidade</span>
            <strong className="text-[#380c25]">
              R$ {monthlyFee.toFixed(2).replace('.', ',')}/mês
            </strong>
          </div>

          <div>
            <span className="text-[#9b4f76] block text-[10px] uppercase font-semibold">Comissão P&B</span>
            <strong className="text-[#380c25]">{commissionRate}% sobre vendas</strong>
          </div>

          <div>
            <span className="text-[#9b4f76] block text-[10px] uppercase font-semibold">Regime Plantão</span>
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                worksShifts ? 'text-[#1f4e38]' : 'text-[#863b63]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  worksShifts ? 'bg-[#1f4e38]' : 'bg-[#f43f7e]'
                }`}
              />
              {worksShifts ? 'Cumpre Escala' : 'Paga Diarista'}
            </span>
          </div>

          {/* Pix Key Display */}
          <div className="col-span-2 pt-1.5 border-t border-[#fbcfe8]/70 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[#9b4f76] block text-[10px] uppercase font-semibold">
                Chave Pix ({partner.pixKeyType}):
              </span>
              <span className="text-[#380c25] text-[11px] truncate block font-mono">
                {partner.pixKey || 'Não cadastrada'}
              </span>
            </div>
            {partner.pixKey && (
              <button
                type="button"
                onClick={handleCopyPix}
                className="p-1 rounded-md text-[#9b4f76] hover:text-[#380c25] hover:bg-white border border-transparent hover:border-[#fbcfe8] transition-colors shrink-0"
                title="Copiar Chave Pix"
              >
                {copiedPix ? (
                  <Check className="w-3.5 h-3.5 text-[#1f4e38]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Catalog & Inventory count */}
          <div className="col-span-2 pt-1 border-t border-[#fbcfe8]/70 flex items-center justify-between text-[10px] text-[#9b4f76]">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-[#f43f7e]" />
              <strong className="text-[#380c25]">{productCount}</strong> peças cadastradas
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#3c6b54]" />
              <strong className="text-[#380c25]">{totalStock}</strong> un. em prateleira
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#fbcfe8] flex items-center justify-between gap-2 text-xs">
        {/* Social & Contact Buttons */}
        <div className="flex items-center gap-1">
          {partner.whatsapp && (
            <a
              href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#1f4e38] hover:bg-[#dff0e6] rounded-lg transition-colors cursor-pointer"
              title={`WhatsApp: ${partner.whatsapp}`}
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}

          {partner.instagram && (
            <a
              href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#f43f7e] hover:bg-[#ffe4ee] rounded-lg transition-colors cursor-pointer"
              title={`Instagram: ${partner.instagram}`}
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenPortal(partner)}
            className="p-1.5 text-[#863b63] hover:bg-[#fff0f5] rounded-lg transition-colors cursor-pointer"
            title="Abrir no Portal da Artesã (Mobile)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-1.5 font-mono-craft">
          <button
            type="button"
            onClick={() => onViewDetail(partner)}
            className="outline-button !py-1 !px-2.5 text-xs flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ficha</span>
          </button>

          {userRole === 'ADMIN' && (
            <>
              <button
                type="button"
                onClick={() => onEdit(partner)}
                className="p-1.5 text-[#380c25] hover:bg-[#fff0f5] border border-[#fbcfe8] rounded-lg transition-colors cursor-pointer"
                title="Editar dados cadastrais e contrato"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {onToggleStatus && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(partner.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    status === 'ATIVO'
                      ? 'text-amber-700 hover:bg-amber-50 border-amber-200'
                      : 'text-[#1f4e38] hover:bg-[#dff0e6] border-[#bcdbc7]'
                  }`}
                  title={status === 'ATIVO' ? 'Inativar Ateliê' : 'Ativar Ateliê'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
