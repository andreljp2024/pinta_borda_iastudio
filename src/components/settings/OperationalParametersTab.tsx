import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Receipt,
  RotateCcw,
  Check,
  Percent,
  Calendar,
  Layers,
  Store,
  HelpCircle,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreSettings } from '../../types';

export const OperationalParametersTab: React.FC = () => {
  const { storeSettings, updateStoreSettings, partners } = useApp();

  const [formData, setFormData] = useState<StoreSettings>({ ...storeSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Calculations
  const activePartnersCount = partners.filter((p) => p.status === 'ATIVO').length;
  const estimatedMonthlyRevenue = activePartnersCount * formData.standardMonthlyFee;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#fbcfe8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fff0f5] text-[#f43f7e]">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#380c25]">
              Parâmetros Financeiros & Operacionais
            </h2>
          </div>
          <p className="text-sm text-stone-600">
            Defina mensalidades coletivas, comissão da casa, diária de plantão e regras de fechamento.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f7e] to-[#db2777] hover:from-[#e11d48] hover:to-[#be185d] text-white text-xs font-semibold shadow-md shadow-[#f43f7e]/20 flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-white" />
              Salvo com Sucesso!
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Salvar Parâmetros
            </>
          )}
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Mensalidades & Taxas */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <DollarSign className="w-4 h-4 text-[#f43f7e]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
                Regras Financeiras & Mensalidade do Coletivo
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Mensalidade Fixa Padrão (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.standardMonthlyFee}
                    onChange={(e) => handleChange('standardMonthlyFee', parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Valor cobrado mensalmente de cada artesã para custeio
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Dia de Vencimento da Mensalidade
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.monthlyFeeDueDay}
                    onChange={(e) => handleChange('monthlyFeeDueDay', parseInt(e.target.value) || 10)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Dia do mês para vencimento do boleto/PIX (Ex: dia 10)
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Taxa da Casa sobre Vendas (%) *
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-2.5 font-bold text-stone-400">%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.defaultCommissionRate}
                    onChange={(e) => handleChange('defaultCommissionRate', parseFloat(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-8 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Comissão retida pela Pinta e Borda no rateio (Padrão: 10%)
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Diária de Plantão de Balcão (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.shiftDailyFee}
                    onChange={(e) => handleChange('shiftDailyFee', parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Valor pago por dia à artesã plantonista ou diarista contratada
                </span>
              </div>
            </div>

            {/* Simulation Banner */}
            <div className="p-4 rounded-xl bg-[#fff5f8] border border-[#fbcfe8] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#380c25]">
                  Arrecadação Coletiva Estimada de Mensalidades:
                </p>
                <p className="text-[11px] text-stone-600">
                  {activePartnersCount} ateliês ativos × R$ {formData.standardMonthlyFee.toFixed(2)}
                </p>
              </div>
              <p className="text-xl font-bold text-[#f43f7e]">
                R$ {estimatedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
              </p>
            </div>
          </div>

          {/* Card: Caixa & Operação de Loja */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Store className="w-4 h-4 text-[#f43f7e]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
                Operação de Caixa & Estoque
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Fundo Fixo de Troco da Gaveta (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-400">R$</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.initialCashDrawerFloat}
                    onChange={(e) => handleChange('initialCashDrawerFloat', parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Valor em notas e moedas que deve permanecer na abertura e troca de turno
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Alerta de Estoque Mínimo (unidades)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.defaultMinStockAlert}
                  onChange={(e) => handleChange('defaultMinStockAlert', parseInt(e.target.value) || 3)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold text-[#380c25] text-sm focus:outline-none focus:border-[#f43f7e]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Notifica a artesã quando o estoque de uma peça ficar abaixo desse limite
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                  Ciclo de Repasse Financeiro
                </label>
                <select
                  value={formData.settlementFrequency}
                  onChange={(e) => handleChange('settlementFrequency', e.target.value as 'QUINZENAL' | 'MENSAL')}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-semibold text-[#380c25] bg-white focus:outline-none focus:border-[#f43f7e]"
                >
                  <option value="QUINZENAL">Quinzenal (Dias 1 e 16)</option>
                  <option value="MENSAL">Mensal (Fechamento no 1º dia útil)</option>
                </select>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Geração dos demonstrativos e transferências PIX às marcas
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer hover:bg-stone-100/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.allowDirectPixOnPdv}
                    onChange={(e) => handleChange('allowDirectPixOnPdv', e.target.checked)}
                    className="rounded text-[#f43f7e] focus:ring-[#f43f7e] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#380c25] block">
                      Permitir PIX Direto da Artesã no PDV
                    </span>
                    <span className="text-[10px] text-stone-500 block leading-tight">
                      Para vendas compostas exclusivamente por peças de uma única marca
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Thermal Receipt Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#f43f7e]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#380c25]">
                  Mensagem no Cupom de Venda
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                80mm Térmico
              </span>
            </div>

            <div className="text-xs">
              <label className="block font-bold uppercase tracking-wider text-[#380c25] mb-1">
                Frase de Rodapé do Cupom
              </label>
              <textarea
                rows={3}
                value={formData.receiptFooterMessage}
                onChange={(e) => handleChange('receiptFooterMessage', e.target.value)}
                placeholder="Ex: Obrigado por apoiar o artesanato autoral maranhense! Siga @pintaeborda.slz"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-stone-900 font-medium focus:outline-none focus:border-[#f43f7e] focus:ring-2 focus:ring-[#f43f7e]/15 text-xs"
              />
            </div>

            {/* Simulated Receipt */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Simulação do Ticket Não-Fiscal Impresso:
              </p>
              <div className="p-4 bg-amber-50/40 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-800 space-y-2 shadow-inner">
                <div className="text-center pb-2 border-b border-dashed border-stone-300">
                  <p className="font-bold text-xs uppercase text-[#380c25]">{formData.storeName}</p>
                  <p className="text-[10px] text-stone-500">{formData.shoppingName} - {formData.shoppingFloor}</p>
                  <p className="text-[10px] text-stone-500">CNPJ: {formData.document}</p>
                  <p className="text-[9px] text-stone-400 mt-1">COMPROVANTE DE VENDA NÃO FISCAL</p>
                </div>

                <div className="py-1 border-b border-dashed border-stone-300 space-y-1">
                  <div className="flex justify-between">
                    <span>1x Vela Aromática Ilha</span>
                    <span>R$ 68,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Brinco Cerâmica Mar</span>
                    <span>R$ 55,00</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-between font-bold text-xs">
                  <span>TOTAL PAGO:</span>
                  <span>R$ 123,00</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>Forma: PIX Centralizado</span>
                  <span>Operadora: Rafaela</span>
                </div>

                <div className="pt-3 pb-1 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-600 italic">
                  {formData.receiptFooterMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
