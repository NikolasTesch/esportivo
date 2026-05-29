# Corrida pela Consciência 2026 — Plataforma de Inscrições

Plataforma completa desenvolvida em **Next.js 15 (App Router)** e **React 19** para a Corrida pela Consciência 2026 — evento esportivo beneficente realizado na orla de Florianópolis em 12 de julho de 2026. Parte da arrecadação é revertida ao **Instituto Reviva**.

A plataforma inclui: landing page de alta conversão, fluxo de inscrições com pagamento via **Mercado Pago** (cartão + Pix), banco de dados em **Supabase**, emails transacionais com **Resend**, painel administrativo e animações com **Framer Motion**.

---

## Identidade Visual

Estética escura, esportiva e energética:

- **Fundo:** Preto profundo (`#0B0B0C`, `#000000`)
- **Destaque primário:** Amarelo/verde neon (`#D6FF3F`)
- **Acento secundário:** Laranja (`#FF5A1F`)
- **Tipografia:** Anton (headlines) + Inter (corpo de texto)
- **Animações:** Framer Motion com `prefers-reduced-motion` respeitado

---

## Arquitetura

O projeto é um **MPA (Multi-Page Application)** em Next.js:

- **`/esportivo`** — overview com todas as seções da landing page
- **`/esportivo/inscricao`** — formulário de inscrição
- **`/esportivo/admin`** — painel administrativo (protegido por senha)
- **`/contratar`** — venda do serviço de criação de LPs (Stripe)

A regra de ouro: para alterar conteúdo ou seções da landing, edite **somente `src/app/esportivo/sections.tsx`**. Nav, SEO e sitemap se regeneram automaticamente.

---

## Fluxo de Inscrição (Mercado Pago)

```
Formulário /esportivo/inscricao
  → POST /api/esportivo/checkout
      ├── Valida dados (Zod)
      ├── Salva no Supabase (status='pendente')
      └── Cria preferência Mercado Pago
  → Mercado Pago Checkout (cartão + Pix unificados)
  → /esportivo/inscricao/sucesso
  → POST /api/webhooks/mercadopago (assíncrono)
      ├── Atualiza Supabase (status='pago')
      ├── Email de confirmação ao participante (Resend)
      └── Alerta de nova inscrição ao admin (Resend)
```

**Modelo de preços:**
| Opção | Valor |
|---|---|
| Inscrição base | R$ 80,00 |
| Kit Básico | incluso |
| Kit Premium | +R$ 89,00 |
| Kit Embaixador | +R$ 169,00 |

**Distâncias:** 5K · 10K · 21K

---

## Stack

| Componente | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | ^15.1.0 |
| UI | React (Server Components) | ^19.0.0 |
| Estilização | Tailwind CSS | ^3.4.1 |
| Animações | Framer Motion | ^12.0.0 |
| Pagamento (inscrições) | Mercado Pago SDK | latest |
| Pagamento (contratação) | Stripe SDK | ^22.1.1 |
| Banco de dados | Supabase JS | ^2.45.4 |
| Email | Resend SDK | ^6.12.3 |
| Validação | Zod | ^4.4.3 |
| Testes | Vitest | latest |
| Ícones | Lucide React | ^0.469.0 |
| Linguagem | TypeScript | ^5 |

---

## Estrutura de Diretórios

```
src/
├── __tests__/               Testes Vitest (checkout, esportivo, webhook)
├── app/
│   ├── api/
│   │   ├── checkout/        Stripe — fluxo /contratar
│   │   ├── esportivo/
│   │   │   ├── checkout/    Mercado Pago — fluxo inscrição
│   │   │   └── admin/       Login/logout do painel admin
│   │   └── webhooks/
│   │       ├── mercadopago/ Confirmação de pagamento MP
│   │       └── stripe/      Confirmação de pagamento Stripe
│   ├── esportivo/
│   │   ├── admin/           Dashboard + tela de login
│   │   ├── inscricao/       Formulário + página de sucesso
│   │   ├── layout.tsx       Nav, footer e tema
│   │   ├── page.tsx         Overview (todas as seções)
│   │   ├── sections.tsx     SINGLE SOURCE OF TRUTH — conteúdo
│   │   └── motion.tsx       Wrappers Framer Motion
│   ├── contratar/           Venda do serviço (Stripe)
│   └── sitemap.ts           Sitemap automático
├── lib/
│   ├── esportivo.ts         Domínio: pricing, validação, constantes
│   ├── mercadopago.ts       Integração Mercado Pago
│   ├── stripe.ts            Integração Stripe
│   ├── supabase.ts          Cliente Supabase + tipos
│   ├── email.ts             Helpers Resend
│   ├── env.ts               getEnv / requireEnv
│   ├── admin-auth.ts        Autenticação do painel admin
│   └── infinitepay.ts       Legado — Pix InfinitePay
└── components/
    └── PricingSection.tsx   Seção de preços (/contratar)
```

---

## Variáveis de Ambiente

Crie `.env.local` na raiz com:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mercado Pago (inscrições esportivo)
# Use TEST- para sandbox, APP_USR- para produção
MERCADOPAGO_ACCESS_TOKEN=TEST-...

# Stripe (fluxo /contratar)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ONETIME=price_...
STRIPE_PRICE_SUBSCRIPTION=price_...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_ADMIN=voce@exemplo.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Painel Admin
ADMIN_PASSWORD=senha-forte-aqui
```

> **Atenção:** nunca commite `.env.local`. O `.gitignore` já o protege.

---

## Instalação e Execução Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
No console do Supabase, acesse **SQL Editor > New Query**, cole o conteúdo de `supabase/schema.sql` e execute. Isso cria a tabela `inscricoes` com RLS habilitado.

### 3. Rodar em desenvolvimento
```bash
npm run dev
```
Disponível em [http://localhost:3000](http://localhost:3000).

### 4. Testar webhooks localmente

**Mercado Pago** — use o painel de testes do MP ou um cliente HTTP (ngrok + Postman) para simular notificações em `/api/webhooks/mercadopago`.

**Stripe** (fluxo `/contratar`) — use a Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copie o `whsec_...` exibido e cole em `STRIPE_WEBHOOK_SECRET`.

### 5. Executar testes
```bash
npm run test          # modo watch
npm run test:run      # execução única (CI)
```

---

## Build de Produção

```bash
npx tsc --noEmit
rm -rf .next && npm run build
```

Espera-se que `/esportivo/[secao]` apareça como `● (SSG)` e `/api/*` como `ƒ (Dynamic)`.

---

## Checklist para Produção

- [ ] Substituir `MERCADOPAGO_ACCESS_TOKEN` de `TEST-` para `APP_USR-`
- [ ] Substituir chaves Stripe de `sk_test`/`pk_test` para `sk_live`/`pk_live`
- [ ] Configurar webhook Mercado Pago no painel MP apontando para `https://seu-dominio.com/api/webhooks/mercadopago`
- [ ] Configurar webhook Stripe no dashboard apontando para `https://seu-dominio.com/api/webhooks/stripe` (evento: `checkout.session.completed`)
- [ ] Validar domínio no painel Resend e atualizar `EMAIL_FROM`
- [ ] Definir `NEXT_PUBLIC_APP_URL` com o domínio definitivo
- [ ] Alterar `ADMIN_PASSWORD` para senha de alta complexidade
- [ ] Criar `robots.txt` para regular indexação

---

## Painel Administrativo

Acesse `/esportivo/admin` com a senha configurada em `ADMIN_PASSWORD`.

Funcionalidades:
- Métricas: total de inscrições, pagos, pendentes, valor arrecadado
- Tabela com filtros por status (pago / pendente / cancelado)
- Dados completos: nome, email, CPF, distância, kit, camiseta, faixa etária
