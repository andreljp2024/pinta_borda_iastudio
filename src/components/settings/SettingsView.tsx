import React, { useState } from 'react';
import {
  Users,
  Building2,
  Image,
  Sliders,
  Sparkles,
  Shield,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UsersSettingsTab } from './UsersSettingsTab';
import { StoreDataTab } from './StoreDataTab';
import { LogoSettingsTab } from './LogoSettingsTab';
import { OperationalParametersTab } from './OperationalParametersTab';

export type SettingsSubTab = 'usuarios' | 'dados-loja' | 'logo' | 'parametros';

export const SettingsView: React.FC = () => {
  const { users, storeSettings } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsSubTab>('usuarios');

  const tabs: {
    id: SettingsSubTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string | number;
  }[] = [
    {
      id: 'usuarios',
      label: 'Usuários & Acessos',
      description: 'Operadores de caixa, administradores e permissões',
      icon: Users,
      badge: users.length,
    },
    {
      id: 'dados-loja',
      label: 'Dados da Pinta e Borda',
      description: 'CNPJ, endereço no Rio Anil Shopping, contatos e PIX',
      icon: Building2,
      badge: 'Rio Anil',
    },
    {
      id: 'logo',
      label: 'Logo & Identidade',
      description: 'Gerenciamento do logotipo oficial, upload e cores',
      icon: Image,
      badge: 'Marca',
    },
    {
      id: 'parametros',
      label: 'Parâmetros Operacionais',
      description: 'Mensalidades, comissões da casa, diárias de plantão e recibos',
      icon: Sliders,
      badge: 'Regras',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#380c25] via-[#4d1033] to-[#59163b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#f43f7e]/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-12 w-48 h-48 rounded-full bg-[#ffb8ce]/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ffb8ce] text-xs font-semibold backdrop-blur-xs">
              <Shield className="w-3.5 h-3.5 text-[#f43f7e]" />
              Painel Administrativo • Pinta e Borda
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Configurações Gerais do Sistema
            </h1>
            <p className="text-sm text-stone-200/90 max-w-2xl leading-relaxed">
              Defina os parâmetros do coletivo, cadastre os operadores de caixa, atualize os dados cadastrais da loja física no Rio Anil Shopping e gerencie a identidade visual e logotipo da Pinta e Borda.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 p-1 flex items-center justify-center">
                <img
                  src={storeSettings.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white font-serif">{storeSettings.storeName}</p>
                <p className="text-[10px] text-[#ffb8ce]">{storeSettings.shoppingName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="relative z-10 mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-white text-[#380c25] shadow-lg font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#f43f7e]' : 'text-white/70'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#380c25] text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="transition-all duration-200">
        {activeTab === 'usuarios' && <UsersSettingsTab />}
        {activeTab === 'dados-loja' && <StoreDataTab />}
        {activeTab === 'logo' && <LogoSettingsTab />}
        {activeTab === 'parametros' && <OperationalParametersTab />}
      </div>
    </div>
  );
};
