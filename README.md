# Pinta e Borda — Casa Colaborativa & Sistema de Gestão

> Sistema integrado para gestão de quiosque colaborativo, frente de caixa (PDV multi-ateliê), acompanhamento remoto para produtoras (Portal da Artesã), controle de plantões no Rio Anil Shopping e vitrine digital com curadoria autoral de São Luís do Maranhão.

---

## 🌿 Sobre o Projeto

A **Pinta e Borda** é uma casa colaborativa localizada no **Rio Anil Shopping (Piso 2)**, em São Luís – MA. Reúne 14 ateliês e marcas autorais maranhenses de cerâmica, bordado manual, biojoias, papelaria botânica, marcenaria de resíduo e vestuário autoral em um modelo sustentável de economia criativa compartilhada.

Este ecossistema de software resolve integralmente os desafios operacionais do coletivo:
- **Rateio financeiro automático e transparente**: divisão imediata de vendas multi-ateliê no balcão, abatendo taxas de operadoras de cartão e a taxa de manutenção da casa.
- **Escala de plantões colaborativos**: gestão do revezamento de atendentes, abertura de caixa com conferência de fundo de troco, sangrias e passagem de turno.
- **Portal mobile-first da artesã**: painel de bolso para acompanhamento em tempo real das peças vendidas no shopping, saldo a repassar, alerta de reposição e escala de trabalho.
- **Vitrine digital autoral**: experiência editorial acolhedora que reflete o afeto e a identidade cultural de São Luís, com carrinho integrado e fechamento assistido via WhatsApp.
- **Painel Administrativo Modular**: layout com menu lateral em 6 agrupamentos operacionais, busca rápida de módulos, atalhos de balcão e simulação de perfis de acesso (RBAC).

---

## 🏛️ Arquitetura & Módulos da Aplicação

O sistema foi concebido em dois ambientes integrados: **Ambiente Público** (Vitrine e Dossiê) e **Ambiente de Gestão & Operação** (Dashboard com Layout Modular e Portal da Artesã).

```
Pinta e Borda
├── 🌐 Ambiente Público
│   ├── Vitrine Digital Editorial (Landing Page)
│   ├── Loja Virtual com Filtro por Ateliê
│   ├── Carrinho com Checkout WhatsApp
│   └── Dossiê Coletivo (História das 14 marcas)
│
└── 🛠️ Ambiente de Gestão (AdminDashboardLayout)
    ├── 1. Principal: Visão Geral (Métricas, Gráficos e Central de Módulos)
    ├── 2. Operações de Balcão: PDV Frente de Caixa, Vendas e Plantões & Escala
    ├── 3. Catálogo & Estoque: Estoque no Shopping e Produtos & Peças
    ├── 4. Comunidade & Ateliês: Gestão de Parceiros e Portal da Artesã (Mobile)
    ├── 5. Financeiro & Taxas: Fechamento de Repasses e Regras de Taxas
    └── 6. Inteligência & Controle: Relatórios Gerenciais e Trilha de Auditoria
```

---

### 1. Vitrine Pública & Loja Digital (`/src/components/public/`)

- **Landing Page Editorial**: Apresentação visual da casa colaborativa, manifesto do feito à mão, grid de marcas parceiras com fotografia de produto e mapa de localização no Rio Anil Shopping.
- **Vitrine de Produtos**: Catálogo completo com busca em tempo real, filtros por categoria (Bordados, Cerâmica, Biojoias, Papelaria, Decoração, Vestuário) e ordenação por preço e novidades.
- **Navegação por Ateliê**: Possibilidade de isolar a vitrine em uma única marca parceira (ideal para links na bio do Instagram das artesãs).
- **Carrinho & Checkout Assistido**: Opções de retirada presencial no balcão do shopping ou entrega local em São Luís, com geração de resumo formatado pronto para envio no WhatsApp da loja.
- **Inscrição de Novas Marcas**: Formulário integrado para captação de novas artesãs e coletivos interessados em expor no espaço.

---

### 2. Layout Modular de Gestão (`/src/components/layout/AdminDashboardLayout.tsx`)

O painel de gestão conta com uma estrutura ergonômica de navegação projetada para telas de balcão (computadores/tablets) e celulares:

- **Micro-Barra Superior de Expediente**:
  - Indicador pulsante do plantão ativo em loja física (`Operador` + `Marca Parceira`).
  - Botão de acesso rápido para abertura, passagem de turno ou fechamento de caixa.
  - Link de alternância rápida entre o painel de gestão e a vitrine pública.
- **Menu Lateral Categorizado (Sidebar)**:
  - **Filtro de Módulos**: Busca textual instantânea para encontrar qualquer tela do sistema.
  - **Badges Dinâmicos**: Contagem de alertas de estoque baixo, vendas do dia, marcação de expediente ativo e notificações não lidas.
  - **Modo Compacto & Expandido**: Recolhimento no desktop para maximizar a área útil de trabalho e gaveta deslizante (*drawer*) no mobile.
  - **Identidade do Operador**: Cartão de identificação visual com monograma e nível de acesso.
- **Header Administrativo Contextual**:
  - Breadcrumb dinâmico identificando o módulo atual.
  - Menu de **Ações Rápidas** (*Nova Venda*, *Novo Produto*, *Passar Turno*, *Consultar Repasses*).
  - Central de Notificações com badge de itens não lidos.
  - Seletor de Perfil RBAC (*Coordenação Geral* ou *Ateliê Específico*).

---

### 3. Frente de Caixa & PDV Colaborativo (`/src/components/pdv/PDVView.tsx`)

- **Carrinho Multi-Ateliê**: Permite adicionar peças de marcas diferentes em um único cupom de venda.
- **Rateio Automático de Comissões**:
  - O sistema calcula instantaneamente o subtotal bruto de cada marca.
  - Desconta a taxa da maquininha de cartão conforme a modalidade escolhida.
  - Aplica a comissão da casa colaborativa (ex.: 10%) configurada individualmente para cada artesã.
  - Registra o valor líquido exato que cada ateliê tem a receber.
- **Modalidades de Pagamento**: Pix Direto (QR Code da loja), Dinheiro (com calculadora de troco), Cartão de Débito e Cartão de Crédito (à vista ou parcelado).
- **Comprovante Digital**: Geração de comprovante da venda com detalhamento das peças, ateliês e envio automático via WhatsApp para o cliente.

---

### 4. Gestão de Plantões & Controle de Caixa (`/src/components/shifts/`)

- **Escala Colaborativa**: Grade semanal e mensal de revezamento das artesãs no atendimento presencial da loja no Rio Anil Shopping.
- **Abertura de Caixa**: Registro da atendente responsável, conferência do fundo de troco inicial e timestamp de abertura.
- **Movimentações em Dinheiro**: Registro auditado de sangrias (retiradas de numerário) e suprimentos (reforço de troco).
- **Passagem de Turno & Fechamento**: Comparativo entre as vendas registradas pelo sistema e os valores apurados fisicamente (gaveta de dinheiro e comprovantes de cartão), com checklist de conferência do balcão.

---

### 5. Catálogo de Produtos & Controle de Estoque (`/src/components/products/` e `stock/`)

- **Cadastro de Peças**: Código SKU autoral, código de barras, fotos, ateliê responsável, descrição dos materiais, custo de produção e preço de venda.
- **Estoque Mínimo & Alertas**: Sinalização imediata de produtos que atingiram a faixa crítica ou esgotaram nas prateleiras do shopping.
- **Movimentações Auditadas**: Registro de entradas de novas remessas, vendas no balcão, devoluções, perdas ou avarias com justificativa e responsável.
- **Conferência Física / Inventário**: Ferramenta de auditoria de prateleiras para conferência periódica de itens expostos vs. saldo no sistema.

---

### 6. Portal da Artesã (`/src/components/portal/ArtisanPortalView.tsx`)

Interface dedicada e otimizada para smartphones (`mobile-first`), pensada para a rotina da produtora que acompanha as vendas do seu ateliê enquanto produz em sua bancada:

- **Meu Caixa**:
  - Vendas do dia em tempo real (faturamento bruto e valor líquido a receber).
  - Previsão do próximo repasse com dedução transparente de taxas e mensalidade do nicho.
  - Dados cadastrais e chave Pix do ateliê para recebimento dos valores.
  - Feed das vendas realizadas: horário exato, atendente de plantão e peça vendida.
- **Reposição Ágil**:
  - Alerta de peças com baixo estoque nas prateleiras do shopping.
  - Registro de entrada de novas peças entregues na loja física.
  - Botão de notificação via WhatsApp diretamente para a atendente do plantão.
- **Plantões & Escala**:
  - Próximo turno agendado da artesã no Rio Anil Shopping.
  - Solicitação de troca de turno ou pedido de cobertura entre colegas.
- **Ferramentas de Divulgação**:
  - Link direto para a vitrine filtrada com apenas as peças do seu ateliê.
  - Mensagens afetuosas pré-formatadas para divulgação em redes sociais e WhatsApp.

---

### 7. Repasses Financeiros, Taxas & Rateio (`/src/components/settlements/` e `fees/`)

- **Motor de Fechamento Matemático Automatizado**:
  - Apuração periódica (quinzenal, mensal ou período customizado) das vendas não canceladas diretamente a partir do histórico de vendas do balcão.
  - Cálculo instantâneo do Total Bruto, Taxas de Maquininha Congeladas por item, Comissão Operacional da Casa (10%) e Saldo Líquido auditável.
  - Opção inteligente de abatimento de mensalidade do nicho/espaço em aberto diretamente do repasse líquido de vendas, com baixa simultânea do recebível.
- **Cobrança & Gestão de Mensalidades do Espaço**:
  - Geração em lote de mensalidades por mês de competência (ex.: `10/2026`) com data de vencimento programada com base no contrato de cada ateliê.
  - Painel de status financeiro (`ABERTO`, `PAGO`, `VENCIDO`) e registro de baixa manual ou automática.
- **Extrato Analítico & DRE da Artesã (Prestação de Contas)**:
  - Demonstrativo contábil com detalhamento transparente de cada transação: data/hora, número da venda, produto, preço unitário, alíquota de cartão congelada no ato da compra e valor líquido.
  - Botão de **Copiar Resumo Formatado para WhatsApp** para envio direto à artesã com transparência total.
  - Função de impressão e exportação rápida do extrato em padrão DRE.
- **Geração & Cópia de Lote Pix**:
  - Cópia instantânea de todas as chaves Pix e valores líquidos pendentes para liquidação bancária ágil pela coordenação do espaço.
  - Registro do código de autenticação/comprovante Pix para conferência e auditoria contábil.
- **Imutabilidade e Não-Retroatividade de Taxas (PRD Seção 18)**:
  - Tabela de taxas por terminal (Stone, PagBank, Cielo) e bandeira/parcelamento gravadas permanentemente em cada transação, prevenindo divergências contábeis em alterações futuras.

---

### 8. Inteligência, Relatórios & Auditoria (`/src/components/reports/` e `audit/`)

- **Relatórios Gerenciais**:
  - Faturamento consolidado por período (dia, semana, mês).
  - Curva ABC de produtos mais vendidos e faturamento por categoria artesanal.
  - Desempenho comparativo entre as 14 marcas parceiras.
  - Ticket médio da loja e desempenho de vendas por turno/atendente.
- **Trilha de Auditoria (Audit Logs)**:
  - Registro cronológico imutável de todas as ações sensíveis: cancelamento de vendas, ajustes manuais de estoque, alteração de taxas operacionais e trocas de turno.
  - Identificação de usuário, data, hora, IP/perfil e justificativa registrada.

---

### 9. Dossiê Coletivo Interativo (`/src/components/presentation/`)

- Apresentação visual e histórica das 14 marcas participantes da casa colaborativa.
- Fichas com história dos fundadores, técnicas artesanais aplicadas (bordado, cerâmica de alta temperatura, reaproveitamento de madeira, etc.), fotos de ateliê e manifesto poético da Pinta e Borda.

---

## 🎨 Design System & Identidade Visual

O sistema adota a identidade autoral contemporânea da **Pinta e Borda**, inspirada na vivacidade das cores maranhenses, nas tramas têxteis e no acabamento manual:

| Token Visual | Código Hex | Aplicação no Sistema |
|---|---|---|
| **Rosa Vibrante / Magenta** | `#f43f7e` / `#db2777` | Ações primárias, botões de venda, tags de frente de caixa, destaques e CTAs |
| **Vinho Profundo / Ameixa** | `#380c25` / `#420f2c` | Cabeçalhos, barra de expediente, textos de alto contraste e botões solenes |
| **Algodão Rosa / Blush Cru** | `#fff5f8` / `#fff0f5` | Fundo principal da aplicação, cartões suaves e superfícies de respiração |
| **Rosa Suave / Framboesa** | `#ff7597` / `#ffb8ce` | Indicadores de alerta, badges secundários e ornamentos de marca |
| **Bordas em Blush** | `#fbcfe8` | Linhas divisórias elegantes, molduras de cartões e inputs |
| **Verde Sucesso / Botânico** | `#1f4e38` / `#7ec498` | Indicadores de caixa aberto, transações pagas e expediente em curso |

### Tipografia Oficial
- **Display / Títulos**: *Playfair Display* (elegante, editorial, com ênfases poéticas em itálico para a palavra *e* na assinatura `pinta e borda`).
- **Corpo de Leitura**: *DM Sans* (geometria limpa e altíssima legibilidade em telas de balcão e smartphones).
- **Métricas & Códigos**: *DM Mono* (utilizada em códigos SKU, relatórios financeiros, valores monetários e timestamps).
- **Dossiê & Manifesto**: *Cormorant Garamond* (leitura literária para citações e histórias dos ateliês).

---

## 🔐 Níveis de Acesso & Simulação RBAC

O sistema dispõe de controle de acesso baseado em papéis (*Role-Based Access Control*), permitindo alternar perfis diretamente pela interface:

1. **ADMIN (Coordenação Geral)**:
   - Visão panorâmica de todos os ateliês.
   - Gestão de contratos, mensalidades e regras de taxas.
   - Fechamento global de repasses e conferência de auditoria.
   - Cadastro e inativação de produtos e marcas parceiras.
2. **PARTNER (Marca Parceira / Artesã)**:
   - Acesso restrito aos dados do próprio ateliê.
   - Visualização do **Portal da Artesã** (vendas diárias, repasses líquidos previstos e alertas de estoque).
   - Consulta à sua escala individual de plantões no quiosque.
3. **OPERATOR (Atendente de Plantão no Balcão)**:
   - Abertura, movimentação e encerramento de caixa.
   - Registro ágil de vendas no PDV e emissão de comprovantes.
   - Consulta e recebimento de reposições de estoque.

---

## 💻 Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com classes utilitárias e design tokens customizados
- **Animações**: [Motion](https://motion.dev/) para transições de tela e estados interativos
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gráficos**: [Recharts](https://recharts.org/) para visualização de faturamento e curva de vendas
- **Efeitos de Celebração**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) na conclusão de vendas

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 18+ instalado (ou Bun / Yarn)

### 1. Clonar o Repositório e Instalar Dependências
```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/pinta-e-borda.git

# Acesse o diretório
cd pinta-e-borda

# Instale os pacotes npm
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
O sistema inicializará no endereço: `http://localhost:3000`.

### 3. Validação de Tipos e Linter
```bash
npm run lint
```
Executa a checagem rigorosa de tipos com `tsc --noEmit`.

### 4. Build de Produção
```bash
npm run build
```
Gera os arquivos otimizados e minificados no diretório `dist/`.

---

## 📖 Manual Operacional de Uso no Shopping

### 🛍️ Fluxo 1: Abertura de Caixa e Início de Plantão
1. No topo da tela, clique no botão **"Iniciar Expediente"** ou acesse **Plantões & Escala**.
2. Selecione a atendente responsável e confirme a marca parceira de plantão.
3. Informe o valor do **Fundo de Troco** disponível na gaveta física (ex.: R$ 150,00).
4. Clique em **"Abrir Expediente"**. A micro-barra superior ficará verde com o status pulsante indicando o plantão em curso.

### 💳 Fluxo 2: Realização de Venda no Balcão (PDV)
1. Acesse o menu **PDV Frente de Caixa** (ou clique no atalho do header).
2. Utilize o campo de busca ou os filtros de categoria para localizar os itens solicitados pelo cliente.
3. Clique em **"Adicionar"** para incluir peças no carrinho (podem ser de marcas diferentes).
4. Selecione a forma de pagamento: **Dinheiro**, **Pix**, **Cartão de Débito** ou **Cartão de Crédito**.
5. Em pagamentos parcelados, selecione o número de parcelas para aplicação correta da taxa de maquininha.
6. Clique em **"Concluir Venda"**.
7. O sistema gera o comprovante digital detalhado, deduz o estoque automaticamente, envia notificação para a artesã dona da peça e exibe a opção de envio por WhatsApp para o comprador.

### 📦 Fluxo 3: Recebimento de Novas Peças (Reposição de Estoque)
1. No menu **Estoque no Shopping**, localize o produto entregue pela artesã.
2. Clique no botão de **"Entrada de Estoque"**.
3. Digite a quantidade de peças entregues e a justificativa (ex.: *"Remessa lote 04 entregue pela artesã"*).
4. O saldo disponível é atualizado instantaneamente na prateleira física e na vitrine virtual.

### 🔄 Fluxo 4: Passagem de Plantão e Encerramento de Caixa
1. No final do turno, clique no botão **"Passar Plantão"** na barra superior.
2. Realize a contagem do dinheiro físico presente na gaveta e compare com o saldo esperado pelo sistema.
3. Se houver divergência, informe a justificativa no campo de observações.
4. Caso outro plantonista assuma o quiosque, selecione o próximo operador e transfira o caixa; caso a loja esteja fechando, clique em **"Encerrar Caixa do Dia"**.

---

## 🐙 Sincronização com o GitHub

### Método 1: Exportação Direta pelo Google AI Studio (Recomendado)
1. No menu de configurações do Google AI Studio, clique em **Export to GitHub**.
2. Selecione a sua organização/usuário e informe o nome do repositório desejado (ex.: `pinta-e-borda-gestao`).
3. O sistema fará o envio de todos os arquivos e histórico de desenvolvimento.

### Método 2: Via Terminal Local (Git CLI)
```bash
git init
git add .
git commit -m "feat: versão de produção com dashboard modular e portal da artesã"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pinta-e-borda.git
git push -u origin main
```

---

## 🚢 Hospedagem & Deploy para Produção

Como uma Single Page Application (SPA) construída com Vite, o Pinta e Borda pode ser publicado com extrema agilidade:

### Opção A: Vercel (Recomendada)
1. Conecte sua conta do GitHub na [Vercel](https://vercel.com).
2. Importe o repositório `pinta-e-borda`.
3. A Vercel detectará automaticamente as configurações do Vite (`npm run build` e diretório de saída `dist`).
4. Clique em **Deploy**. O sistema terá deploy contínuo (*CI/CD*) a cada commit.

### Opção B: Netlify
1. Conecte o repositório no painel da [Netlify](https://netlify.com).
2. Configure o comando de build como `npm run build` e a pasta de publicação como `dist`.
3. Adicione a regra de reescrita no arquivo `_redirects` para suportar rotas de SPA: `/* /index.html 200`.

### Opção C: Google Cloud Run (Container)
1. Clique em **Deploy to Cloud Run** nas opções do Google AI Studio.
2. O ambiente containerizado será provisionado com escalabilidade automática, certificado SSL e alta disponibilidade.

---

## 📋 Checklist para o Go-Live no Shopping

Para colocar o sistema em operação diária com múltiplas pessoas acessando simultaneamente:

- [x] **Interface e Fluxos Operacionais**: PDV multi-ateliê, Portal da Artesã, Catálogo e Relatórios prontos.
- [x] **Layout Modular do Dashboard**: Sidebar com 6 agrupamentos, busca rápida e micro-barra de expediente ativo.
- [x] **Design System e Identidade Visual**: Cores autorais Pinta e Borda (paleta vibrante e acolhedora) e tipografia editorial.
- [x] **Compilação e Tipagem Rigorosa**: Zero erros de TypeScript e build de produção aprovado.
- [ ] **Exportação para o GitHub**: Realizar o primeiro envio do código para controle de versão.
- [ ] **Publicação da URL de Produção**: Configurar o deploy contínuo na Vercel, Netlify ou Cloud Run.
- [ ] **Configuração do Domínio da Loja**: Apontar o domínio oficial (ex.: `sistema.pintaeborda.com.br` ou `pintaeborda.com.br`).
- [ ] **Banco de Dados Centralizado (Firebase Firestore)**: Conectar para que as vendas do tablet do quiosque sincronizem instantaneamente no smartphone de todas as artesãs em tempo real.
- [ ] **Treinamento das Atendentes**: Apresentar o fluxo de abertura de turno, passagem de bastão e envio de recibos no WhatsApp.

---

## 📍 Localização & Contatos Oficiais

- **Espaço Físico**: Rio Anil Shopping — Piso 2, São Luís – Maranhão
- **Instagram Oficial**: [@pintaebordaslz](https://instagram.com/pintaebordaslz)
- **Horário de Atendimento**: Segunda a Sábado: 10h às 22h · Domingos e Feriados: 14h às 20h

