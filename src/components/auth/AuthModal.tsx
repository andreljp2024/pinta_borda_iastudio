import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShiftPrompt?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    userRole,
    setUserRole,
    partners,
    currentPartner,
    activeShift,
    startShift,
    requestShiftHandover,
    setActiveView,
  } = useApp();

  const [tab, setTab] = useState<UserRole>('ADMIN');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');
  const [email, setEmail] = useState('admin@pintaeborda.com.br');
  const [password, setPassword] = useState('••••••••');
  const [shiftPromptStep, setShiftPromptStep] = useState<
    'NONE' | 'START_SHIFT_PROMPT' | 'SWAP_SHIFT_PROMPT'
  >('NONE');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'ADMIN') {
      setUserRole('ADMIN');
      setActiveView('dashboard');
      onClose();
    } else {
      // Partner flow
      setUserRole('PARTNER', selectedPartnerId);

      // Check shift status per PRD Section 14
      if (!activeShift) {
        setShiftPromptStep('START_SHIFT_PROMPT');
      } else if (activeShift.partnerId !== selectedPartnerId) {
        setShiftPromptStep('SWAP_SHIFT_PROMPT');
      } else {
        setActiveView('dashboard');
        onClose();
      }
    }
  };

  const handleQuickLogin = (role: UserRole, partnerId?: string) => {
    setTab(role);
    if (partnerId) {
      setSelectedPartnerId(partnerId);
      const partner = partners.find((p) => p.id === partnerId);
      if (partner) {
        setEmail(partner.email);
      }
    } else {
      setEmail('admin@pintaeborda.com.br');
    }
  };

  const handleConfirmStartShift = () => {
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (partner) {
      startShift(partner.id, `${partner.ownerName} (${partner.brandName})`);
    }
    setActiveView('pdv');
    onClose();
  };

  const handleSkipShift = () => {
    setActiveView('dashboard');
    onClose();
  };

  const handleConfirmHandover = () => {
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (partner) {
      requestShiftHandover(partner.id, `${partner.ownerName} (${partner.brandName})`);
    }
    setActiveView('pdv');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 selection:bg-[#fbcfe8] selection:text-[#380c25]">
      <div className="bg-[#ffffff] rounded-3xl max-w-md w-full shadow-2xl border border-[#fbcfe8] overflow-hidden relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9b4f76] hover:text-[#380c25] bg-[#fff0f5]/70 hover:bg-[#fff0f5] p-1.5 rounded-full transition-colors cursor-pointer border border-[#fbcfe8]"
        >
          <X className="w-4 h-4" />
        </button>

        {shiftPromptStep === 'NONE' ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#380c25] text-[#ffffff] flex items-center justify-center font-display font-medium text-lg mx-auto shadow-md mb-3 border border-[#3c6b54]">
                P&B
              </div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-[#380c25]">
                pinta <em className="italic text-[#f43f7e]">e</em> borda
              </h2>
              <p className="text-xs text-[#9b4f76] mt-1 font-mono-craft">
                Gestão Compartilhada • Rio Anil Shopping
              </p>
            </div>

            {/* Profile Tab Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#fff0f5]/70 rounded-xl mb-6 text-xs font-semibold border border-[#fbcfe8] font-mono-craft">
              <button
                type="button"
                onClick={() => {
                  setTab('ADMIN');
                  setEmail('admin@pintaeborda.com.br');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'ADMIN'
                    ? 'bg-[#380c25] text-white shadow-xs'
                    : 'text-[#863b63] hover:text-[#380c25]'
                }`}
              >
                ADMINISTRADOR
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('PARTNER');
                  setEmail(partners[0]?.email || 'parceiro@pintaeborda.com.br');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'PARTNER'
                    ? 'bg-[#380c25] text-white shadow-xs'
                    : 'text-[#863b63] hover:text-[#380c25]'
                }`}
              >
                ARTESÃO / PARCEIRO
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {tab === 'PARTNER' && (
                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1.5 font-mono-craft">
                    Selecione seu Ateliê / Marca
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => {
                      setSelectedPartnerId(e.target.value);
                      const p = partners.find((pt) => pt.id === e.target.value);
                      if (p) setEmail(p.email);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] text-xs bg-white text-[#380c25] focus:outline-none"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brandName} ({p.ownerName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#380c25] mb-1.5 font-mono-craft">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] text-xs bg-white text-[#380c25] focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#380c25] font-mono-craft">Senha</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Recuperação de senha: Link seguro enviado ao e-mail cadastrado.');
                    }}
                    className="text-[11px] text-[#f43f7e] hover:underline font-mono-craft"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] text-xs bg-white text-[#380c25] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full solid-button !py-3 !px-4 text-xs font-semibold flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-xs"
              >
                <span>ENTRAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demonstration Buttons */}
            <div className="mt-6 pt-4 border-t border-[#fbcfe8]">
              <p className="text-[10px] font-semibold text-[#9b4f76] uppercase tracking-wider mb-2 font-mono-craft">
                Acesso Rápido para Avaliação:
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono-craft">
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLogin('ADMIN');
                    setUserRole('ADMIN');
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-[#fff0f5] text-[#380c25] rounded-lg font-medium hover:bg-[#fbcfe8] transition-colors cursor-pointer border border-[#fbcfe8]"
                >
                  Admin Geral
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLogin('PARTNER', 'partner-tutabel');
                    setUserRole('PARTNER', 'partner-tutabel');
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-[#ffffff] text-[#f43f7e] rounded-lg font-medium hover:bg-[#fff0f5] transition-colors cursor-pointer border border-[#fbcfe8]"
                >
                  Tutabel (Infantil)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLogin('PARTNER', 'partner-armonizzare');
                    setUserRole('PARTNER', 'partner-armonizzare');
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-[#ffffff] text-[#f43f7e] rounded-lg font-medium hover:bg-[#fff0f5] transition-colors cursor-pointer border border-[#fbcfe8]"
                >
                  Armonizzare (Aromas)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLogin('PARTNER', 'partner-mishisaike');
                    setUserRole('PARTNER', 'partner-mishisaike');
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-[#ffffff] text-[#f43f7e] rounded-lg font-medium hover:bg-[#fff0f5] transition-colors cursor-pointer border border-[#fbcfe8]"
                  title="Marca sem plantão, paga taxa de diarista"
                >
                  MishiSaike (Sem plantão)
                </button>
              </div>
            </div>
          </div>
        ) : shiftPromptStep === 'START_SHIFT_PROMPT' ? (
          /* PRD Section 14: Prompt without active shift */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#fff0f5] text-[#f43f7e] flex items-center justify-center mx-auto mb-4 border border-[#fbcfe8]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-medium text-[#380c25] mb-2">
              Iniciar seu Expediente?
            </h3>
            <p className="text-xs text-[#863b63] mb-6 font-light">
              Você está entrando no sistema como{' '}
              <strong className="text-[#380c25] font-semibold">{currentPartner?.brandName}</strong>. Deseja
              assumir a operação presencial do balcão no Rio Anil Shopping agora?
            </p>

            <div className="space-y-2.5 font-mono-craft">
              <button
                type="button"
                onClick={handleConfirmStartShift}
                className="w-full solid-button !py-2.5 !px-4 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
              >
                <span>INICIAR EXPEDIENTE</span>
              </button>
              <button
                type="button"
                onClick={handleSkipShift}
                className="w-full outline-button !py-2.5 !px-4 text-xs font-medium cursor-pointer"
              >
                ENTRAR SEM EXPEDIENTE
              </button>
            </div>
          </div>
        ) : (
          /* PRD Section 14: Prompt with another active partner */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#fff0f5] text-[#f43f7e] flex items-center justify-center mx-auto mb-4 border border-[#fbcfe8]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-medium text-[#380c25] mb-2">
              Expediente em Andamento
            </h3>
            <div className="bg-[#fff0f5]/50 rounded-xl p-3 text-xs text-[#863b63] mb-4 border border-[#fbcfe8] font-mono-craft text-left">
              <p>
                <strong className="text-[#380c25]">Operador atual:</strong> {activeShift?.operatorName}
              </p>
              <p className="mt-1">
                <strong className="text-[#380c25]">Início:</strong>{' '}
                {activeShift ? new Date(activeShift.startTime).toLocaleTimeString('pt-BR') : ''}
              </p>
            </div>
            <p className="text-xs text-[#863b63] mb-6 font-light">
              Deseja solicitar a troca de expediente e assumir o balcão da loja agora?
            </p>

            <div className="space-y-2.5 font-mono-craft">
              <button
                type="button"
                onClick={handleConfirmHandover}
                className="w-full solid-button !py-2.5 !px-4 text-xs font-semibold cursor-pointer"
              >
                SOLICITAR TROCA E ASSUMIR
              </button>
              <button
                type="button"
                onClick={handleSkipShift}
                className="w-full outline-button !py-2.5 !px-4 text-xs font-medium cursor-pointer"
              >
                NÃO, APENAS CONSULTAR MEUS DADOS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
