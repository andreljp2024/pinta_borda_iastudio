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

## 🐙 Sincronização com GitHub

Você pode conectar e sincronizar este projeto com um repositório no **GitHub** de duas formas:

### Método 1: Exportação Nativa pelo Google AI Studio (Recomendado)
1. No menu superior direito do Google AI Studio, clique no ícone de engrenagem / **Settings** (ou **Export**).
2. Selecione **"Export to GitHub"**.
3. Autorize sua conta do GitHub e selecione ou crie um repositório (ex.: `pinta-e-borda-sistema`).
4. O AI Studio enviará automaticamente todos os arquivos, commits e histórico diretamente para o seu repositório.

### Método 2: Exportação via ZIP ou Terminal Local (Git CLI)
Caso baixe o projeto compactado via **Export as ZIP**:
```bash
# 1. Descompacte o arquivo e acesse a pasta raiz
cd pinta-e-borda

# 2. Inicialize o repositório git local
git init

# 3. Adicione todos os arquivos
git add .

# 4. Crie o primeiro commit de produção
git commit -m "feat: versão de produção da casa colaborativa Pinta e Borda"

# 5. Renomeie o branch principal para main
git branch -M main

# 6. Conecte ao seu repositório remoto no GitHub
git remote add origin https://github.com/SEU-USUARIO/pinta-e-borda.git

# 7. Envie os arquivos
git push -u origin main
```

---

## 🚢 Deploy para Produção

O projeto é uma Single Page Application (SPA) de alta performance em React + Vite. Ele pode ser hospedado gratuitamente ou com custo mínimo em qualquer provedor moderno:

### Opção A: Vercel (Recomendado para SPA)
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Importe o repositório `pinta-e-borda`.
3. Configurações automáticas:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em **Deploy**. A cada novo `git push` no GitHub, a Vercel atualiza o site automaticamente em segundos com certificado SSL gratuito.

### Opção B: Netlify
1. Acesse [netlify.com](https://netlify.com) e clique em **Add new site** > **Import an existing project**.
2. Conecte ao GitHub e selecione o repositório.
3. Configure `npm run build` como build command e `dist` como publish directory.
4. Para garantir o funcionamento das rotas SPA, certifique-se de que o arquivo de redirecionamento `/* /index.html 200` esteja configurado.

### Opção C: Google Cloud Run (Container)
1. Utilize o botão **Deploy to Cloud Run** diretamente nas opções do Google AI Studio.
2. O sistema gerará um container otimizado de produção pronto para receber tráfego com domínio customizado e auto-scaling.

---

## 📋 Checklist para o Go-Live no Shopping

Para colocar o sistema em operação diária com múltiplas pessoas acessando simultaneamente:

- [x] **Interface e Fluxos Operacionais**: PDV, Portal da Artesã, Catálogo e Relatórios prontos.
- [x] **Design System e Identidade Visual**: Cores autorais ajustadas e tipografia editorial.
- [x] **Compilação e Tipagem Rigorosa**: Zero erros de TypeScript e build aprovado.
- [ ] **Exportação para o GitHub**: Realizar o primeiro envio do código para controle de versão.
- [ ] **Publicação da URL de Produção**: Configurar o deploy na Vercel, Netlify ou Cloud Run.
- [ ] **Configuração do Domínio da Loja**: Apontar o domínio oficial (ex.: `sistema.pintaeborda.com.br` ou `pintaeborda.com.br`).
- [ ] **Banco de Dados Centralizado (Firebase Firestore)**: Conectar para que as vendas do tablet do quiosque sincronizem instantaneamente no smartphone de todas as artesãs em tempo real.
- [ ] **Treinamento das Atendentes**: Apresentar o fluxo de abertura de turno, passagem de bastão e envio de recibos no WhatsApp.

---

## 📍 Localização e Contato

- **Espaço Físico**: Rio Anil Shopping — Piso 2, São Luís – MA
- **Horário de Funcionamento**: Segunda a Sábado (10h às 22h) · Domingos e Feriados (14h às 20h)
- **Instagram**: `@pintaebordaslz`
