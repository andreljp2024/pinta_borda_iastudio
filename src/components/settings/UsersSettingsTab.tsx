import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppUser, SystemUserRole } from '../../types';
import { UserFormModal } from './UserFormModal';

export const UsersSettingsTab: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | SystemUserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ATIVO' | 'INATIVO'>('ALL');
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);

  const togglePinVisibility = (userId: string) => {
    setVisiblePins((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AppUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: AppUser) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário ${user.name}? Esta ação é irreversível.`)) {
      deleteUser(user.id);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)) ||
      (u.partnerName && u.partnerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ATIVO' && u.status === 'ATIVO') ||
      (statusFilter === 'INATIVO' && u.status !== 'ATIVO');

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Metrics
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === 'ATIVO').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const operatorCount = users.filter((u) => u.role === 'OPERATOR').length;
  const partnerUserCount = users.filter((u) => u.role === 'PARTNER').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fff0f5] text-[#f43f7e]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-serif font-bold text-[#380c25]">
              Gestão de Usuários & Operadores de Caixa
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Cadastre administradores, diaristas contratadas e artesãs que operam o balcão no Shopping Rio Anil.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-sm font-semibold shadow-md shadow-[#f43f7e]/20 transition-all transform active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Novo Usuário / Operador
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total de Contas</p>
          <p className="text-2xl font-serif font-bold text-[#380c25] mt-0.5">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Ativos no Sistema</p>
          <p className="text-2xl font-serif font-bold text-emerald-700 mt-0.5">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
          <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Administradores</p>
          <p className="text-2xl font-serif font-bold text-purple-800 mt-0.5">{adminCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-xs">
          <p className="text-[11px] font-bold text-[#f43f7e] uppercase tracking-wider">Operadores de Caixa</p>
          <p className="text-2xl font-serif font-bold text-[#f43f7e] mt-0.5">{operatorCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Artesãs com Acesso</p>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-0.5">{partnerUserCount}</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail ou ateliê..."
            className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-[#fff5f8] p-1 rounded-lg border border-[#fbcfe8]/50 text-xs">
            {(['ALL', 'ADMIN', 'OPERATOR', 'PARTNER'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  roleFilter === r
                    ? 'bg-[#380c25] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#380c25]'
                }`}
              >
                {r === 'ALL'
                  ? 'Todos'
                  : r === 'ADMIN'
                  ? 'Admins'
                  : r === 'OPERATOR'
                  ? 'Operadores'
                  : 'Parceiras'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ATIVO' | 'INATIVO')}
            className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white font-medium text-stone-700 focus:outline-none focus:border-[#f43f7e]"
          >
            <option value="ALL">Status: Todos</option>
            <option value="ATIVO">Somente Ativos</option>
            <option value="INATIVO">Somente Inativos</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fff5f8]/70 border-b border-stone-200 text-[#380c25] uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Usuário / Nome</th>
                <th className="px-4 py-3.5">Perfil & Ateliê</th>
                <th className="px-4 py-3.5">Contato</th>
                <th className="px-4 py-3.5">PIN de Caixa</th>
                <th className="px-4 py-3.5">Permissões</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    Nenhum usuário encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPinVisible = visiblePins[u.id];
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-stone-50/60 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover border border-[#fbcfe8]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#380c25] text-white flex items-center justify-center font-bold text-xs uppercase">
                                {u.name.substring(0, 2)}
                              </div>
                            )}
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                u.status === 'ATIVO' ? 'bg-emerald-500' : 'bg-stone-400'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">{u.name}</p>
                            {u.notes && (
                              <p className="text-[11px] text-stone-500 line-clamp-1">
                                {u.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Partner link */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : u.role === 'OPERATOR'
                                ? 'bg-pink-100 text-[#db2777] border border-pink-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {u.role === 'ADMIN'
                              ? 'Administrador'
                              : u.role === 'OPERATOR'
                              ? 'Operador(a)'
                              : 'Artesã Parceira'}
                          </span>
                          {u.partnerName && (
                            <p className="text-[11px] text-stone-600 flex items-center gap-1">
                              <Store className="w-3 h-3 text-[#f43f7e]" />
                              {u.partnerName}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <p className="text-stone-800 font-medium">{u.email}</p>
                        {u.phone ? (
                          <p className="text-[11px] text-stone-500">{u.phone}</p>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Sem telefone</span>
                        )}
                      </td>

                      {/* Cashier PIN */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded bg-stone-100 font-mono text-xs tracking-widest text-stone-700 min-w-[54px] text-center border border-stone-200">
                            {u.pinCode ? (isPinVisible ? u.pinCode : '••••') : '—'}
                          </div>
                          {u.pinCode && (
                            <button
                              type="button"
                              onClick={() => togglePinVisibility(u.id)}
                              className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                              title={isPinVisible ? 'Ocultar PIN' : 'Visualizar PIN'}
                            >
                              {isPinVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Permissions */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.permissions.canAccessPdv && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                              PDV
                            </span>
                          )}
                          {u.permissions.canManageShifts && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                              Plantão
                            </span>
                          )}
                          {u.permissions.canManageStock && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                              Estoque
                            </span>
                          )}
                          {u.permissions.canManageSettlements && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-200">
                              Repasses
                            </span>
                          )}
                          {u.permissions.canEditSettings && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-[#f43f7e] text-[10px] font-medium border border-rose-200">
                              Ajustes
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            u.status === 'ATIVO'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                          title="Clique para alternar status"
                        >
                          {u.status === 'ATIVO' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-stone-400" />
                              Inativo
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#380c25] hover:bg-stone-100 transition-colors"
                            title="Editar Usuário"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remover Usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Guidance Note */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#fff5f8] to-white border border-[#fbcfe8]/60 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#380c25] text-[#ffb8ce] shrink-0 mt-0.5">
          <KeyRound className="w-4 h-4" />
        </div>
        <div className="text-xs text-stone-600 leading-relaxed">
          <strong className="text-[#380c25] font-semibold block mb-0.5">
            Dica de Segurança para os Turnos de Caixa no Shopping Rio Anil:
          </strong>
          Cada plantonista ou operadora deve utilizar seu próprio PIN individual de 4 dígitos ao assumir o balcão. O PIN vincula as vendas efetuadas, trocas de bobina e sangrias de caixa ao operador responsável, garantindo a rastreabilidade nos relatórios de auditoria e prestação de contas aos ateliês.
        </div>
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        onSave={addUser}
        onUpdate={updateUser}
      />
    </div>
  );
};
