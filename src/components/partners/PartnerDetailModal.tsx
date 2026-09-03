import React, { useState } from 'react';
import {
  X,
  Store,
  Calendar,
  MessageCircle,
  Instagram,
  Copy,
  Check,
  Package,
  Clock,
  DollarSign,
  FileText,
  ExternalLink,
  Edit2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Partner, Product, Shift, PartnerSettlement, UserRole } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageFallbacks';

interface PartnerDetailModalProps {
  partner: Partner;
  products: Product[];
  shifts: Shift[];
  settlements: PartnerSettlement[];
  userRole: UserRole;
  onClose: () => void;
  onEdit: (partner: Partner) => void;
  onOpenPortal: (partner: Partner) => void;
  onOpenStore: (partnerId: string) => void;
}

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  partner,
  products,
  shifts,
  settlements,
  userRole,
  onClose,
  onEdit,
  onOpenPortal,
  onOpenStore,
}) => {
  const [activeTab, setActiveTab] = useState<'DADOS' | 'PIX' | 'PRODUTOS' | 'PLANTOES'>('DADOS');
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = () => {
    if (!partner.pixKey) return;
    navigator.clipboard.writeText(partner.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const partnerProducts = products.filter((p) => p.partnerId === partner.id);
  const totalStockUnits = partnerProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalStockValue = partnerProducts.reduce((sum, p) => sum + (p.stock || 0) * p.price, 0);

  const partnerShifts = shifts.filter((s) => s.partnerId === partner.id);
  const partnerSettlements = settlements.filter((st) => st.partnerId === partner.id);

  const monthlyFee = partner.monthlyFee ?? partner.contract?.monthlyFee ?? 350;
  const commissionRate = partner.commissionPercentage ?? partner.contract?.salesCommissionRate ?? 10;
  const worksShifts = partner.worksShifts ?? (partner.contract?.shiftRequirement === 'REGULAR');
  const spaceType = partner.spaceType || 'Nicho Central';
  const status = partner.status || partner.contract?.status || 'ATIVO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#fbcfe8] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header with Avatar and Brand banner */}
        <div className="relative bg-gradient-to-r from-[#fff0f5] via-[#fff5f8] to-[#ffe4ee] p-5 sm:p-6 border-b border-[#fbcfe8]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#863b63] hover:text-[#380c25] hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={partner.brandLogo}
              alt={partner.brandName}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#fbcfe8] shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-medium text-[#380c25] text-xl sm:text-2xl">
                  {partner.brandName}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-craft ${
                    status === 'ATIVO'
                      ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                      : 'bg-stone-100 text-stone-700 border border-stone-300'
                  }`}
                >
                  {status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#863b63] border border-[#fbcfe8]">
                  {partner.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#9b4f76] mt-0.5">
                Fundadora / Responsável: <strong className="text-[#380c25]">{partner.ownerName}</strong>
                {partner.tradeName && (
                  <span className="hidden sm:inline"> • Razão Social: {partner.tradeName}</span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono-craft text-[#863b63]">
                <span className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-[#f43f7e]" />
                  {spaceType}
                </span>
                <span>•</span>
                <span>Mensalidade: R$ {monthlyFee.toFixed(2).replace('.', ',')}/mês</span>
                <span>•</span>
                <span>Vencimento: dia {partner.dueDay || 10}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation in Modal */}
          <div className="flex gap-1 mt-5 border-b border-[#fbcfe8]/80 font-mono-craft overflow-x-auto text-xs pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('DADOS')}
              className={`px-3 py-2 rounded-t-xl font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'DADOS'
                  ? 'bg-white text-[#f43f7e] border-t-2 border-t-[#f43f7e] shadow-2xs'
                  : 'text-[#863b63] hover:text-[#380c25]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Contrato & Cadastro
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PIX')}
              className={`px-3 py-2 rounded-t-xl font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'PIX'
                  ? 'bg-white text-[#f43f7e] border-t-2 border-t-[#f43f7e] shadow-2xs'
                  : 'text-[#863b63] hover:text-[#380c25]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Dados Pix & Repasses
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PRODUTOS')}
              className={`px-3 py-2 rounded-t-xl font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'PRODUTOS'
                  ? 'bg-white text-[#f43f7e] border-t-2 border-t-[#f43f7e] shadow-2xs'
                  : 'text-[#863b63] hover:text-[#380c25]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Peças em Estoque ({partnerProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PLANTOES')}
              className={`px-3 py-2 rounded-t-xl font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'PLANTOES'
                  ? 'bg-white text-[#f43f7e] border-t-2 border-t-[#f43f7e] shadow-2xs'
                  : 'text-[#863b63] hover:text-[#380c25]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Plantões & Escala ({partnerShifts.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: DADOS & CONTRATO */}
          {activeTab === 'DADOS' && (
            <div className="space-y-4">
              {/* Proposal / Biography */}
              <div className="bg-[#fff0f5]/60 rounded-2xl p-4 border border-[#fbcfe8]">
                <h4 className="font-semibold text-[#380c25] mb-1 font-mono-craft text-xs uppercase tracking-wider">
                  Proposta Autoral & Manifesto da Marca
                </h4>
                <p className="text-xs text-[#863b63] leading-relaxed font-light">
                  {partner.brandDescription ||
                    'Marca autoral integrante do coletivo Pinta e Borda, dedicada ao artesanato local, técnicas manuais maranhenses e design contemporâneo no Rio Anil Shopping.'}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">
                    Documento (CPF / CNPJ)
                  </span>
                  <strong className="text-[#380c25] font-mono text-xs">{partner.document || 'Não informado'}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">E-mail Cadastrado</span>
                  <span className="text-[#380c25] font-mono text-xs truncate block">{partner.email || 'Não informado'}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">WhatsApp</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#380c25] font-mono text-xs">{partner.whatsapp || partner.phone}</strong>
                    {partner.whatsapp && (
                      <a
                        href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1f4e38] font-bold text-[11px] hover:underline flex items-center gap-1 font-mono-craft"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chamar
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">Instagram Autoral</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-[#380c25] text-xs">{partner.instagram || 'Não informado'}</strong>
                    {partner.instagram && (
                      <a
                        href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f43f7e] font-bold text-[11px] hover:underline flex items-center gap-1 font-mono-craft"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        Ver Perfil
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">Espaço Ocupado</span>
                  <strong className="text-[#380c25] text-xs">{spaceType}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">
                    Regime de Plantão
                  </span>
                  <strong className={worksShifts ? 'text-[#1f4e38]' : 'text-[#863b63]'}>
                    {worksShifts ? 'Cumpre Escala Semanal' : 'Paga Diarista (R$ 50/dia)'}
                  </strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">
                    Comissão da Casa
                  </span>
                  <strong className="text-[#380c25]">{commissionRate}% sobre vendas brutas</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#fbcfe8]">
                  <span className="text-[#9b4f76] text-[10px] uppercase font-mono-craft block">
                    Data de Ingresso
                  </span>
                  <span className="text-[#380c25] font-mono">
                    {partner.admissionDate || partner.contract?.startDate || '01/01/2026'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PIX & REPASSES */}
          {activeTab === 'PIX' && (
            <div className="space-y-4">
              <div className="bg-[#fff0f5] rounded-2xl p-4 border border-[#fbcfe8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#380c25] font-mono-craft text-xs uppercase">
                    Chave Pix para Liquidação
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-md border border-[#fbcfe8] text-[#863b63]">
                    Tipo: {partner.pixKeyType}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#fbcfe8]">
                  <span className="font-mono text-sm text-[#380c25] font-bold truncate">
                    {partner.pixKey || 'Chave Pix não cadastrada'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="solid-button !py-1.5 !px-3 text-xs flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-[#9b4f76]">
                  Favorecido: <strong className="text-[#380c25]">{partner.pixHolderName || partner.ownerName}</strong>
                </div>
              </div>

              {/* Settlements history */}
              <div>
                <h4 className="font-semibold text-[#380c25] mb-2 font-mono-craft text-xs">
                  Fechamentos & Repasses ({partnerSettlements.length})
                </h4>
                {partnerSettlements.length === 0 ? (
                  <p className="text-stone-500 italic p-3 bg-stone-50 rounded-xl">
                    Nenhum fechamento financeiro gerado para este ateliê no período atual.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {partnerSettlements.map((st) => (
                      <div
                        key={st.id}
                        className="bg-white p-3 rounded-xl border border-[#fbcfe8] flex items-center justify-between font-mono-craft"
                      >
                        <div>
                          <strong className="text-[#380c25] text-xs block">{st.period}</strong>
                          <span className="text-[10px] text-[#9b4f76]">
                            Vendas Brutas: R$ {(st.totalSalesGross || st.grossSales || 0).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className="text-right">
                          <strong className="text-[#1f4e38] text-xs block">
                            R$ {(st.netPayoutAmount || st.netAmount || 0).toFixed(2).replace('.', ',')}
                          </strong>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              st.status === 'PAGO'
                                ? 'bg-[#dff0e6] text-[#1f4e38]'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {st.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUTOS & ESTOQUE */}
          {activeTab === 'PRODUTOS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#fff0f5] p-3 rounded-xl border border-[#fbcfe8] font-mono-craft text-xs">
                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Total de Peças Expostas</span>
                  <strong className="text-[#380c25]">{totalStockUnits} unidades</strong>
                </div>
                <div>
                  <span className="text-[#9b4f76] block text-[10px]">Valor de Estoque</span>
                  <strong className="text-[#380c25]">
                    R$ {totalStockValue.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </div>

              {partnerProducts.length === 0 ? (
                <p className="text-stone-500 italic p-3 bg-stone-50 rounded-xl">
                  Nenhum produto cadastrado para este ateliê.
                </p>
              ) : (
                <div className="divide-y divide-[#fbcfe8] border border-[#fbcfe8] rounded-xl overflow-hidden">
                  {partnerProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-2.5 flex items-center justify-between gap-2 hover:bg-[#fff5f8] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                          className="w-9 h-9 rounded-lg object-cover border border-[#fbcfe8] shrink-0"
                        />
                        <div className="min-w-0">
                          <strong className="text-[#380c25] block truncate text-xs">{prod.name}</strong>
                          <span className="text-[10px] text-[#9b4f76] font-mono block">
                            SKU: {prod.sku}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono-craft">
                        <span className="text-[#380c25] font-bold block text-xs">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            prod.stock <= prod.minStock
                              ? 'text-[#f43f7e]'
                              : 'text-[#1f4e38]'
                          }`}
                        >
                          {prod.stock} em estoque
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PLANTOES & ESCALA */}
          {activeTab === 'PLANTOES' && (
            <div className="space-y-3">
              <div className="bg-[#fff0f5] p-3 rounded-xl border border-[#fbcfe8] text-xs">
                <span className="text-[#9b4f76] block text-[10px] font-mono-craft uppercase">
                  Regime Contratual de Escala
                </span>
                <p className="text-[#380c25] font-medium mt-0.5">
                  {worksShifts
                    ? 'Esta marca cumpre a escala colaborativa de atendimento na loja física do Rio Anil Shopping.'
                    : 'Esta marca optou pela isenção de plantões presenciais mediante pagamento da taxa de diarista substituta.'}
                </p>
              </div>

              <h4 className="font-semibold text-[#380c25] font-mono-craft text-xs">
                Histórico de Plantões Realizados ({partnerShifts.length})
              </h4>

              {partnerShifts.length === 0 ? (
                <p className="text-stone-500 italic p-3 bg-stone-50 rounded-xl">
                  Nenhum registro de expediente para este ateliê no sistema.
                </p>
              ) : (
                <div className="space-y-2">
                  {partnerShifts.slice(0, 5).map((sh) => (
                    <div
                      key={sh.id}
                      className="p-3 bg-white border border-[#fbcfe8] rounded-xl flex items-center justify-between font-mono-craft text-xs"
                    >
                      <div>
                        <strong className="text-[#380c25] block">
                          {new Date(sh.startTime).toLocaleDateString('pt-BR')} • Atendente: {sh.operatorName}
                        </strong>
                        <span className="text-[10px] text-[#9b4f76]">
                          Vendas realizadas: {sh.salesCount} (R${' '}
                          {sh.totalSalesAmount.toFixed(2).replace('.', ',')})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sh.status === 'ENCERRADO'
                            ? 'bg-[#dff0e6] text-[#1f4e38]'
                            : 'bg-[#fff0f5] text-[#f43f7e]'
                        }`}
                      >
                        {sh.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#fff5f8] border-t border-[#fbcfe8] flex flex-wrap items-center justify-between gap-2 font-mono-craft text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenStore(partner.id)}
              className="outline-button !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ver na Loja Digital</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenPortal(partner)}
              className="outline-button !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Abrir no Portal</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'ADMIN' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(partner);
                }}
                className="solid-button !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Ateliê</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="outline-button !py-1.5 !px-3 text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
