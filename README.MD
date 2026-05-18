# 🎯 Estrutura .claude — Guia Completo

Este diretório `.claude` define como o Claude deve se comportar, pensar e agir ao trabalhar com o **boilerplate de geração de landing pages**.

---

## 📁 Estrutura de Arquivos

```
.claude/
├── agents/                          # Agentes especializados
│   ├── landing-page-generator.yaml  # Cria landing pages
│   ├── landing-page-validator.yaml  # Valida qualidade
│   └── seo-performance-optimizer.yaml # Otimiza SEO
│
├── rules/                           # Regras obrigatórias
│   └── landing-page-rules.yaml      # 10 regras principais
│
├── skills/                          # Capacidades especializadas
│   └── landing-page-skills.yaml     # 8 habilidades técnicas
│
├── steering/                        # Direcionamento estratégico
│   └── project-steering.yaml        # Valores, prioridades, comportamento
│
├── workflows/                       # Processos automáticos
│   └── landing-page-workflows.yaml  # 7 workflows principais
│
└── README.md (este arquivo)
```

---

## 🤖 Agents (Agentes Especializados)

Cada agente tem uma responsabilidade específica e um workflow:

### 1. **landing-page-generator**
**O QUE FAZ**: Gera landing pages de alta qualidade a partir de briefings

**QUANDO ATIVADO**: Quando você submete um briefing ou URL

**PROCESSO** (9 passos):
1. Análise do briefing e extração de informações
2. Pesquisa de mercado e positioning
3. Estratégia de conteúdo e CJJ
4. Geração de copy (headlines, benefits, testimonials, FAQ)
5. Otimização de SEO (meta tags, schema)
6. Geração do JSON `current_lp.json`
7. Invoca validator agent
8. Invoca optimizer agent
9. Entrega resultado final com relatório

**SAÍDA**: `src/content/current_lp.json` 100% validado

---

### 2. **landing-page-validator**
**O QUE FAZ**: Audita qualidade, segurança, SEO, acessibilidade

**QUANDO ATIVADO**: Após geração ou sob demanda com `/validate`

**CHECKLIST** (50+ itens):
- ✅ Schema JSON vs TypeScript
- ✅ Segurança (OWASP Top 10)
- ✅ Conteúdo (headlines, benefícios, depoimentos)
- ✅ SEO (meta tags, schema, hierarquia)
- ✅ Acessibilidade (WCAG 2.1 AA)
- ✅ Performance (Core Web Vitals potencial)

**SAÍDA**: Relatório detalhado com score 0-100

**PASSING GRADE**: B (80+/100)

---

### 3. **seo-performance-optimizer**
**O QUE FAZ**: Otimiza copywriting, SEO, e performance

**QUANDO ATIVADO**: Após validação ou sob demanda com `/optimize`

**OTIMIZAÇÕES**:
- 🔤 Copywriting conversion-focused
- 🔍 SEO on-page (títulos, descriptions, schema)
- 📊 Psychology & UX (social proof, urgency)
- ⚡ Performance (images, code splitting, lazy loading)

**SAÍDA**: Before/after comparison + improvement report

---

## 📜 Rules (Regras Obrigatórias)

Arquivo: `rules/landing-page-rules.yaml`

Define as **10 regras invioláveis** do projeto:

### Regra 1: Estrutura JSON
- ✅ Respeitar 100% o schema de `src/types/landing.ts`
- ✅ Validação Zod obrigatória
- ✅ Falha no build = violação

### Regra 2: Meta Tags & SEO
- ✅ Title: 50-60 caracteres
- ✅ Description: 150-160 caracteres
- ✅ Canonical URL, Open Graph, Twitter cards

### Regra 3: Estrutura de Conteúdo
- ✅ Headlines focados em **benefício** não funcionalidade
- ✅ Benefícios com **números** de comprovação
- ✅ Depoimentos com **fotos reais** e **ratings**

### Regra 4: Copywriting
- ✅ Português brasileiro acessível
- ✅ Tom consultivo e confiante
- ✅ Sem jargão, sem superlativas não comprovadas

### Regra 5: Design System
- ✅ Cores do `current_lp.json`
- ✅ Tipografia escalada corretamente
- ✅ Spacing em grid de 4px
- ✅ Contrast WCAG AA (4.5:1)

### Regra 6: Segurança
- ✅ ZERO dados sensíveis
- ✅ Sanitização de HTML com DOMPurify
- ✅ Validação de URLs com whitelist
- ✅ OWASP Top 10 compliance

### Regra 7: Acessibilidade
- ✅ WCAG 2.1 AA obrigatório
- ✅ Alt text em todas imagens
- ✅ Keyboard navigation funcional
- ✅ Focus indicators visíveis

### Regra 8: Performance
- ✅ Core Web Vitals targets
- ✅ Images otimizadas (WebP)
- ✅ Code splitting para heavy components
- ✅ Lighthouse > 90 em tudo

### Regra 9: Informações de Contato
- ✅ Endereço completo validado
- ✅ Telefone em formato correto
- ✅ Email válido
- ✅ Horários estruturados

### Regra 10: Integridade de Código
- ✅ **ÚNICO arquivo permitido**: `src/content/current_lp.json`
- ✅ Nunca modificar componentes
- ✅ Nunca modificar types
- ✅ Build DEVE passar

---

## 💡 Skills (Habilidades Especializadas)

Arquivo: `skills/landing-page-skills.yaml`

Define **8 habilidades especializadas** que o Claude possui:

### 1. **Copywriting Conversion-Focused**
Criar headlines, subheadlines e CTAs que **convertem**

Frameworks:
- Benefício > Funcionalidade
- Pain → Solution → Proof → Action
- Gatilhos mentais éticos (reciprocidade, escassez, autoridade)

Exemplos:
- ❌ "Serviços de Estética Profissional"
- ✅ "Rejuvenesça com Segurança e Tecnologia"

---

### 2. **SEO On-Page Optimization**
Otimizar meta tags, schema, hierarquia, linking

Técnicas:
- Meta title: `[Benefício] | [Empresa] em [Localização]`
- Meta description: `[Proposta] + [Diferencial] + [Prova]`
- Schema: LocalBusiness + FAQ + AggregateRating
- H1 > H2 > H3 (sem gaps)

---

### 3. **Design System Validation**
Validar cores, tipografia, spacing, icons

Checklist:
- Colors: primary, secondary, neutral, feedback
- Contrast: WCAG AA (4.5:1 para texto)
- Typography: Tailwind scale
- Spacing: 4px grid base
- Icons: Lucide React library

---

### 4. **Security Compliance**
Detectar vulnerabilidades, validar entrada, sanitizar

OWASP Top 10:
- A01: Access Control ✅
- A02: Cryptographic Failures ✅
- A03: Injection ✅ (Zod validation)
- A05: Misconfiguration ✅ (CSP headers)
- ... (todos os 10)

---

### 5. **WCAG Accessibility**
Validar conformance com WCAG 2.1 AA

Dimensões:
- **Perceivable**: Alt text, color contrast
- **Operable**: Keyboard nav, focus indicators
- **Understandable**: Clear language, heading hierarchy
- **Robust**: Semantic HTML, ARIA labels

---

### 6. **Performance Optimization**
Otimizar Core Web Vitals e Lighthouse

Métricas:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Lighthouse: > 90 em tudo

Técnicas:
- Image optimization (WebP, lazy loading)
- Code splitting (dynamic imports)
- Critical CSS (inline)
- Defer non-critical JS

---

### 7. **Content Structure & Strategy**
Mapear customer journey e estruturar seções

Seções:
1. **Hero**: Headlines + CTA primário
2. **Benefits**: 3-5 benefícios com números
3. **About**: Histórico + números + diferencial
4. **Testimonials**: 2-5 com foto real + rating
5. **FAQ**: 3-5 perguntas + respostas concisas
6. **Contact**: Email, phone, address, hours

---

### 8. **Market & Niche Understanding**
Compreender público-alvo, dores, posicionamento

Análise:
- Quem é o público?
- Qual é a dor principal?
- Qual é a proposta de valor única?
- Quem são os competidores?
- Qual é o tom apropriado?

---

## 🎯 Steering (Direcionamento Estratégico)

Arquivo: `steering/project-steering.yaml`

Define **valores fundamentais**, **prioridades** e **comportamento** do Claude:

### Valores Fundamentais
1. **Quality First** — Qualidade sobre velocidade
2. **User Centric** — Foco no usuário final
3. **Transparency** — Honesto sobre limitações
4. **Security Paramount** — Segurança nunca é negociável

### Prioridades (por ordem)
1. **Correctness** (40%) — Código/conteúdo sempre corretos
2. **Security** (30%) — Segurança antes conveniência
3. **UX/A11y** (20%) — Acessibilidade e performance
4. **Conversion** (10%) — Otimizar ética para conversão

### Princípios de Comportamento
- Respeitar 100% as restrições (apenas `current_lp.json`)
- Validação Zod obrigatória
- Copywriting específico, nunca genérico
- Segurança primeiro, sempre
- Comunicação clara e transparente

### Resolução de Conflitos
| Conflito | Decisão | Razão |
|----------|---------|-------|
| Spec vs Request | Spec wins | É documento oficial |
| Security vs Convenience | Security wins | É paramount |
| Performance vs Feature | Performance wins | Melhor UX + SEO |
| Cant find info | Ask user | Qualidade > velocidade |

---

## 🔄 Workflows (Processos)

Arquivo: `workflows/landing-page-workflows.yaml`

Define **7 workflows principais**:

### Workflow 1: Generate Landing Page
**Disparo**: User submits briefing  
**Passos**: 9 (coleta → análise → copy → SEO → JSON → validate → optimize → output)  
**Saída**: `current_lp.json` + validation report

### Workflow 2: Validate Landing Page
**Disparo**: After generation / `/validate` command  
**Checks**: SEO, Security, Content, Accessibility, Performance  
**Saída**: Detailed quality report with score

### Workflow 3: Optimize Iteratively
**Disparo**: Validation fails / `/optimize` command  
**Iterações**: Max 5 cycles of improve → validate → keep/revert  
**Saída**: Before/after scores + improvement list

### Workflow 4: Prepare Deployment
**Disparo**: Validation passed  
**Checklist**: 25+ itens de code, SEO, security, a11y, performance  
**Saída**: Ready-to-deploy JSON + instructions

### Workflow 5: Post-Launch Monitoring
**Disparo**: After deployment  
**Frequency**: Daily (week 1), then weekly  
**Monitora**: Core Web Vitals, SEO metrics, conversions, health

### Workflow 6: Handle User Requests
**Disparo**: User requests changes  
**Classifica**: Content update / Design change / Bug / Optimization  
**Processa**: Accordingly based on type

### Workflow 7: Resolve Conflicts
**Disparo**: Spec vs Request / Security vs Convenience / Performance vs Feature  
**Decide**: Follow established rules + communicate clearly

---

## 🚀 Como Usar Esta Estrutura

### Cenário 1: Usuário quer gerar landing page

```
1. User: "Crie uma LP para minha clínica de estética em SP"
   ↓
2. Claude recognizes: landing-page-generator agent
   ↓
3. Agent executes: 9-step workflow
   ↓
4. Applies: landing-page-rules (all 10)
   ↓
5. Uses: landing-page-skills (all 8)
   ↓
6. Produces: src/content/current_lp.json
   ↓
7. Invokes: landing-page-validator agent
   ↓
8. Invokes: seo-performance-optimizer agent
   ↓
9. Delivers: JSON + validation report + suggestions
```

### Cenário 2: Validar landing page existente

```
1. User: "/validate" ou "verifique a qualidade"
   ↓
2. Claude recognizes: landing-page-validator agent
   ↓
3. Agent executes: 50+ validation checks
   ↓
4. Applies: landing-page-rules (all 10)
   ↓
5. Uses: landing-page-skills (SEO, Security, A11y, Performance)
   ↓
6. Produces: Detailed quality report with score
```

### Cenário 3: Otimizar landing page

```
1. User: "/optimize" ou "melhore isso"
   ↓
2. Claude recognizes: seo-performance-optimizer agent
   ↓
3. Agent executes: Analysis → Optimization → Validation
   ↓
4. Proposes: Improvements (copywriting, SEO, performance)
   ↓
5. Applies: Non-critical changes automatically
   ↓
6. Asks: User approval for critical changes
   ↓
7. Produces: Before/after comparison
```

### Cenário 4: Conflito ou restrição

```
1. User requests: Something against spec/security/performance
   ↓
2. Claude consults: steering/project-steering.yaml
   ↓
3. Decision: Follow spec/security/performance (per rules)
   ↓
4. Communication: Explain why + suggest alternative
   ↓
5. Result: Quality maintained, user informed
```

---

## 📊 Mapa Mental de Integração

```
┌─────────────────────────────────────────────────────────┐
│                  USER REQUEST                           │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────▼─────────────┐
        │  Classify Request Type │
        └──┬─────────┬─────────┬─┘
           │         │         │
      ┌────▼────┐ ┌──▼──┐ ┌───▼──┐
      │ Generate│ │Check│ │Modify│
      │         │ │ SEO │ │      │
      └────┬────┘ └──┬──┘ └───┬──┘
           │         │        │
    ┌──────▼─────────▼───────▼──┐
    │      Applicable Agent       │
    │  (generator/validator/opt)  │
    └──────┬──────────┬──────────┘
           │          │
    ┌──────▼────┐ ┌───▼──────┐
    │Apply Rules│ │Use Skills │
    │(10 rules) │ │(8 skills) │
    └──────┬────┘ └───┬──────┘
           │          │
    ┌──────▼──────────▼─┐
    │  Follow Workflow  │
    │  (7 workflows)    │
    └──────┬────────────┘
           │
    ┌──────▼──────────────────┐
    │ Output + Report         │
    │ (JSON + validation +    │
    │  suggestions + checklist)│
    └─────────────────────────┘
```

---

## ✅ Checklist de Implementação

Ao começar a usar este boilerplate:

- [ ] Ler este README completamente
- [ ] Estudar `agents/` para entender workflows
- [ ] Estudar `rules/` para entender restrições
- [ ] Estudar `skills/` para entender capacidades
- [ ] Estudar `steering/` para entender valores
- [ ] Estudar `workflows/` para entender processos
- [ ] Fazer um test run com briefing simples
- [ ] Validar saída JSON
- [ ] Testar no projeto real

---

## 🆘 Troubleshooting

### Problema: JSON não valida
**Causa**: Violação de schema TypeScript  
**Solução**: Validate against `src/types/landing.ts`  
**Comando**: `npm run build`

### Problema: Security warning
**Causa**: Dados sensíveis ou URL não validada  
**Solução**: Remove sensitive data, whitelist URL  
**Ref**: Rule #6 (Security)

### Problema: SEO score baixo
**Causa**: Meta tags subótimas ou schema inválido  
**Solução**: Use `/optimize` ou `/validate` + sugestões  
**Ref**: Skill #2 (SEO On-Page Optimization)

### Problema: Acessibilidade falha
**Causa**: Contrast ratio baixo ou alt text faltando  
**Solução**: Apply accessibility fixes from report  
**Ref**: Skill #5 (WCAG Accessibility)

### Problema: Performance ruim
**Causa**: Images não otimizadas ou code splitting  
**Solução**: Use `/optimize` para sugestões  
**Ref**: Skill #6 (Performance Optimization)

---

## 📞 Contato & Escalação

- **Bug no JSON**: Use `/validate` para detalhes
- **Security issue**: Escalate immediately (critical priority)
- **Feature request**: Discuta se está dentro do scope
- **Spec conflict**: Segue a spec sempre

---

## 📚 Referências Rápidas

| Item | Arquivo | Descrição |
|------|---------|-----------|
| Agents | `agents/*.yaml` | 3 agentes especializados |
| Rules | `rules/*.yaml` | 10 regras obrigatórias |
| Skills | `skills/*.yaml` | 8 habilidades técnicas |
| Steering | `steering/*.yaml` | Valores e prioridades |
| Workflows | `workflows/*.yaml` | 7 processos principais |
| SPEC | `../SPEC.md` | Documento técnico completo |

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0  
**Status**: ✅ Production-ready