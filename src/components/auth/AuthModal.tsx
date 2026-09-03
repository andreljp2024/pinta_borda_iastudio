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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {shiftPromptStep === 'NONE' ? (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-white flex items-center justify-center font-serif-display font-bold text-xl mx-auto shadow-sm mb-3">
                P&B
              </div>
              <h2 className="font-serif-display text-2xl font-bold tracking-tight text-stone-900">
                PINTA E BORDA
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Gestão Compartilhada • Rio Anil Shopping
              </p>
            </div>

            {/* Profile Tab Toggle */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-6 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setTab('ADMIN');
                  setEmail('admin@pintaeborda.com.br');
                }}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'ADMIN'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
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
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                PARCEIRO
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {tab === 'PARTNER' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Selecione sua Marca / Ateliê
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => {
                      setSelectedPartnerId(e.target.value);
                      const p = partners.find((pt) => pt.id === e.target.value);
                      if (p) setEmail(p.email);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
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
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">Senha</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Recuperação de senha: Link seguro enviado ao e-mail cadastrado.');
                    }}
                    className="text-xs text-amber-800 hover:underline"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>ENTRAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demonstration Buttons */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Acesso Rápido para Avaliação:
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    handleQuickLogin('ADMIN');
                    setUserRole('ADMIN');
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-md font-medium hover:bg-purple-200 transition-colors cursor-pointer"
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
                  className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-medium hover:bg-amber-200 transition-colors cursor-pointer"
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
                  className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-medium hover:bg-amber-200 transition-colors cursor-pointer"
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
                  className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-medium hover:bg-amber-200 transition-colors cursor-pointer"
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
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-2">
              Iniciar seu Expediente?
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              Você está entrando no sistema como{' '}
              <strong className="text-stone-900">{currentPartner?.brandName}</strong>. Deseja
              assumir a operação presencial do balcão no Rio Anil Shopping agora?
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleConfirmStartShift}
                className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>INICIAR EXPEDIENTE</span>
              </button>
              <button
                type="button"
                onClick={handleSkipShift}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                ENTRAR SEM EXPEDIENTE
              </button>
            </div>
          </div>
        ) : (
          /* PRD Section 14: Prompt with another active partner */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-2">
              Expediente em Andamento
            </h3>
            <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-700 mb-4 border border-stone-200">
              <p>
                <strong>Operador atual:</strong> {activeShift?.operatorName}
              </p>
              <p className="mt-1">
                <strong>Início:</strong>{' '}
                {activeShift ? new Date(activeShift.startTime).toLocaleTimeString('pt-BR') : ''}
              </p>
            </div>
            <p className="text-sm text-stone-600 mb-6">
              Deseja solicitar a troca de expediente e assumir o balcão da loja agora?
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleConfirmHandover}
                className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                SOLICITAR TROCA E ASSUMIR
              </button>
              <button
                type="button"
                onClick={handleSkipShift}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
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
