import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Lock,
  Calendar,
  User,
  Activity,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, userRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedEntity !== 'all' && log.entity !== selectedEntity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.userName.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, selectedEntity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f43f7e] font-mono-craft">
            Governança & Rastreabilidade Integral
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25]">
            Trilha de Auditoria do Sistema
          </h2>
          <p className="text-xs sm:text-sm text-[#9b4f76] mt-1 font-light">
            Registro cronológico e imutável de todas as ações administrativas, financeiras e de estoque.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#380c25] text-[#ffffff] rounded-xl text-xs font-mono-craft self-start sm:self-auto shadow-2xs border border-[#380c25]">
          <Lock className="w-3.5 h-3.5 text-[#ff7597]" />
          Logs Criptografados & Imutáveis
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#fbcfe8] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between font-mono-craft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9b4f76] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ação, operador ou detalhes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#fbcfe8] focus:outline-none bg-white text-[#380c25]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="p-2 text-xs bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] focus:outline-none"
          >
            <option value="all">Todas as Entidades</option>
            <option value="SALE">Vendas</option>
            <option value="SHIFT">Expedientes / Plantões</option>
            <option value="STOCK">Estoque Físico</option>
            <option value="SETTLEMENT">Repasses</option>
            <option value="MONTHLY_FEE">Mensalidades</option>
            <option value="PARTNER">Parceiros</option>
            <option value="PRODUCT">Produtos</option>
            <option value="FEE_RULE">Taxas de Máquina</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#fbcfe8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#f43f7e]" />
            <h3 className="font-display font-medium text-lg text-[#380c25]">
              Registros Auditáveis
            </h3>
          </div>
          <span className="text-xs text-[#9b4f76] font-mono-craft">
            {filteredLogs.length} eventos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fff0f5]/70 border-b border-[#fbcfe8] text-[#9b4f76] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Data / Hora</th>
                <th className="py-3 px-4 font-semibold">Usuário / Operador</th>
                <th className="py-3 px-4 font-semibold">Módulo</th>
                <th className="py-3 px-4 font-semibold">Ação Realizada</th>
                <th className="py-3 px-4 font-semibold">Detalhamento Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fff0f5] text-[#380c25]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fff0f5]/40 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#9b4f76] font-mono-craft text-[11px]">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#380c25]">
                    {log.userName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff0f5] text-[#380c25] font-mono-craft border border-[#fbcfe8]">
                      {log.entity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#380c25]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#863b63] max-w-md break-words text-[11px] font-light">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
