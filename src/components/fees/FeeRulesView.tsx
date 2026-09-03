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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c85a78] font-mono-craft">
            Regra de Congelamento de Taxas
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#2e1420]">
            Taxas de Meios de Pagamento & Maquininhas
          </h2>
          <p className="text-xs sm:text-sm text-[#8e727e] mt-1 font-light">
            Parâmetros financeiros das maquininhas do balcão (Stone, Cielo, PagBank) aplicados de forma imutável em cada transação.
          </p>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="bg-[#2e1420] text-white rounded-3xl p-6 border border-[#2e1420] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ffffff]/10 text-[#dc9b86] flex items-center justify-center shrink-0 border border-[#ffffff]/15">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-medium text-lg text-[#ffffff]">
              Garantia de Não-Retroatividade (PRD Seção 18)
            </h4>
            <p className="text-xs text-[#ebd8e0] mt-1 leading-relaxed max-w-2xl font-light">
              Quando uma venda é registrada no PDV, a taxa da maquininha em vigor naquele instante é gravada de forma congelada.
              Qualquer alteração posterior nas alíquotas abaixo afetará <strong className="text-[#dc9b86] font-semibold">somente vendas futuras</strong>, protegendo os repasses históricos dos artesãos contra divergências contábeis.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#edd5dc] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#edd5dc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#c85a78]" />
            <h3 className="font-display font-medium text-lg text-[#2e1420]">
              Tabela de Tarifas Vigentes
            </h3>
          </div>
          <span className="text-xs text-[#8e727e] font-mono-craft">
            {feeRules.length} faixas parametrizadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6ebef]/70 border-b border-[#edd5dc] text-[#8e727e] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Terminal / Operadora</th>
                <th className="py-3 px-4 font-semibold">Modalidade</th>
                <th className="py-3 px-4 font-semibold">Bandeira</th>
                <th className="py-3 px-4 font-semibold text-center">Parcelamento</th>
                <th className="py-3 px-4 font-semibold text-right">Taxa Aplicada (%)</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ebef] text-[#2e1420]">
              {feeRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#f6ebef]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-display text-sm text-[#2e1420]">{rule.terminalName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-craft bg-[#f6ebef] text-[#2e1420] border border-[#edd5dc]">
                      {rule.modality || rule.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#2e1420]">
                    {rule.cardBrand || 'Todas'}
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#8e727e] font-mono-craft">
                    {(rule.installmentsMin || rule.minInstallments || 1) === 1 &&
                    (rule.installmentsMax || rule.maxInstallments || 1) === 1
                      ? '1x (À vista)'
                      : `${rule.installmentsMin || rule.minInstallments || 1}x a ${
                          rule.installmentsMax || rule.maxInstallments || 12
                        }x`}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-sm font-mono-craft text-[#2e1420]">
                    {rule.feePercentage.toFixed(2).replace('.', ',')}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {userRole === 'ADMIN' ? (
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="outline-button !py-1 !px-2.5 text-xs font-mono-craft"
                      >
                        Ajustar Taxa
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#8e727e] font-mono-craft">Somente leitura</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2e1420]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-sm w-full shadow-2xl border border-[#edd5dc] p-6 space-y-4 animate-in fade-in zoom-in-95 font-mono-craft">
            <h3 className="font-display font-medium text-lg text-[#2e1420]">
              Ajustar Taxa de Operação
            </h3>
            <div className="text-xs text-[#644855] space-y-1 bg-[#f6ebef]/70 p-3.5 rounded-2xl border border-[#edd5dc]">
              <div><strong className="text-[#2e1420]">Terminal:</strong> {editingRule.terminalName}</div>
              <div><strong className="text-[#2e1420]">Modalidade:</strong> {editingRule.modality || editingRule.paymentMethod}</div>
              <div><strong className="text-[#2e1420]">Faixa:</strong> {editingRule.installmentsMin || editingRule.minInstallments || 1}x a {editingRule.installmentsMax || editingRule.maxInstallments || 12}x</div>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2e1420] mb-1">Nova Taxa Percentual (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFeePercentage}
                  onChange={(e) => setEditFeePercentage(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full p-2.5 border border-[#edd5dc] rounded-xl text-sm font-bold text-[#2e1420] bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#edd5dc]">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button text-xs font-bold"
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
