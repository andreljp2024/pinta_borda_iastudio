import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeeRule, PaymentMethod } from '../../types';

export const FeeRulesView: React.FC = () => {
  const { feeRules, updateFeeRule, userRole } = useApp();

  const [editingRule, setEditingRule] = useState<FeeRule | null>(null);
  const [editFeePercentage, setEditFeePercentage] = useState<number>(0);

  const handleOpenEdit = (rule: FeeRule) => {
    setEditingRule(rule);
    setEditFeePercentage(rule.feePercentage);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    updateFeeRule(editingRule.id, editFeePercentage);
    setEditingRule(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Regra de Congelamento de Taxas
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Taxas de Meios de Pagamento & Maquininhas
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Parâmetros financeiros das maquininhas do balcão (Stone, Cielo, PagBank) aplicados de forma imutável em cada transação.
          </p>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif-display font-bold text-base text-amber-300">
              Garantia de Não-Retroatividade (PRD Seção 18)
            </h4>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed max-w-2xl">
              Quando uma venda é registrada no PDV, a taxa da maquininha em vigor naquele instante é gravada de forma congelada.
              Qualquer alteração posterior nas alíquotas abaixo afetará <strong>somente vendas futuras</strong>, protegendo os repasses históricos dos artesãos contra divergências contábeis.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif-display font-bold text-base text-stone-900">
              Tabela de Tarifas Vigentes
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {feeRules.length} faixas parametrizadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Terminal / Operadora</th>
                <th className="py-3 px-4 font-semibold">Modalidade</th>
                <th className="py-3 px-4 font-semibold">Bandeira</th>
                <th className="py-3 px-4 font-semibold text-center">Parcelamento</th>
                <th className="py-3 px-4 font-semibold text-right">Taxa Aplicada (%)</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {feeRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">{rule.terminalName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                      {rule.modality || rule.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-800">
                    {rule.cardBrand || 'Todas'}
                  </td>
                  <td className="py-3.5 px-4 text-center text-stone-600 font-medium">
                    {(rule.installmentsMin || rule.minInstallments || 1) === 1 &&
                    (rule.installmentsMax || rule.maxInstallments || 1) === 1
                      ? '1x (À vista)'
                      : `${rule.installmentsMin || rule.minInstallments || 1}x a ${
                          rule.installmentsMax || rule.maxInstallments || 12
                        }x`}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-sm text-stone-900">
                    {rule.feePercentage.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {userRole === 'ADMIN' ? (
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Ajustar Taxa
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400">Somente leitura</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-stone-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Ajustar Taxa de Operação
            </h3>
            <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-xl">
              <div><strong>Terminal:</strong> {editingRule.terminalName}</div>
              <div><strong>Modalidade:</strong> {editingRule.modality || editingRule.paymentMethod}</div>
              <div><strong>Faixa:</strong> {editingRule.installmentsMin || editingRule.minInstallments || 1}x a {editingRule.installmentsMax || editingRule.maxInstallments || 12}x</div>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nova Taxa Percentual (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFeePercentage}
                  onChange={(e) => setEditFeePercentage(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-sm font-bold text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Salvar Nova Alíquota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
