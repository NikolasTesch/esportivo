# 🏃‍♂️ Roteiro de Apresentação Técnica & de Negócios: Corrida pela Consciência 2026
> **Guia Estratégico de Ponta a Ponta para Apresentação Executiva**
> 
> Este documento foi atualizado para focar **exclusivamente no Mercado Pago** como o nosso gateway unificado de pagamentos (processando Cartão de Crédito em até 12x e PIX). Use estas informações refinadas para demonstrar uma solução robusta, altamente lucrativa, segura e com uma operação extremamente simplificada.

---

## 💡 Dicas Gerais para o Apresentador
*   **Foco na Simplicidade e Margem:** Destaque que a unificação em um único gateway (**Mercado Pago**) simplifica a nossa conciliação financeira, reduz a manutenção do código e oferece as melhores taxas locais e prazos de recebimento flexíveis do mercado brasileiro.
*   **Demonstração Visual:** Faça referência constante aos mockups embutidos no roteiro para provar que a interface e o fluxo de checkout estão refinados e prontos.
*   **Controle de Custos:** Enfatize que o sistema roda com **custo fixo de infraestrutura praticamente zero**, cobrando taxas estritamente sobre cada transação aprovada.

---

# 📊 Estrutura Geral dos Slides (Unificada)

```mermaid
graph TD
    S1[Slide 1: Abertura & Visão Geral] --> S2[Slide 2: Experiência Visual Premium]
    S2 --> S3[Slide 3: Arquitetura & SEO de Elite (MPA)]
    S3 --> S4[Slide 4: Motor de Vendas Unificado - Mercado Pago]
    S4 --> S5[Slide 5: Segurança e RLS do Banco de Dados]
    S5 --> S6[Slide 6: Automação Pós-Pagamento & Webhook MP]
    S6 --> S7[Slide 7: Painel Adm & Business Intelligence]
    S7 --> S8[Slide 8: Análise Financeira: Taxas MP & Custos Cloud]
    S8 --> S9[Slide 9: Cronograma e Tempo de Desenvolvimento]
    S9 --> S10[Slide 10: Próximos Passos & Deploy]
```

---

## 🛝 Slide 1: Abertura e Visão Geral do Projeto
### "A Solução Completa para a Corrida pela Consciência 2026"

#### 📸 Elemento Visual Recomendado:
*   Logo do evento em cores vibrantes e o mockup da Landing Page aberta no navegador.

#### 🛠️ Instruções para o Apresentador:
> Comece a apresentação com energia. Defina claramente o propósito da plataforma: não é apenas um site informativo, mas uma máquina de conversão de inscrições com checkout financeiro integrado e retaguarda administrativa robusta.

#### 🗣️ Roteiro de Fala (Script):
> *"Bom dia [Nome do Chefe] / a todos. Gostaria de apresentar hoje o resultado do desenvolvimento da nossa nova plataforma para a **Corrida pela Consciência 2026**.*
> 
> *Este projeto foi desenvolvido com a tecnologia mais moderna do mercado hoje: **Next.js 15** e **React 19**. Nós criamos uma solução completa de ponta a ponta que resolve três grandes desafios de uma só vez: uma Landing Page de altíssimo impacto visual para atrair corredores, um ecossistema de pagamento integrado extremamente seguro para processar inscrições em segundos via **Mercado Pago**, e um Painel Administrativo em tempo real para controle financeiro e logístico da nossa equipe.*
> 
> *Além de ser um evento esportivo beneficente incrível em Florianópolis, o sistema foi desenhado de forma científica para maximizar conversões, blindar os dados dos clientes e reduzir nossos custos operacionais a quase zero."*

---

## 🛝 Slide 2: Experiência Visual e Design System Premium
### "O Fator 'WOW' que Converte Visitantes em Competidores"

#### 📸 Elemento Visual Recomendado:
*   mockup da Landing Page em Dark Mode Premium.
*   **Localização do Arquivo:** `public/landing_page_mockup.png`

![Landing Page Mockup](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/landing_page_mockup.png)
*(Caso a imagem não apareça acima, você também pode abri-la diretamente em: [landing_page_mockup.png](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/landing_page_mockup.png))*

#### 🛠️ Instruções para o Apresentador:
> Aponte para a estética moderna do mockup. Destaque o contraste de cores neon e a tipografia esportiva. Explique que o design moderno é fundamental para gerar credibilidade e urgência de compra em um público exigente.

#### 🗣️ Roteiro de Fala (Script):
> *"O primeiro contato do usuário com a marca é decisivo. Por isso, desenvolvemos uma interface sob o conceito de **Dark Mode Premium** de alta costura, fugindo do visual genérico dos concorrentes.*
> 
> *Usamos uma paleta de cores extremamente esportiva e energética: um fundo Preto Profundo e Mineral que dá profundidade e elegância, combinado com detalhes em **Amarelo e Verde Neon altamente vibrantes** para chamar a atenção para botões de inscrição e metas de conversão.*
> 
> *A tipografia combina a fonte **Anton** em formato itálico e maiúsculo para títulos — o que remete a velocidade, dinamismo e força — com a fonte **Inter** para leitura limpa e confortável.*
> 
> *Toda a experiência de navegação conta com micro-animações suaves nativas em CSS puro, proporcionando uma transição elegante e fluida em qualquer dispositivo celular ou computador, atendendo também aos padrões internacionais de acessibilidade WCAG AA de alto contraste."*

---

## 🛝 Slide 3: Construção da Página e SEO de Elite (MPA)
### "Carregamento Instantâneo e Máxima Visibilidade Orgânica"

#### 📸 Elemento Visual Recomendado:
*   Exibição do fluxo de compilação estática (`generateStaticParams` / rotas dinâmicas compiladas como SSG).
*   Visualização simplificada do arquivo de controle `sections.tsx`.

#### 🛠️ Instruções para o Apresentador:
> Explique a escolha arquitetural de Multi-Page Application (MPA) estática em vez de SPAs lentos ou páginas dinâmicas pesadas. Destaque a otimização de SEO e a facilidade de manutenção para a nossa equipe.

#### 🗣️ Roteiro de Fala (Script):
> *"Como essa página foi construída? Nós adotamos a arquitetura **MPA (Multi-Page Application) estática** baseada no **Next.js 15 App Router**.*
> 
> *Diferente de sistemas legados ou SPAs lentas de mercado que demoram para carregar, nossa plataforma pré-compila as páginas no servidor (tecnologia de **SSG - Static Site Generation**). Quando o usuário acessa `/esportivo/inscricao` ou `/esportivo/kits`, ele baixa um arquivo HTML puro e ultra-leve. O carregamento ocorre em milissegundos, o que é excelente para os critérios de Core Web Vitals do Google.*
> 
> *Cada seção possui sua própria página estática autônoma gerada de forma 100% dinâmica. Isso significa que páginas como `/esportivo/percurso` possuem tags `<title>`, meta `description` e títulos `<h1>` próprios e altamente otimizados para **SEO**. O robô de indexação do Google nos prioriza organicamente.*
> 
> *E o melhor de tudo para a manutenção comercial: aplicamos o princípio **Single Source of Truth** (Fonte Única de Verdade). Todo o conteúdo textual, preços e detalhes estão consolidados em um único arquivo de dados no código: o `sections.tsx`. Se precisarmos mudar os kits, horários ou datas, editamos apenas este arquivo e o sistema reconstrói de forma dinâmica o site, a navbar, o rodapé e até o sitemap oficial enviando aos motores de busca sem tocar em nenhuma linha de estilização ou HTML."*

---

## 🛝 Slide 4: Motor de Vendas Unificado e Lead Prevention
### "Fluxo de Inscrição Inteligente e Checkout Seguro via Mercado Pago"

#### 📸 Elemento Visual Recomendado:
*   Mockup de checkout seguro e fluxo de confirmação.
*   **Localização do Arquivo:** `public/stripe_checkout_mockup.png`

![Checkout Success Mockup](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/stripe_checkout_mockup.png)
*(Caso a imagem não apareça acima, você também pode abri-la diretamente em: [stripe_checkout_mockup.png](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/stripe_checkout_mockup.png))*

#### 🛠️ Instruções para o Apresentador:
> Destaque que unificamos a nossa solução financeira inteiramente no **Mercado Pago** para facilitar a operação comercial, oferecendo Cartão de Crédito em até 12x e PIX à vista com aprovação instantânea.

#### 🗣️ Roteiro de Fala (Script):
> *"O nosso fluxo de vendas foi projetado para ser o mais fluido, amigável e seguro do mercado nacional. Unificamos toda a nossa inteligência financeira no **Mercado Pago**, que é a maior referência em e-commerce e processamento de pagamentos na América Latina.*
> 
> *Oferecemos as duas modalidades preferidas dos atletas brasileiros, integradas em um checkout único e responsivo:*
> 
> 1.  * **Cartão de Crédito com Parcelamento em até 12x:** *Aprovação em tempo real com facilidade para o usuário.*
> 2.  * **PIX à Vista:** *Com geração instantânea do QR Code e código Copia e Cola para pagamento imediato.*
> 
> *Antes do redirecionamento para o checkout seguro do Mercado Pago, a nossa API realiza uma validação preventiva rigorosa dos dados usando a biblioteca **Zod** e realiza a gravação da inscrição no banco de dados Supabase com o status **'pendente'**.*
> 
> *Se o corredor desistir na tela de pagamento ou tiver o cartão recusado, **os dados de contato dele estão salvos** na nossa retaguarda. Isso nos dá uma lista quente de e-mails e telefones para remarketing ativo de conversão e recuperação de carrinho abandonado, o que historicamente traz até 25% a mais de faturamento para o evento."*

---

## 🛝 Slide 5: Segurança Robusta e Proteção de Dados (LGPD)
### "Blindagem da Plataforma por RLS, Sanitização e Antifraude MP"

#### 📸 Elemento Visual Recomendado:
*   Representação do fluxo de segurança do banco de dados:
    `Browser` ❌ *(Bloqueado por RLS)* ❌ ──> `Supabase Database`
    `Browser` ──> `Next.js API Server (Service Role)` ──> `Supabase Database (Bypass RLS Seguro)`

#### 🛠️ Instruções para o Apresentador:
> Tranquilize a diretoria em relação à segurança de dados sensíveis sob a perspectiva da LGPD. Explique a tecnologia de **Row Level Security (RLS)** utilizada e a robustez do antifraude do Mercado Pago.

#### 🗣️ Roteiro de Fala (Script):
> *"Em tempos de vazamentos frequentes de dados e multas severas da LGPD, a segurança foi colocada no topo da nossa lista de prioridades técnicas.*
> 
> *Nosso sistema aplica três camadas rígidas de proteção de dados sensíveis:*
> 
> * *   **Sanitização e Validação Rígida com Zod:** Nenhum dado é inserido sem validação prévia. O sistema limpa caracteres maliciosos, valida o formato de CPFs reais, telefones e e-mails no servidor antes mesmo de tocar o banco de dados, neutralizando qualquer tentativa de injeção de SQL ou scripts maliciosos.*
> * *   **Row Level Security (RLS) Ativo no Supabase:** Nossa tabela de inscrições está blindada. Habilitamos o RLS sem qualquer política de acesso público. Isso significa que **é matematicamente impossível para qualquer invasor ou crawler ler ou alterar as informações da tabela diretamente do navegador**. O banco de dados rejeita qualquer requisição externa direta.*
> * *   **Comunicação Server-to-Server Segura:** A única entidade autorizada a realizar operações de leitura e escrita é o nosso próprio servidor Next.js, utilizando um token criptografado administrativo seguro (`service_role`).*
> * *   **Antifraude Inteligente do Mercado Pago:** Para proteger as transações financeiras, o Mercado Pago utiliza o modelo de score antifraude mais robusto da América Latina. Ele cruza os dados do comprador com todo o histórico de compras e CPFs cadastrados na base do Mercado Livre. Isso bloqueia cartões clonados de forma cirúrgica e reduz drasticamente os índices de chargeback (fraudes contestadas) para o nosso evento."*

---

## 🛝 Slide 6: Automação Pós-Pagamento e Webhooks Criptografados
### "Confirmação e Comunicação em Tempo Real sem Trabalho Manual"

#### 📸 Elemento Visual Recomendado:
*   Fluxograma de processamento automático de pagamento e disparo de e-mails profissionais através da API Resend.

#### 🛠️ Instruções para o Apresentador:
> Mostre que a plataforma funciona de forma 100% autônoma após a inscrição ser paga. Menos trabalho manual significa menos custos operacionais e uma experiência de excelência para o usuário.

#### 🗣️ Roteiro de Fala (Script):
> *"A automação pós-venda garante uma experiência impecável para o cliente e elimina tarefas manuais repetitivas para a nossa equipe de operações.*
> 
> *Assim que o pagamento do PIX ou do Cartão é efetuado, o Mercado Pago dispara um **Webhook assíncrono** seguro para a nossa API. O nosso servidor valida a assinatura criptográfica para garantir que a requisição é legítima e altera o status da inscrição no banco de dados Supabase para `pago` instantaneamente.*
> 
> *Após a confirmação, o motor do sistema dispara de forma assíncrona duas automações de e-mails usando a infraestrutura do **Resend**:*
> 
> 1.  *O competidor recebe um e-mail com design premium contendo a confirmação oficial da inscrição, o tamanho da camisa e kit selecionados, comprovante de pagamento e detalhes de largada.*
> 2.  *Nossa equipe de gerenciamento recebe um e-mail de alerta em tempo real de nova venda com o valor consolidado da transação.*
> 
> *Tudo funciona de forma transparente, automatizada e 24 horas por dia."*

---

## 🛝 Slide 7: Painel Administrativo de Controle e Métricas (BI)
### "Monitoramento de Receita e Logística de Kits em Tempo Real"

#### 📸 Elemento Visual Recomendado:
*   mockup do Painel de Controle Administrativo com a tabela e cartões de receitas.
*   **Localização do Arquivo:** `public/admin_dashboard_mockup.png`

![Admin Dashboard Mockup](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/admin_dashboard_mockup.png)
*(Caso a imagem não apareça acima, você também pode abri-la diretamente em: [admin_dashboard_mockup.png](file:///c:/PASTA%20IMPORTANTE/TESCH_DEV/Landing_Page/esportivo/public/admin_dashboard_mockup.png))*

#### 🛠️ Instruções para o Apresentador:
> Apresente a tela administrativa com destaque. Explique a segurança de acesso (cookies criptografados baseados em sessão no servidor) e a facilidade operacional para a equipe planejar a compra dos kits físicos (tamanhos de camiseta) e acompanhar a arrecadação.

#### 🗣️ Roteiro de Fala (Script):
> *"Para gerenciar essa grande engrenagem, criamos o nosso próprio **Painel Administrativo de Controle**, uma central de Business Intelligence acessível de forma restrita e segura em `/esportivo/admin`.*
> 
> *O login é protegido por autenticação robusta via senha no servidor e cookies criptografados de sessão. O painel exibe imediatamente quatro métricas dinâmicas coletadas diretamente do Supabase:*
> 
> * *   **Total de Inscrições:** Volume geral de captação.*
> * *   **Inscrições Confirmadas (Pagas):** Nossos atletas oficiais.*
> * *   **Inscrições Pendentes:** Pessoas interessadas que pararam no checkout — a lista rica de e-mails para remarketing direto.*
> * *   **Total Arrecadado:** Somatório monetário de todas as transações bem-sucedidas em Reais (BRL), atualizado na hora.*
> 
> *Abaixo das métricas, temos a tabela completa de competidores que permite à nossa equipe operacional filtrar em tempo real os pagamentos e consultar detalhes logísticos vitais: Provas (5K, 10K, 21K), kit selecionado, CPF e tamanho de camiseta. Esse controle nos dá uma precisão cirúrgica na hora de encomendar o número exato de camisetas físicas e medalhas do fornecedor, evitando sobras ou faltas."*

---

## 🛝 Slide 8: Análise Financeira (Taxas Mercado Pago & Nuvem)
### "Taxas Competitivas, Recebimento Flexível e Custo de Servidor Zero"

#### 📸 Elemento Visual Recomendado:
*   Tabela com o resumo financeiro dos custos de nuvem e taxas transacionais do Mercado Pago.

#### 🛠️ Instruções para o Apresentador:
> Este slide detalha o custo de operação comercial. Destaque a flexibilidade de saques do Mercado Pago e o fato de que a nossa arquitetura serverless custa zero fixo por mês.

#### 📊 Resumo de Taxas Comerciais do Mercado Pago:

| Canal de Pagamento | Taxa Transacional | Prazo de Recebimento (Liberação do Saldo) |
| :--- | :--- | :--- |
| **Pix Instantâneo** | **0,99%** *(A taxa mais barata do mercado)* | **D+0** *(Imediato na hora)* |
| **Cartão de Crédito (Vista)** | **4,99%** | **D+0** *(Disponibilidade imediata para saque)* |
| **Cartão de Crédito (Vista)** | **3,99%** | **D+14** *(Disponibilidade em 14 dias)* |
| **Cartão de Crédito (Vista)** | **3,19%** | **D+30** *(Melhor taxa para recebimento padrão)* |
| **Parcelamento (até 12x)** | Configuração flexível | O cliente escolhe repassar a taxa de juros automaticamente para o comprador (corredor) ou absorver para si. |

#### 🗣️ Roteiro de Fala (Script):
> *"O nosso modelo econômico foi desenhado de forma extremamente competitiva, garantindo margens saudáveis para o evento.*
> 
> *A infraestrutura de servidores em nuvem segue a filosofia **Serverless**, o que significa que o custo fixo mensal para manter a plataforma rodando é **Zero** em fase inicial de escala!*
> 
> * *   **Hospedagem (Vercel):** *Plano Hobby Gratuito para início (ou Pro por apenas $20/mês para escala comercial).*
> * *   **Banco de Dados (Supabase):** *Plano Gratuito que cobre até 500MB (suficiente para mais de 10.000 cadastros).*
> * *   **Envio de E-mails (Resend):** *Plano Gratuito de alta entregabilidade para até 3.000 e-mails/mês.*
> 
> *Em relação às taxas comerciais do Mercado Pago, a grande vantagem é a **extrema flexibilidade de fluxo de caixa** conforme a nossa necessidade:*
> 
> *   *Para o **Pix à vista**, pagamos apenas **0,99%** por transação, e o dinheiro cai na conta digital imediatamente (**D+0**).*
> *   *Para o **Cartão de Crédito**, o Mercado Pago nos permite calibrar o prazo de recebimento. Se quisermos o dinheiro liberado imediatamente na conta digital (**D+0**), pagamos **4,99%**. Se planejarmos um fluxo de caixa mais tranquilo e aceitarmos sacar em **D+30**, a taxa despenca para apenas **3,19%**, uma das mais baratas do país para checkout de e-commerce.*
> *   *No parcelamento, a plataforma permite configurar o checkout de modo que os juros da operadora sejam repassados de forma automatizada ao comprador (corredor), mantendo o nosso recebimento integral.*
> 
> *Essa unificação de taxas simplifica a nossa conciliação de extratos e reduz custos bancários."*

---

## 🛝 Slide 9: Cronograma e Tempo de Desenvolvimento
### "Do Planejamento ao Lançamento em Apenas 3 Semanas"

#### 📸 Elemento Visual Recomendado:
*   Linha do tempo vertical mostrando as fases do desenvolvimento do software.

#### 🗣️ Roteiro de Fala (Script):
> *"Para colocarmos uma solução desse nível técnico e de segurança no ar com equipe ágil, dividimos o projeto em um cronograma estratégico de **3 semanas (cerca de 100 horas de engenharia)**:*
> 
> * *   **Semana 1: Infraestrutura de Dados & Identidade Visual (Fase de Fundação)**
>     *   *Modelagem do banco de dados Supabase e criação da tabela blindada com RLS.*
>     *   *Construção do Design System premium (Anton & Inter fonts, Dark Mode e paleta de cores hex neon).*
>     *   *Layout base responsivo para celulares e computadores.*
> * *   **Semana 2: Engenharia de Pagamentos & Validação de Entrada (Fase Core)**
>     *   *Construção do endpoint de API Serverless integrado ao SDK do Mercado Pago (Card & Pix).*
>     *   *Criação dos formulários de inscrições com filtros de kits e tamanhos de camisa com validação preventiva Zod.*
>     *   *Programação e tratamento dos Webhooks criptografados do Mercado Pago para atualização de transações.*
> * *   **Semana 3: Retaguarda Administrativa & Automação de E-mails (Fase de Entrega)**
>     *   *Desenvolvimento do Painel Administrativo de Controle com cards de receitas dinâmicos e filtros de status.*
>     *   *Desenvolvimento de cookies criptografados de segurança para autenticação do Admin.*
>     *   *Integração e design dos modelos de e-mails transacionais utilizando o Resend.*
>     *   *Homologação de ponta a ponta com simulação de pagamentos no ambiente sandbox.*
> 
> *Esse desenvolvimento ágil e em componentes modulares garante a extrema manutenibilidade futura do sistema, com código limpo e de fácil manutenção."*

---

## 🛝 Slide 10: Próximos Passos e Deploy de Produção
### "Prontos para Abrir o Cronômetro de Vendas"

#### 📸 Elemento Visual Recomendado:
*   Lista dinâmica de tarefas de lançamento marcadas como prontas ou a caminho.

#### 🗣️ Roteiro de Fala (Script):
> *"O nosso sistema já está completamente construído e com todas as verificações estáticas de tipo de dados validadas em produção. O fluxo de simulação de pagamentos está homologado.*
> 
> *Para darmos início oficial às vendas reais públicas do evento, restam apenas tarefas de configuração comercial em produção:*
> 
> 1.  *Obter as chaves de credenciamento de produção (Access Token e Public Key) do painel de desenvolvedores do Mercado Pago do cliente final.*
> 2.  *Ativar a URL de webhook real de produção no painel do Mercado Pago para escutar os eventos de notificação IPN.*
> 3.  *Homologar os registros de DNS de e-mail no painel do Resend para autorizar e-mails do domínio profissional próprio do cliente.*
> 4.  *Configurar as variáveis secretas de ambiente no servidor Vercel e apontar o domínio definitivo do evento.*
> 
> *Essas etapas finais demoram poucas horas e exigem zero modificações de código, nos deixando prontos para o lançamento e sucesso absoluto de inscrições na Corrida pela Consciência 2026.*
> 
> *Abro agora o espaço para perguntas e feedback de todos. Muito obrigado!"*

---

### 🛡️ Resumo da Stack de Tecnologia & Compliance (Cola para Perguntas Difíceis)
Caso a comissão de segurança ou engenharia de TI faça perguntas técnicas difíceis, use esta tabela rápida para respostas imediatas:

| Tópico | Tecnologia | Mecanismo de Defesa / Vantagem Comercial |
| :--- | :--- | :--- |
| **Proteção contra Fraudes** | MP Anti-fraud Engine | Machine learning que analisa o comportamento do usuário e cruza dados históricos de compras do Mercado Livre para travar chargebacks. |
| **Vazamento de CPFs** | Supabase RLS | O navegador nunca possui acesso direto à tabela de dados. Toda a leitura é filtrada por API restrita no servidor. |
| **Ataque de Força Bruta** | Cookies HttpOnly | O cookie administrativo possui o parâmetro `HttpOnly` e criptografia forte no servidor, inviabilizando XSS. |
| **Velocidade de Página** | Next.js SSG | O navegador baixa HTML pré-pronto do servidor, eliminando queries pesadas de banco de dados no carregamento inicial. |
| **Validação de Cadastro** | Zod Engine | Impede inscrição de CPFs inválidos ou campos nulos que quebram a contagem de camisetas e medalhas. |
| **Simplicidade Logística** | Único Webhook MP | Centraliza todos os avisos de pagamento (Pix e Cartão) em um único receptor, simplificando os extratos de contabilidade. |
