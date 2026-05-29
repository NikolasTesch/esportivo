# Guia do Agente — Atelier de Landing Pages (Multi-template MPA)

> Versão 3.0 — substitui a v2.0 (boilerplate de JSON único). A arquitetura
> mudou: agora são **vários templates por segmento**, cada um servido como
> **MPA** (uma rota por seção) para melhor SEO e distribuição de conteúdo.

---

## Arquitetura

Cada segmento é uma pasta em `src/app/<template>/` com **4 arquivos**:

```
src/app/<template>/
  sections.tsx        ← conteúdo (dados) + componentes de seção + registro `sections`
  layout.tsx          ← nav + footer + wrapper de tema (compartilhado por TODAS as páginas do template)
  page.tsx            ← overview: página longa única, compõe todas as seções (heading="h2")
  [secao]/page.tsx    ← rota dinâmica: 1 página estática por seção, SEO próprio (heading="h1")
```

Templates atuais: `clinica`, `barbearia`, `esportivo`, `educacional`,
`comunitario`, `academia`, `clinica-medica`. Índice em `src/app/page.tsx`.

### Como SPA vira MPA

- A **página longa** (`/clinica`) continua existindo como visão geral/overview.
- Cada seção roteável também é uma **página própria** (`/clinica/clube`), com
  `<title>`, `description` e `<h1>` exclusivos — geradas estaticamente via
  `generateStaticParams` + `generateMetadata` em `[secao]/page.tsx`.
- A nav (em `layout.tsx`) aponta para **rotas reais**, não âncoras `#`.
- `src/app/sitemap.ts` cobre todas as rotas automaticamente.

---

## 🔒 Regra de Ouro (nova)

Para mudar **conteúdo ou seções de um template, edite apenas o
`sections.tsx` daquele template.** Rotas, SEO, nav e sitemap se regeneram a
partir do array `sections` — não edite `[secao]/page.tsx`, `layout.tsx` ou
`sitemap.ts` para adicionar conteúdo.

### Anatomia de uma seção roteável

```ts
export const sections: RoutableSection[] = [
  {
    slug: 'clube',                       // vira /<template>/clube
    navLabel: 'Clube',                   // texto na nav
    metaTitle: '...',                    // <title> da página da seção (50–60 chars)
    metaDescription: '...',              // meta description (150–160 chars)
    Section: Clube,                      // componente; recebe { heading: 'h1' | 'h2' }
  },
]
```

- O componente da seção **deve** aceitar `heading?: 'h1' | 'h2'` e renderizar
  seu título principal com esse nível (use o helper `Heading`). Overview usa
  `h2`; a página isolada usa `h1`. Seções sem título visível renderizam um
  `<h1>` só quando `heading === 'h1'`.
- Seções fixas (Hero, depoimento, faixa de CTA) ficam fora do array `sections`
  e são exportadas à parte para o `page.tsx`/`[secao]/page.tsx` reusarem.

---

## Como adicionar uma SEÇÃO a um template

1. Em `sections.tsx`, crie o componente recebendo `{ heading = 'h2' }`.
2. Adicione uma entrada em `sections` com `slug`, `navLabel`, `metaTitle`,
   `metaDescription`, `Section`.
3. Se ela deve aparecer no overview, ela já entra automático (o `page.tsx`
   mapeia `sections`). Pronto — rota, nav, SEO e sitemap são automáticos.

## Como adicionar um TEMPLATE novo

1. Crie `src/app/<novo>/` com os 4 arquivos seguindo um template existente
   como molde (ex.: copie a estrutura de `clinica/`).
2. Defina tokens próprios (cores hex e fonte) — **cada template tem identidade
   visual distinta; não reaproveite a paleta de outro**.
3. Se precisar de fonte nova: adicione em `src/lib/fonts.ts` (via
   `next/font/google`, com `variable`), inclua em `fontVariables`, e crie a
   classe utilitária correspondente em `src/app/globals.css`.
4. Adicione o template em `src/app/page.tsx` (índice) e em `src/app/sitemap.ts`.

---

## Padrões obrigatórios

- **Server components** (sem `'use client'`). Interatividade só com HTML nativo
  (`<details>` para acordeão). Sem dependências novas além de `lucide-react`.
- Tema por template via classes Tailwind explícitas com valores hex
  (`bg-[#15110D]`). Fonte aplicada pela classe no wrapper do `layout.tsx`
  (`font-fraunces`, `font-oswald`, `font-archivo`, `font-space`,
  `font-bricolage`, `font-anton`, `font-spectral`) + `font-[family-name:var(--font-inter)]`
  para corpo de texto.
- SEO: todo `[secao]` exporta `generateStaticParams`, `dynamicParams = false`
  e `generateMetadata`. Mantenha `metaTitle` 50–60 chars e `metaDescription`
  150–160 chars.
- Cada página de seção precisa de **exatamente um `<h1>`** (via `heading="h1"`).
- WhatsApp/CTA: constante exportada no topo do `sections.tsx`
  (`WHATSAPP`/`MATRICULA`/`DOAR`/`AGENDAR`/`INSCRICAO`), sempre HTTPS.
- Nunca inclua segredos, tokens ou dados sensíveis.

---

## Validação e deploy

```bash
npx tsc --noEmit                 # tipos
rm -rf .next && npx next build   # build limpo (o .next pode corromper entre builds)
npm run dev                      # preview em http://localhost:3000
```

No build, cada `<template>/[secao]` deve aparecer como `● (SSG)` com a lista
de slugs prerenderizados. Defina `NEXT_PUBLIC_APP_URL` em produção para o
sitemap usar o domínio real.

---

## Fluxo de inscrições (Mercado Pago + Supabase + Resend)

O template `esportivo` possui fluxo completo de inscrições em evento:

```
/esportivo/inscricao  →  src/app/esportivo/inscricao/InscricaoForm.tsx
   POST /api/esportivo/checkout → valida (Zod) + insere Supabase (pendente)
                                  + cria preferência Mercado Pago
   /esportivo/inscricao/sucesso → página de confirmação
   POST /api/webhooks/mercadopago → confirma pagamento + atualiza Supabase
                                    + dispara emails via Resend
```

Helpers em `src/lib/`: `mercadopago.ts`, `supabase.ts`, `env.ts`
(`getEnv`/`requireEnv`), `email.ts` (`sendInscricaoConfirmacao`,
`sendAdminSaleNotification`), `admin-auth.ts`, `fonts.ts`.
Rotas `/api/*` usam `runtime = 'nodejs'`; o webhook usa `force-dynamic`.

Variáveis (ver `.env.example`, nunca commitar `.env.local`):
`NEXT_PUBLIC_APP_URL`, `MERCADOPAGO_ACCESS_TOKEN`, `RESEND_API_KEY`,
`EMAIL_FROM`, `EMAIL_ADMIN`, `NEXT_PUBLIC_SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`.

## Código legado (não usar como referência)

`src/content/current_lp.json`, `src/types/landing.ts` e os componentes
`src/components/{Hero,Navbar,Features,Testimonials,CallToAction,Footer}.tsx`
são resquícios do boilerplate v2.0 (JSON único) e **não são mais referenciados**
por nenhuma rota. Não baseie novo código neles; podem ser removidos.

---

**Última atualização**: 2026-05-29 — Mercado Pago unificado; Stripe e InfinitePay removidos.
