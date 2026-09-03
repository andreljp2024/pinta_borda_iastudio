# Pinta e Borda — Casa Colaborativa & Sistema de Gestão

> Sistema integrado para gestão de quiosque colaborativo, frente de caixa (PDV), acompanhamento para artesãs (Portal da Artesã) e vitrine digital com curadoria autoral de São Luís do Maranhão.

---

## 🌿 Sobre o Projeto

A **Pinta e Borda** é uma casa colaborativa localizada no **Rio Anil Shopping (Piso 2)**, em São Luís – MA. Reúne ateliês e marcas autorais maranhenses de cerâmica, bordado, biojoias, papelaria botânica, marcenaria e vestuário autoral em um espaço de economia criativa compartilhada.

Este software resolve os desafios operacionais de um coletivo de artesanato:
- **Rateio automático e transparente** de pagamentos recebidos no balcão entre múltiplos ateliês.
- **Escala de plantões colaborativos** e conferência de caixa na troca de turno.
- **Portal mobile-first da artesã** para acompanhamento remoto de vendas, estoque e repasses.
- **Vitrine digital autoral** com experiência editorial inspirada no afeto e na cultura maranhense.

---

## 🏛️ Arquitetura & Módulos da Aplicação

### 1. Vitrine Pública & Loja Digital (`/src/components/public/`)
- **Landing Page Editorial**: Apresentação da casa colaborativa, manifesto do feito à mão, carrossel de ateliês parceiros e mapa interativo do Rio Anil Shopping.
- **Vitrine Completa de Produtos**: Busca em tempo real, filtros por categoria (Bordados, Cerâmica, Biojoias, Papelaria, Decoração) e ordenação por relevância ou preço.
- **Modal de Detalhes do Produto**: Informações detalhadas da peça, ateliê de origem, materiais e tempo estimado de confecção artesanal.
- **Carrinho & Checkout Assistido**: Opções de retirada no balcão do shopping ou entrega local em São Luís, com geração de resumo pré-formatado para WhatsApp.
- **Inscrição de Novas Marcas**: Formulário para artesãs e produtoras interessadas em expor peças ou participar de edições do coletivo.

### 2. Portal da Artesã (`/src/components/portal/ArtisanPortalView.tsx`)
- **Experiência Mobile-First**: Interface otimizada para smartphones com simulador de tela integrado e seletor rápido de ateliê.
- **Meu Caixa**:
  - Vendas do dia em tempo real (líquido a receber e bruto faturado).
  - Previsão do próximo repasse quinzenal/mensal com dedução automática de taxas e manutenção de nicho.
  - Dados bancários e chave Pix da artesã para conferência.
  - Feed discriminado de cada peça vendida no balcão (horário, atendente de plantão e valor).
- **Reposição de Estoque**:
  - Alerta automático de peças esgotadas ou abaixo do estoque mínimo.
  - Lançamento ágil de entrada de novas peças entregues na loja física.
  - Botão de envio de aviso via WhatsApp diretamente para a atendente do dia.
- **Plantões & Escala**:
  - Exibição do próximo turno agendado (data, horário e colega de plantão).
  - Solicitação de troca ou solicitação de cobertura de turno.
- **Divulgação & Redes**:
  - Link exclusivo com filtro direto nas peças do ateliê para uso no Instagram.
  - Mensagens afetuosas pré-formatadas para envio a clientes no WhatsApp.

### 3. Frente de Caixa & PDV Colaborativo (`/src/components/pdv/PDVView.tsx`)
- **Venda Multi-Ateliê**: Permite adicionar ao mesmo carrinho peças de marcas diferentes com rateio financeiro automático e imediato.
- **Múltiplos Meios de Pagamento**: Pix, Dinheiro, Cartão de Débito, Cartão de Crédito à vista ou parcelado.
- **Cálculo de Descontos e Acréscimos**: Aplicação proporcional por peça ou no total da compra.
- **Comprovante de Venda**: Geração de recibo fiscal/gerencial e envio por WhatsApp.

### 4. Gestão de Plantões & Caixa (`/src/components/shifts/ShiftManagementModal.tsx`)
- **Abertura de Expediente**: Registro de atendente responsável, fundo de troco inicial e data/hora.
- **Controle de Movimentações**: Registro de sangrias (retiradas) e suprimentos (reforço de troco).
- **Fechamento e Passagem de Turno**: Conferência dos valores apurados (dinheiro físico vs. eletrônico) e checklist operacional de balcão.

### 5. Repasses, Taxas & Financeiro (`/src/components/settlements/SettlementView.tsx` & `fees/`)
- **Configuração de Taxas**: Definição de taxas por modalidade de pagamento (taxa de máquina, Pix, comissão da casa).
- **Fechamento de Período**: Consolidação de vendas por ateliê com abatimento das taxas e custo de manutenção de nicho.
- **Lote de Pagamentos Pix**: Geração de relatórios de pagamento com chaves Pix de cada produtora.

### 6. Gestão de Estoque & Auditoria (`/src/components/stock/` & `audit/`)
- **Auditoria Física**: Contagem física de peças nas prateleiras com conferência contra o saldo do sistema.
- **Log de Eventos**: Rastreabilidade de movimentações de estoque, alterações de preços e lançamentos de vendas.

### 7. Dossiê Coletivo (`/src/components/presentation/CollectiveDossierView.tsx`)
- Apresentação visual e histórica de cada uma das 14 marcas autorais participantes, perfil dos fundadores, técnicas manuais e manifesto do coletivo.

---

## 🎨 Design System & Identidade Visual

O visual do Pinta e Borda foi projetado com uma estética artesanal, calorosa e contemporânea, refletindo a riqueza cultural do Maranhão:

| Elemento | Cor / Valor | Aplicação |
|---|---|---|
| **Terracota Artesanal** | `#bd5b3e` / `#933f28` | Ações primárias, botões de destaque, ênfases afetivas e curadoria |
| **Verde Floresta** | `#1c3830` / `#24463c` | Cabeçalho, barras de status, seção de marcas e fundos solenes |
| **Linho / Algodão Cru** | `#faf7f0` / `#f3eee4` | Fundo principal, cartões suaves e superfícies respiráveis |
| **Ouro Velho / Latão** | `#e0be75` / `#c8963e` | Ícones solares, numeração de ateliês e destaques especiais |
| **Bordas Naturais** | `#e8ded0` | Divisores sutis, molduras de cartões e inputs |

### Tipografia
- **Display / Títulos**: *Playfair Display* (elegante, editorial, com ênfases poéticas em itálico).
- **Corpo de Texto**: *DM Sans* (alta legibilidade em interfaces desktop e mobile).
- **Etiquetas e Dados**: *DM Mono* (utilizada em códigos de produtos, referências, preços e status).

### Classes Utilitárias Principais
- `.brand-mark`: Monograma circular característico `p + b`.
- `.craft-card`: Cartão acolhedor com elevação suave e bordas de 20px.
- `.solid-button` / `.solid-forest-button` / `.outline-button`: Família de botões com cantos arredondados (999px) e feedback tátil ao clique.

---

## 🔐 Níveis de Acesso (RBAC)

O seletor de perfil no topo da aplicação permite alternar entre os papéis do ecossistema:

1. **ADMIN (Gestora Geral)**: Acesso irrestrito a todos os módulos, fechamentos de repasses, relatórios globais, configuração de taxas e cadastro de parceiras.
2. **OPERATOR (Atendente no Balcão)**: Foco na operação de vendas (PDV), abertura/fechamento de plantão e consulta de estoque do quiosque.
3. **PARTNER (Marca Parceira)**: Visualização restrita aos dados do próprio ateliê, com acesso direto ao **Portal da Artesã** e métricas exclusivas do seu nicho.

---

## 💻 Tecnologias Utilizadas

- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gráficos & Visualização**: [Recharts](https://recharts.org/)
- **Tipografia Web**: Google Fonts (*Playfair Display*, *DM Sans*, *DM Mono*)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ ou Bun

### Instalação das Dependências
```bash
npm install
```

### Execução em Modo de Desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento estará disponível em `http://localhost:3000`.

### Verificação de Tipos e Linter
```bash
npm run lint
```

### Compilação para Produção
```bash
npm run build
```
Os artefatos estáticos otimizados serão gerados no diretório `dist/`.

---

## 📍 Localização e Contato

- **Espaço Físico**: Rio Anil Shopping — Piso 2, São Luís – MA
- **Horário de Funcionamento**: Segunda a Sábado (10h às 22h) · Domingos e Feriados (14h às 20h)
- **Instagram**: `@pintaebordaslz`
