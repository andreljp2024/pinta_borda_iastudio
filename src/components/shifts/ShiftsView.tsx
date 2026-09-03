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
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Escala & Presença
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Gestão de Expedientes (Plantão)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Controle de turnos operacionais no balcão da loja do Rio Anil Shopping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeShift ? (
            <>
              <button
                onClick={() => setShowHandoverModal(true)}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-700" />
                Passar Plantão
              </button>
              <button
                onClick={() => {
                  if (confirm('Deseja realmente encerrar o expediente do balcão agora?')) {
                    endShift(activeShift.id, 'Encerrado pelo operador.');
                  }
                }}
                className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Encerrar Expediente
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowStartModal(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Novo Expediente
            </button>
          )}
        </div>
      </div>

      {/* Active Shift Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${activeShift ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              {activeShift ? 'Expediente em Andamento Agora' : 'Nenhum Expediente Ativo'}
            </h3>
          </div>
          {activeShift && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Operando Balcão
            </span>
          )}
        </div>

        {activeShift ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div>
              <span className="text-xs text-stone-500 uppercase font-semibold">Operador Atual</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">{activeShift.operatorName}</div>
              <span className="text-xs text-amber-800 font-medium">{activeShift.partnerName}</span>
            </div>

            <div>
              <span className="text-xs text-stone-500 uppercase font-semibold">Entrada</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">
                {new Date(activeShift.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="text-xs text-stone-400">
                {new Date(activeShift.startTime).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div>
              <span className="text-xs text-stone-500 uppercase font-semibold">Vendas no Turno</span>
              <div className="text-base font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-stone-400" />
                {activeShift.salesCount} vendas
              </div>
              <span className="text-xs text-stone-400">registradas no PDV</span>
            </div>

            <div>
              <span className="text-xs text-stone-500 uppercase font-semibold">Volume Movimentado</span>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">
                R$ {activeShift.totalSalesAmount.toFixed(2)}
              </div>
              <span className="text-xs text-stone-400">faturamento coletivo</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-stone-500 text-xs sm:text-sm">
            O balcão presencial no Rio Anil Shopping está aguardando abertura de turno.
            <div className="mt-3">
              <button
                onClick={() => setShowStartModal(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Abrir Expediente Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shifts History Table (PRD Section 13 e 29.3) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              Histórico de Expedientes & Plantões
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {shifts.length} expedientes registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {shifts.map((shift) => {
                const isOngoing = shift.status === 'ATIVO';
                return (
                  <tr key={shift.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-900">
                      {new Date(shift.startTime).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{shift.operatorName}</div>
                      <div className="text-[10px] text-amber-800">{shift.partnerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(shift.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {shift.endTime
                        ? new Date(shift.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        : 'Em andamento'}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {shift.durationMinutes ? `${Math.round(shift.durationMinutes / 60)}h ${shift.durationMinutes % 60}m` : 'Ativo'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-stone-900">
                      {shift.salesCount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900">
                      R$ {shift.totalSalesAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOngoing
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Iniciar Expediente no Balcão
            </h3>
            <p className="text-xs text-stone-500">
              Informe quem é o artesão responsável pelo atendimento presencial no Rio Anil Shopping.
            </p>

            <form onSubmit={handleStartShiftSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Marca do Artesão</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => {
                    setSelectedPartnerId(e.target.value);
                    const p = partners.find((pt) => pt.id === e.target.value);
                    if (p) setOperatorName(p.ownerName);
                  }}
                  className="w-full p-2.5 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} ({p.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome do Operador</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                  placeholder="Nome completo de quem assume"
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observações do Turno</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Turno da manhã, evento especial no shopping..."
                  rows={2}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Passagem de Plantão
            </h3>
            <p className="text-xs text-stone-500">
              O turno de <strong className="text-stone-800">{activeShift?.operatorName}</strong> será encerrado e transferido para o novo operador.
            </p>

            <form onSubmit={handleHandoverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Novo Operador / Marca</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => {
                    setSelectedPartnerId(e.target.value);
                    const p = partners.find((pt) => pt.id === e.target.value);
                    if (p) setOperatorName(p.ownerName);
                  }}
                  className="w-full p-2.5 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} ({p.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome do Atendente</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowHandoverModal(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer shadow-sm"
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
