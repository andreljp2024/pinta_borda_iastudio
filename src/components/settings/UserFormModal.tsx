import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  KeyRound,
  Store,
  Mail,
  Phone,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AppUser, SystemUserRole, UserPermissions } from '../../types';
import { useApp } from '../../context/AppContext';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: AppUser | null;
  onSave: (user: Omit<AppUser, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<AppUser>) => void;
}

const DEFAULT_PERMISSIONS_BY_ROLE: Record<SystemUserRole, UserPermissions> = {
  ADMIN: {
    canAccessPdv: true,
    canManageProducts: true,
    canManageStock: true,
    canManageSettlements: true,
    canManageShifts: true,
    canEditSettings: true,
    canPostAnnouncements: true,
    canCancelSales: true,
  },
  OPERATOR: {
    canAccessPdv: true,
    canManageProducts: false,
    canManageStock: true,
    canManageSettlements: false,
    canManageShifts: true,
    canEditSettings: false,
    canPostAnnouncements: false,
    canCancelSales: false,
  },
  PARTNER: {
    canAccessPdv: true,
    canManageProducts: true,
    canManageStock: true,
    canManageSettlements: false,
    canManageShifts: true,
    canEditSettings: false,
    canPostAnnouncements: false,
    canCancelSales: false,
  },
};

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSave,
  onUpdate,
}) => {
  const { partners } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SystemUserRole>('OPERATOR');
  const [partnerId, setPartnerId] = useState<string>('');
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO' | 'BLOQUEADO'>('ATIVO');
  const [pinCode, setPinCode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [permissions, setPermissions] = useState<UserPermissions>(
    DEFAULT_PERMISSIONS_BY_ROLE.OPERATOR
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone || '');
      setRole(userToEdit.role);
      setPartnerId(userToEdit.partnerId || '');
      setStatus(userToEdit.status);
      setPinCode(userToEdit.pinCode || '');
      setAvatarUrl(userToEdit.avatarUrl || '');
      setNotes(userToEdit.notes || '');
      setPermissions({ ...userToEdit.permissions });
    } else {
      // Reset to defaults
      setName('');
      setEmail('');
      setPhone('');
      setRole('OPERATOR');
      setPartnerId('');
      setStatus('ATIVO');
      setPinCode(Math.floor(1000 + Math.random() * 9000).toString());
      setAvatarUrl('');
      setNotes('');
      setPermissions(DEFAULT_PERMISSIONS_BY_ROLE.OPERATOR);
    }
    setErrors({});
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: SystemUserRole) => {
    setRole(newRole);
    // If not editing or user explicitly changed role, adopt recommended defaults
    setPermissions(DEFAULT_PERMISSIONS_BY_ROLE[newRole]);
    if (newRole !== 'PARTNER') {
      setPartnerId('');
    }
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateRandomPin = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setPinCode(random);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório';
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    if (pinCode && (!/^\d{4}$/.test(pinCode))) {
      newErrors.pinCode = 'O PIN de operador deve conter exatamente 4 dígitos numéricos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedPartner = partners.find((p) => p.id === partnerId);

    const payload: Omit<AppUser, 'id' | 'createdAt'> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      role,
      partnerId: partnerId || undefined,
      partnerName: matchedPartner?.name || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      status,
      pinCode: pinCode.trim() || undefined,
      permissions,
      notes: notes.trim() || undefined,
    };

    if (userToEdit && onUpdate) {
      onUpdate(userToEdit.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#fbcfe8]/40 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#380c25] to-[#59163b] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ffb8ce]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold tracking-wide">
                {userToEdit ? 'Editar Usuário / Operador' : 'Novo Usuário do Sistema'}
              </h2>
              <p className="text-xs text-[#ffb8ce]">
                Defina credenciais, nível de acesso ao PDV e permissões na Pinta e Borda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rafaela Mendes"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.name
                    ? 'border-red-500 bg-red-50/30 text-red-900 focus:border-red-600'
                    : 'border-stone-200 focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                E-mail de Acesso *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@pintaeborda.com.br"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 bg-red-50/30 text-red-900 focus:border-red-600'
                      : 'border-stone-200 focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Phone, Role, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(98) 99999-0000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Perfil de Acesso *
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as SystemUserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-[#380c25] focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15 bg-white"
              >
                <option value="ADMIN">Administrador Geral</option>
                <option value="OPERATOR">Operador(a) de Caixa</option>
                <option value="PARTNER">Artesã / Ateliê Parceiro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Status da Conta
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ATIVO' | 'INATIVO' | 'BLOQUEADO')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15 bg-white"
              >
                <option value="ATIVO">Ativo (Liberado)</option>
                <option value="INATIVO">Inativo (Pausado)</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </div>
          </div>

          {/* Row 3: Partner link (if role is PARTNER or optional) & PIN Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5 flex items-center justify-between">
                <span>Vínculo com Ateliê Parceiro</span>
                {role === 'PARTNER' && (
                  <span className="text-[10px] text-[#f43f7e] font-normal">Recomendado</span>
                )}
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <select
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-[#380c25] focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15 bg-white"
                >
                  <option value="">Sem vínculo específico (Geral)</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.ownerName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5 flex items-center justify-between">
                <span>PIN de Caixa (4 dígitos)</span>
                <button
                  type="button"
                  onClick={generateRandomPin}
                  className="text-[11px] text-[#f43f7e] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" /> Gerar PIN
                </button>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 1234"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border font-mono tracking-widest text-sm focus:outline-none transition-all ${
                    errors.pinCode
                      ? 'border-red-500 bg-red-50/30 text-red-900 focus:border-red-600'
                      : 'border-stone-200 focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15'
                  }`}
                />
              </div>
              {errors.pinCode && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.pinCode}
                </p>
              )}
              <span className="text-[11px] text-stone-400 mt-1 block">
                Usado para início rápido de turno no PDV e identificação do vendedor
              </span>
            </div>
          </div>

          {/* Granular Permissions Section */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#f43f7e]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#380c25]">
                  Permissões Granulares no Sistema
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Perfil base: <strong className="text-[#380c25]">{role}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#fff5f8]/50 p-4 rounded-xl border border-[#fbcfe8]/40">
              {[
                {
                  key: 'canAccessPdv' as const,
                  title: 'Acesso ao PDV / Caixa',
                  desc: 'Registrar vendas, consultar itens e emitir recibos',
                },
                {
                  key: 'canCancelSales' as const,
                  title: 'Cancelar / Estornar Vendas',
                  desc: 'Autorizar estorno de pagamentos e devoluções',
                },
                {
                  key: 'canManageProducts' as const,
                  title: 'Cadastrar & Editar Produtos',
                  desc: 'Criar itens, alterar preços e categorias',
                },
                {
                  key: 'canManageStock' as const,
                  title: 'Movimentações de Estoque',
                  desc: 'Entrada de peças, inventário e ajustes',
                },
                {
                  key: 'canManageShifts' as const,
                  title: 'Plantões & Trocas de Turno',
                  desc: 'Abrir/fechar caixa e assumir plantões',
                },
                {
                  key: 'canManageSettlements' as const,
                  title: 'Repasses & Mensalidades',
                  desc: 'Consultar e aprovar pagamentos a parceiras',
                },
                {
                  key: 'canPostAnnouncements' as const,
                  title: 'Publicar no Mural',
                  desc: 'Criar avisos institucionais para o coletivo',
                },
                {
                  key: 'canEditSettings' as const,
                  title: 'Configurações Globais',
                  desc: 'Alterar dados da loja, logo e parâmetros',
                },
              ].map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-stone-200/80 hover:border-[#f43f7e]/40 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={permissions[perm.key]}
                    onChange={() => handlePermissionToggle(perm.key)}
                    className="mt-0.5 rounded text-[#f43f7e] focus:ring-[#f43f7e] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#380c25]">{perm.title}</p>
                    <p className="text-[11px] text-stone-500 leading-tight">{perm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes and Avatar URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                URL da Foto de Perfil (Opcional)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#380c25] mb-1.5">
                Observações Internas
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Plantões de quarta-feira e sábados"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-sm font-semibold shadow-md shadow-[#f43f7e]/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              {userToEdit ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
