import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  DollarSign,
  Heart,
  Store,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const CollectiveGuidelinesTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const guidelines = [
    {
      icon: Heart,
      title: '1. Atendimento Autoral e Coletivo',
      rule: 'O compromisso de quem está no balcão é acolher o cliente e apresentar a história de todas as marcas com o mesmo carinho e conhecimento, sem favorecer exclusivamente o próprio ateliê.',
      details: [
        'Aprenda os diferenciais, matérias-primas e técnicas das colegas.',
        'Explique a origem maranhense e o valor do trabalho feito à mão.',
        'Ofereça embalagens de presente com a identidade afetuosa da Pinta e Borda.',
      ],
    },
    {
      icon: Clock,
      title: '2. Pontualidade e Cumprimento de Turnos',
      rule: 'O shopping possui horários rígidos e multas por atraso na abertura. Abertura obrigatória às 10h00 e fechamento às 22h00 (Domingos: 13h às 21h).',
      details: [
        'Chegar com 15 minutos de antecedência para contagem do fundo de caixa.',
        'Em caso de imprevisto, acionar o grupo de WhatsApp com antecedência mínima de 24h.',
        'A artesã que não puder comparecer arcará com a taxa da diarista substituta (R$ 50/dia).',
      ],
    },
    {
      icon: DollarSign,
      title: '3. Fundo de Caixa & Conferência no PDV',
      rule: 'A gaveta de dinheiro deve sempre iniciar o dia com exatamente R$ 100,00 em notas e moedas para troco.',
      details: [
        'Ao abrir o expediente, confira o valor e registre o início de turno no sistema.',
        'Toda venda deve ser registrada obrigatoriamente no PDV para cálculo de comissão e estoque.',
        'Não realize retiradas sem registrar no módulo de Sangria do sistema.',
      ],
    },
    {
      icon: Store,
      title: '4. Etiquetas SKU e Reposição de Estoque',
      rule: 'Nenhuma peça pode ser colocada para venda sem a etiqueta padrão contendo código de barras/SKU e preço oficial.',
      details: [
        'É expressamente proibido conceder descontos não autorizados previamente pela dona da marca.',
        'Ao repor produtos, entregue o formulário de entrada ao responsável pelo estoque.',
        'Mantenha os nichos arejados, sem amontoar produtos além da capacidade estética.',
      ],
    },
    {
      icon: ShieldCheck,
      title: '5. Taxas da Casa (10%) & Repasses Quinzenais',
      rule: 'A Pinta e Borda retém 10% sobre o valor bruto das vendas para cobrir infraestrutura coletiva, sacolas, papelaria e divulgação.',
      details: [
        'A mensalidade do espaço (R$ 350,00) vence impreterivelmente todo dia 10 de cada mês.',
        'Os repasses das vendas acontecem quinzenalmente de forma transparente via Pix direto.',
        'Cada artesã pode acompanhar suas vendas em tempo real pelo Portal da Artesã.',
      ],
    },
    {
      icon: Sparkles,
      title: '6. Cuidado com o Ambiente e Convivência',
      rule: 'A loja colaborativa é uma extensão do ateliê de cada uma. Cuidar da limpeza e da harmonia é responsabilidade compartilhada.',
      details: [
        'Mantenha a bancada do café, água e embalagens sempre limpa e organizada.',
        'Ao fechar a loja, confira se todas as luzes dos nichos e ar-condicionado foram desligados.',
        'Trate desavenças operacionais com respeito mútuo e diálogo na reunião mensal.',
      ],
    },
  ];

  const handleCopyManual = () => {
    const text = `📖 *REGIMENTO INTERNO & MANUAL DA ARTESÃ - PINTA E BORDA*\n\n` +
      guidelines
        .map(
          (g) =>
            `*${g.title}*\n${g.rule}\n${g.details.map((d) => `• ${d}`).join('\n')}`
        )
        .join('\n\n') +
      `\n\n_Pinta e Borda • Casa Colaborativa no Rio Anil Shopping_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#fff0f5] via-[#fff5f8] to-[#ffe4ee] p-5 sm:p-6 rounded-3xl border border-[#fbcfe8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white border border-[#fbcfe8] text-[#f43f7e] shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <h3 className="font-display font-medium text-[#380c25] text-lg sm:text-xl">
              Regimento Interno & Manual de Boas Práticas
            </h3>
          </div>
          <p className="text-xs text-[#863b63] mt-1 font-light max-w-xl">
            Diretrizes acordadas coletivamente entre as marcas autorais da Casa Pinta e Borda para
            assegurar a qualidade do atendimento, harmonia e transparência financeira.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyManual}
          className="solid-button !py-2 !px-4 text-xs font-mono-craft flex items-center gap-1.5 shadow-sm shrink-0 font-bold"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Manual Copiado!' : 'Copiar Regimento'}</span>
        </button>
      </div>

      {/* Guidelines Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guidelines.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#fbcfe8] p-5 shadow-2xs hover:border-[#f43f7e]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="p-2 rounded-xl bg-[#fff0f5] border border-[#fbcfe8] text-[#f43f7e]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h4 className="font-display font-medium text-[#380c25] text-base">
                    {g.title}
                  </h4>
                </div>

                <p className="text-xs text-[#863b63] font-normal leading-relaxed mb-3">
                  {g.rule}
                </p>

                <div className="bg-[#fff5f8]/60 rounded-xl p-3 border border-[#fbcfe8]/70 space-y-1.5">
                  {g.details.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-2 text-xs text-[#380c25]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1f4e38] shrink-0 mt-0.5" />
                      <span className="font-light leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
