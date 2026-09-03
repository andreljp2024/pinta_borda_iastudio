import React from 'react';
import { Store, MapPin, Layers, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';
import { Partner } from '../../types';
import { handleImageError, FALLBACK_AVATAR_IMAGE } from '../../utils/imageFallbacks';

interface SpacesMapTabProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
}

interface SpaceZone {
  id: string;
  name: string;
  description: string;
  type: string;
}

export const SpacesMapTab: React.FC<SpacesMapTabProps> = ({ partners, onSelectPartner }) => {
  const zones: SpaceZone[] = [
    {
      id: 'z1',
      name: 'Parede Principal de Nichos (Módulos de Madeira Nobre)',
      description: 'Nichos iluminados com foco para cerâmica, bordados, papelaria e cestaria autoral.',
      type: 'Nicho Central',
    },
    {
      id: 'z2',
      name: 'Balcão Vitrine & Joalheria Autoral (Frente de Caixa)',
      description: 'Vitrine de vidro com tranca e iluminação LED para biojoias, pratas e pequenos utilitários.',
      type: 'Balcão Vitrine',
    },
    {
      id: 'z3',
      name: 'Araras Coletivas & Vestuário (Centro de Loja)',
      description: 'Araras suspensas e cabides em madeira para moda autoral maranhense, turbantes e tecidos.',
      type: 'Arara Coletiva',
    },
    {
      id: 'z4',
      name: 'Expositores Laterais & Botânica (Entrada)',
      description: 'Prateleiras para aromas da mata, saboaria natural, velas e botânica.',
      type: 'Prateleira Suspensa',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#fff0f5] via-[#fff5f8] to-[#ffe4ee] p-5 sm:p-6 rounded-3xl border border-[#fbcfe8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white border border-[#fbcfe8] text-[#f43f7e] shadow-2xs">
              <Store className="w-5 h-5" />
            </span>
            <h3 className="font-display font-medium text-[#380c25] text-lg sm:text-xl">
              Mapa dos Nichos & Espaços no Rio Anil Shopping
            </h3>
          </div>
          <p className="text-xs text-[#863b63] mt-1 font-light max-w-2xl">
            Planta esquemática de alocação das marcas autorais na loja física coletiva da Pinta e
            Borda (Piso 2, corredor central). Clique em qualquer módulo para inspecionar a marca parceira.
          </p>
        </div>

        {/* Space Stats */}
        <div className="flex items-center gap-3 font-mono-craft text-xs shrink-0">
          <div className="bg-white p-3 rounded-2xl border border-[#fbcfe8] text-center shadow-2xs">
            <span className="text-[10px] text-[#9b4f76] block uppercase font-bold">Ocupação</span>
            <strong className="text-[#1f4e38] text-base font-bold">100%</strong>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-[#fbcfe8] text-center shadow-2xs">
            <span className="text-[10px] text-[#9b4f76] block uppercase font-bold">Nichos Ativos</span>
            <strong className="text-[#380c25] text-base font-bold">{partners.length}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Store Zones */}
      <div className="space-y-6">
        {zones.map((zone) => {
          const matchedPartners = partners.filter((p) =>
            p.spaceType ? p.spaceType.toLowerCase().includes(zone.type.toLowerCase().split(' ')[0]) : true
          );

          // Fallback if empty to ensure every zone visually reflects the vibrant store
          const displayPartners =
            matchedPartners.length > 0
              ? matchedPartners
              : partners.slice(0, 3);

          return (
            <div
              key={zone.id}
              className="bg-white rounded-3xl border border-[#fbcfe8] p-5 shadow-2xs space-y-4"
            >
              <div className="border-b border-[#fbcfe8]/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-display font-medium text-[#380c25] text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#f43f7e]" />
                    {zone.name}
                  </h4>
                  <p className="text-xs text-[#863b63] font-light mt-0.5">
                    {zone.description}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono-craft font-semibold bg-[#fff0f5] text-[#863b63] border border-[#fbcfe8] self-start sm:self-auto">
                  {displayPartners.length} ateliês alocados
                </span>
              </div>

              {/* Grid of Partners in this Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayPartners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => onSelectPartner(partner)}
                    className="p-3.5 rounded-2xl border border-[#fbcfe8] bg-[#fff5f8]/50 hover:bg-white hover:border-[#f43f7e] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={partner.brandLogo}
                        alt={partner.brandName}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_AVATAR_IMAGE)}
                        className="w-11 h-11 rounded-full object-cover border border-[#fbcfe8] shrink-0"
                      />
                      <div className="min-w-0">
                        <strong className="text-[#380c25] text-xs font-display block truncate group-hover:text-[#f43f7e] transition-colors">
                          {partner.brandName}
                        </strong>
                        <span className="text-[11px] text-[#9b4f76] block truncate">
                          {partner.ownerName}
                        </span>
                        <span className="text-[10px] text-[#863b63] font-mono-craft block truncate mt-0.5">
                          {partner.spaceType || 'Nicho Central'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono-craft">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1f4e38] bg-[#dff0e6] px-2 py-0.5 rounded-full border border-[#bcdbc7]">
                        <CheckCircle2 className="w-3 h-3" />
                        Ocupado
                      </span>
                      <button
                        type="button"
                        className="mt-2 text-[10px] text-[#f43f7e] flex items-center gap-0.5 ml-auto group-hover:underline font-bold"
                      >
                        <Eye className="w-3 h-3" /> Ver Ficha
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
