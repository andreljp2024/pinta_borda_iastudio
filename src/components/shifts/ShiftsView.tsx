import React, { useState } from 'react';
import {
  Clock,
  Play,
  Square,
  ArrowRightLeft,
  CheckCircle2,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShiftsView: React.FC = () => {
  const {
    shifts,
    activeShift,
    partners,
    currentPartner,
    userRole,
    startShift,
    endShift,
    requestShiftHandover,
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : partners[0]?.id || ''
  );
  const [operatorName, setOperatorName] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.ownerName : 'Artesão em Plantão'
  );
  const [notes, setNotes] = useState<string>('');
  const [showStartModal, setShowStartModal] = useState<boolean>(false);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);

  const handleStartShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (!partner) return;

    startShift(partner.id, `${operatorName} (${partner.brandName})`, notes);
    setShowStartModal(false);
    setNotes('');
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (!partner) return;

    requestShiftHandover(partner.id, `${operatorName} (${partner.brandName})`);
    setShowHandoverModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b56f55] font-mono-craft">
            Escala & Presença
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#253a35]">
            Gestão de Expedientes (Plantão)
          </h2>
          <p className="text-xs sm:text-sm text-[#52615a] mt-1 font-light">
            Controle de turnos operacionais no balcão da loja do Rio Anil Shopping.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-craft">
          {activeShift ? (
            <>
              <button
                onClick={() => setShowHandoverModal(true)}
                className="outline-button !py-2 !px-3.5 text-xs flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-4 h-4 text-[#b56f55]" />
                Passar Plantão
              </button>
              <button
                onClick={() => {
                  if (confirm('Deseja realmente encerrar o expediente do balcão agora?')) {
                    endShift(activeShift.id, 'Encerrado pelo operador.');
                  }
                }}
                className="solid-button !py-2 !px-3.5 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Encerrar Expediente
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowStartModal(true)}
              className="solid-button !py-2.5 !px-4 text-xs flex items-center gap-2 shadow-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Novo Expediente
            </button>
          )}
        </div>
      </div>

      {/* Active Shift Card */}
      <div className="bg-[#fffaf2] rounded-3xl p-6 border border-[#ded6ca] shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#ded6ca]">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${activeShift ? 'bg-[#3c6b54] animate-pulse' : 'bg-[#ded6ca]'}`} />
            <h3 className="font-display font-medium text-lg text-[#253a35]">
              {activeShift ? 'Expediente em Andamento Agora' : 'Nenhum Expediente Ativo'}
            </h3>
          </div>
          {activeShift && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#dff0e6] text-[#1f4e38] rounded-full border border-[#bcdbc7] font-mono-craft">
              Operando Balcão
            </span>
          )}
        </div>

        {activeShift ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div>
              <span className="text-[11px] text-[#7d8c83] uppercase font-semibold font-mono-craft">Operador Atual</span>
              <div className="text-base font-bold text-[#253a35] mt-0.5 font-display">{activeShift.operatorName}</div>
              <span className="text-xs text-[#b56f55] font-medium font-mono-craft">{activeShift.partnerName}</span>
            </div>

            <div>
              <span className="text-[11px] text-[#7d8c83] uppercase font-semibold font-mono-craft">Entrada</span>
              <div className="text-base font-bold text-[#253a35] mt-0.5 font-mono-craft">
                {new Date(activeShift.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="text-xs text-[#7d8c83] font-mono-craft">
                {new Date(activeShift.startTime).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#7d8c83] uppercase font-semibold font-mono-craft">Vendas no Turno</span>
              <div className="text-base font-bold text-[#253a35] mt-0.5 flex items-center gap-1.5 font-mono-craft">
                <ShoppingBag className="w-4 h-4 text-[#7d8c83]" />
                {activeShift.salesCount} vendas
              </div>
              <span className="text-xs text-[#7d8c83] font-mono-craft">registradas no PDV</span>
            </div>

            <div>
              <span className="text-[11px] text-[#7d8c83] uppercase font-semibold font-mono-craft">Volume Movimentado</span>
              <div className="text-lg font-bold text-[#1f4e38] mt-0.5 font-mono-craft">
                R$ {activeShift.totalSalesAmount.toFixed(2).replace('.', ',')}
              </div>
              <span className="text-xs text-[#7d8c83] font-mono-craft">faturamento coletivo</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-[#52615a] text-xs sm:text-sm font-light">
            O balcão presencial no Rio Anil Shopping está aguardando abertura de turno.
            <div className="mt-4">
              <button
                onClick={() => setShowStartModal(true)}
                className="solid-button !py-2.5 !px-5 text-xs shadow-xs"
              >
                Abrir Expediente Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shifts History Table (PRD Section 13 e 29.3) */}
      <div className="bg-[#fffaf2] rounded-3xl border border-[#ded6ca] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#ded6ca] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#b56f55]" />
            <h3 className="font-display font-medium text-base text-[#253a35]">
              Histórico de Expedientes & Plantões
            </h3>
          </div>
          <span className="text-xs text-[#7d8c83] font-mono-craft">
            {shifts.length} expedientes registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ede5d8]/60 border-b border-[#ded6ca] text-[#52615a] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Data & Turno</th>
                <th className="py-3 px-4 font-semibold">Operador / Marca</th>
                <th className="py-3 px-4 font-semibold">Entrada - Saída</th>
                <th className="py-3 px-4 font-semibold">Duração</th>
                <th className="py-3 px-4 font-semibold text-center">Vendas</th>
                <th className="py-3 px-4 font-semibold text-right">Volume</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ded6ca] text-[#253a35]">
              {shifts.map((shift) => {
                const isOngoing = shift.status === 'ATIVO';
                return (
                  <tr key={shift.id} className="hover:bg-[#ede5d8]/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#253a35] font-mono-craft">
                      {new Date(shift.startTime).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#253a35] font-display">{shift.operatorName}</div>
                      <div className="text-[10px] text-[#b56f55] font-mono-craft">{shift.partnerName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-craft text-[#52615a]">
                      {new Date(shift.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {shift.endTime
                        ? new Date(shift.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        : 'Em andamento'}
                    </td>
                    <td className="py-3 px-4 text-[#7d8c83] font-mono-craft">
                      {shift.durationMinutes ? `${Math.round(shift.durationMinutes / 60)}h ${shift.durationMinutes % 60}m` : 'Ativo'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#253a35] font-mono-craft">
                      {shift.salesCount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#253a35] font-mono-craft">
                      R$ {shift.totalSalesAmount.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-craft ${
                          isOngoing
                            ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                            : 'bg-[#ede5d8] text-[#52615a]'
                        }`}
                      >
                        {shift.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Shift Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#253a35]/60 backdrop-blur-xs p-4">
          <div className="bg-[#fffaf2] rounded-3xl max-w-md w-full shadow-2xl border border-[#ded6ca] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-display font-medium text-lg text-[#253a35]">
              Iniciar Expediente no Balcão
            </h3>
            <p className="text-xs text-[#52615a] font-light">
              Informe quem é o artesão responsável pelo atendimento presencial no Rio Anil Shopping.
            </p>

            <form onSubmit={handleStartShiftSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#253a35] mb-1 font-mono-craft">Marca do Ateliê</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => {
                    setSelectedPartnerId(e.target.value);
                    const p = partners.find((pt) => pt.id === e.target.value);
                    if (p) setOperatorName(p.ownerName);
                  }}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#ded6ca] text-xs focus:outline-none"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} ({p.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#253a35] mb-1 font-mono-craft">Nome do Operador</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                  placeholder="Nome completo de quem assume"
                  className="w-full p-2.5 bg-white border border-[#ded6ca] rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#253a35] mb-1 font-mono-craft">Observações do Turno</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Turno da manhã, evento especial no shopping..."
                  rows={2}
                  className="w-full p-2 bg-white border border-[#ded6ca] rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#ded6ca] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className="px-3 py-2 text-[#52615a] hover:text-[#253a35] font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button !py-2 !px-4 text-xs font-bold cursor-pointer shadow-xs"
                >
                  Confirmar Abertura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#253a35]/60 backdrop-blur-xs p-4">
          <div className="bg-[#fffaf2] rounded-3xl max-w-md w-full shadow-2xl border border-[#ded6ca] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-display font-medium text-lg text-[#253a35]">
              Passagem de Plantão
            </h3>
            <p className="text-xs text-[#52615a] font-light">
              O turno de <strong className="text-[#253a35]">{activeShift?.operatorName}</strong> será encerrado e transferido para o novo operador.
            </p>

            <form onSubmit={handleHandoverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#253a35] mb-1 font-mono-craft">Novo Operador / Marca</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => {
                    setSelectedPartnerId(e.target.value);
                    const p = partners.find((pt) => pt.id === e.target.value);
                    if (p) setOperatorName(p.ownerName);
                  }}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#ded6ca] text-xs focus:outline-none"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} ({p.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#253a35] mb-1 font-mono-craft">Nome do Atendente</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-white border border-[#ded6ca] rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#ded6ca] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setShowHandoverModal(false)}
                  className="px-3 py-2 text-[#52615a] hover:text-[#253a35] font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button !py-2 !px-4 text-xs font-bold cursor-pointer shadow-xs"
                >
                  Confirmar Troca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
