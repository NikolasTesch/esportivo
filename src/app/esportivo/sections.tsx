import type { ReactNode } from 'react'
import {
  Zap,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  HeartHandshake,
  Droplets,
  Flag,
  Users,
} from 'lucide-react'
import {
  AnimatedBadge,
  HeroHeading,
  HeroBody,
  HeroActions,
  HeroMarquee,
  FadeIn,
  SectionLabel,
  SectionHeading,
  StaggerGrid,
  StaggerItem,
  DrawPath,
  FadePath,
  CountUp,
  TimelineItem,
  QuoteBlock,
  CtaContent,
} from './motion'

// ============================================================
// CONTEÚDO + SEÇÕES — Template Esportivo (SPA)
// Corrida pela Consciência 2026 — corrida beneficente de
// conscientização. Edite apenas este arquivo para mudar conteúdo.
// ============================================================

export const INSCRICAO = '/esportivo/inscricao'
export const BASE = '/esportivo'
export const PRECO_LABEL = 'R$ 80'

const distancias = [
  { km: '5K', nome: 'Caminhada & Estreante', detalhe: 'Largada 07h30 · Plano · Aberto a todas as idades' },
  { km: '10K', nome: 'Intermediário', detalhe: 'Largada 07h00 · Misto · Cronometragem por chip' },
  { km: '21K', nome: 'Meia Maratona', detalhe: 'Largada 06h00 · Orla completa · Pacers oficiais' },
]

const faixas = ['16–19', '20–29', '30–39', '40–49', '50–59', '60+']

const cronograma = [
  ['05:00', 'Abertura da arena e retirada de kits de última hora'],
  ['06:00', 'Largada 21K — meia maratona'],
  ['07:00', 'Largada 10K'],
  ['07:30', 'Largada 5K — corrida e caminhada'],
  ['09:30', 'Pódio geral e premiação por faixa etária'],
  ['10:30', 'Roda de conversa aberta sobre saúde mental'],
  ['11:00', 'Encerramento da arena com show'],
]

const motivos = [
  ['Causa que move', 'Cada inscrição reverte parte da renda ao Instituto Reviva e ajuda a levar acolhimento a quem precisa.'],
  ['Medalha finisher', 'Peça exclusiva 2026 entregue na chegada para todo mundo que cruzar a linha.'],
  ['Percurso à beira-mar', 'Orla fechada, hidratação a cada 2,5 km e suporte médico em todo o trajeto.'],
  ['Cronometragem chip', 'Resultado oficial em tempo real e foto gratuita no pórtico de chegada.'],
]

const kits = [
  {
    nome: 'Básico',
    preco: 'Incluído',
    sub: 'na inscrição',
    desc: 'Tudo o que você precisa para correr no dia: identificação oficial, cronometragem e hidratação no percurso. Ideal para quem corre pela causa sem extras.',
    itens: ['Número de peito + chip de cronometragem', 'Camiseta técnica oficial da edição 2026', 'Hidratação a cada 2,5 km', 'Medalha finisher na chegada'],
    destaque: false,
  },
  {
    nome: 'Premium',
    preco: 'R$ 89',
    sub: 'add-on',
    desc: "Para quem quer levar a lembrança completa do dia. Soma à inscrição uma sacola exclusiva, viseira do evento e sua foto digital sem marca d'água.",
    itens: ['Tudo do Básico', 'Sacola-mochila exclusiva do evento', 'Viseira técnica da edição', 'Pacote de fotos digitais em alta resolução'],
    destaque: true,
  },
  {
    nome: 'Embaixador',
    preco: 'R$ 169',
    sub: 'add-on solidário',
    desc: 'O kit que mais apoia a causa: além de todos os itens Premium, um valor extra é integralmente doado ao Instituto Reviva em seu nome, com certificado de apoiador.',
    itens: ['Tudo do Premium', 'Corta-vento + mochila do evento', 'Acesso à área VIP de chegada', 'Doação extra ao Instituto Reviva + certificado de apoiador'],
    destaque: false,
  },
]

const stats = [
  { to: 8, prefix: '+', suffix: ' mil', label: 'corredores na última edição' },
  { to: 240, prefix: 'R$ ', suffix: ' mil', label: 'doados ao instituto desde 2021' },
  { to: 100, prefix: '', suffix: '%', label: 'do percurso com suporte médico' },
  { to: 3, prefix: '', suffix: '', label: 'distâncias para todos os níveis' },
]

// ---- Seções fixas ----

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32">
      <HeroMarquee duration={55} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[30vw] leading-none text-white/[0.03]" />
      <div className="relative mx-auto max-w-6xl">
        <AnimatedBadge className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
          <HeartHandshake size={16} /> Corrida beneficente · Florianópolis · 12 de julho de 2026
        </AnimatedBadge>
        <HeroHeading className="lp-rise text-6xl font-extrabold uppercase italic leading-[0.88] tracking-[-0.02em] sm:text-8xl lg:text-[8.5rem]">
          Corra por
          <br />
          <span className="text-[#D6FF3F]">uma causa</span>
          <br />
          que move
        </HeroHeading>
        <HeroBody className="mt-8 max-w-xl text-base leading-relaxed text-white/60">
          5K, 10K e 21K à beira-mar para fortalecer a conscientização em
          saúde mental. Cada inscrição apoia o Instituto Reviva. Vagas
          limitadas por lote.
        </HeroBody>
        <HeroActions className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={INSCRICAO} className="group inline-flex items-center justify-center gap-3 bg-[#D6FF3F] px-9 py-5 text-sm font-extrabold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5">
            Quero me inscrever
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#sobre" className="inline-flex items-center justify-center border border-white/25 px-9 py-5 text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:border-[#D6FF3F] hover:text-[#D6FF3F]">
            Sobre o projeto
          </a>
        </HeroActions>
      </div>
    </section>
  )
}

export function DepoimentosEsporte() {
  return (
    <section className="mx-auto grid max-w-6xl gap-px bg-white/10 px-0 sm:grid-cols-2">
      {[
        ['Correr por uma causa muda tudo. Voltei a treinar e ainda ajudei o instituto. Não tem preço.', 'Letícia M.', '21K · 2025', -1],
        ['Cruzei minha primeira meia aqui. A roda de conversa no fim me marcou tanto quanto a medalha.', 'Anderson T.', '21K · 2025', 1],
      ].map(([quote, autor, tag, dir]) => (
        <QuoteBlock key={autor as string} direction={dir as 1 | -1} className="bg-[#0B0B0C] p-10 sm:p-14">
          <p className="text-2xl font-semibold leading-snug sm:text-3xl">"{quote}"</p>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            {autor} · <span className="text-[#D6FF3F]">{tag}</span>
          </p>
        </QuoteBlock>
      ))}
    </section>
  )
}

export function CtaFinal() {
  return (
    <section className="bg-[#D6FF3F] px-6 py-24 text-black">
      <CtaContent className="mx-auto max-w-6xl text-center">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.35em]">
          Lote promocional encerra em breve
        </p>
        <p className="text-5xl font-extrabold uppercase italic leading-[0.9] tracking-tight sm:text-7xl">
          Sua corrida
          <br />
          também é o impulso
          <br />
          de alguém.
        </p>
        <a href={INSCRICAO} className="mt-10 inline-flex items-center gap-3 bg-black px-10 py-5 text-sm font-extrabold uppercase tracking-[0.16em] text-[#D6FF3F] transition-transform hover:-translate-y-1">
          Inscrever-se · {PRECO_LABEL}
          <ArrowRight size={18} />
        </a>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Av. Beira-Mar Norte · Florianópolis/SC
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} /> 12.07.2026 · largadas a partir das 06h
          </span>
        </div>
      </CtaContent>
    </section>
  )
}

// ---- Seções (SPA, ancoradas) ----

function Sobre() {
  return (
    <section id="sobre" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
          <HeartHandshake size={16} /> Sobre o projeto
        </SectionLabel>
        <SectionHeading className="max-w-3xl text-4xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-6xl">
          Mais que uma corrida<span className="text-[#FF5A1F]">.</span> Um
          movimento de consciência<span className="text-[#FF5A1F]">.</span>
        </SectionHeading>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <FadeIn delay={0.1} className="space-y-5 text-base leading-relaxed text-white/65">
            <p>
              A <strong className="text-white">Corrida pela Consciência</strong> nasceu
              de um propósito simples: usar o esporte para abrir conversas
              que ainda são silenciadas. A cada edição, milhares de pessoas
              ocupam a orla de Florianópolis para correr — e para lembrar que
              cuidar da mente é tão vital quanto cuidar do corpo.
            </p>
            <p>
              Toda a operação é construída com transparência. Uma parte de
              cada inscrição é revertida ao{' '}
              <strong className="text-white">Instituto Reviva</strong>, que
              leva acolhimento psicológico gratuito a quem mais precisa. Você
              corre, e o instituto avança.
            </p>
            <p>
              Não importa o seu ritmo: caminhar 5K ou cruzar a meia maratona
              tem o mesmo peso aqui. O que move esse projeto é a presença —
              de cada pessoa que decide aparecer.
            </p>
          </FadeIn>
          <StaggerGrid className="grid grid-cols-2 gap-px self-start bg-white/10">
            {stats.map(({ to, prefix, suffix, label }) => (
              <StaggerItem key={label} className="bg-[#0B0B0C] p-7">
                <p className="text-3xl font-extrabold italic tracking-tight text-[#D6FF3F]">
                  <CountUp to={to} prefix={prefix} suffix={suffix} />
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                  {label}
                </p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  )
}

function Percurso() {
  const hidratacao = [
    { x: 146, y: 220, label: 'Hidratação · 2,5 km' },
    { x: 485, y: 94, label: 'Hidratação · 7 km' },
    { x: 711, y: 170, label: 'Hidratação · 14 km' },
  ]
  return (
    <section id="percurso" className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
          <MapPin size={16} /> Percurso
        </SectionLabel>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading className="text-4xl font-extrabold uppercase italic tracking-tight sm:text-5xl">
            A rota à beira-mar<span className="text-[#FF5A1F]">.</span>
          </SectionHeading>
          <FadeIn delay={0.15} className="max-w-md text-sm leading-relaxed text-white/55">
            <p>
              Largada e chegada na Av. Beira-Mar Norte. Trajeto plano, asfaltado
              e 100% fechado para o trânsito, com hidratação e suporte ao longo
              de toda a orla.
            </p>
          </FadeIn>
        </div>

        <FadeIn className="overflow-hidden border border-white/10 bg-[#0B0B0C]">
          <svg
            viewBox="0 0 900 360"
            className="h-auto w-full"
            role="img"
            aria-label="Mapa estilizado do percurso à beira-mar, com largada, pontos de hidratação, ponto de virada e chegada"
          >
            <defs>
              <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M45 0H0V45" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="900" height="360" fill="url(#grid)" />
            <rect x="0" y="288" width="900" height="72" fill="#D6FF3F" fillOpacity="0.05" />
            <text x="24" y="332" fill="#ffffff" fillOpacity="0.25" fontSize="13" fontWeight="700" letterSpacing="3">
              OCEANO ATLÂNTICO
            </text>
            {/* dashed orange path fades in */}
            <FadePath
              d="M70 250 C 180 250, 180 110, 320 110 S 520 60, 620 130 S 800 150, 830 250"
              fill="none"
              stroke="#FF5A1F"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="2 16"
            />
            {/* solid green path draws itself */}
            <DrawPath
              d="M70 250 C 180 250, 180 110, 320 110 S 520 60, 620 130 S 800 150, 830 250"
              fill="none"
              stroke="#D6FF3F"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="70" cy="250" r="11" fill="#D6FF3F" />
            <text x="70" y="290" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              LARGADA
            </text>
            <circle cx="620" cy="130" r="9" fill="#ffffff" />
            <text x="620" y="105" fill="#ffffff" fillOpacity="0.7" fontSize="12" fontWeight="700" textAnchor="middle">
              VIRADA
            </text>
            {hidratacao.map((h) => (
              <g key={h.label}>
                <circle cx={h.x} cy={h.y} r="7" fill="none" stroke="#FF5A1F" strokeWidth="3" />
                <text x={h.x} y={h.y - 16} fill="#ffffff" fillOpacity="0.55" fontSize="11" fontWeight="700" textAnchor="middle">
                  {h.label}
                </text>
              </g>
            ))}
            <circle cx="830" cy="250" r="11" fill="#FF5A1F" />
            <text x="830" y="290" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              CHEGADA
            </text>
          </svg>
        </FadeIn>

        <StaggerGrid className="mt-px grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
          {(
            [
              { Icon: Flag, t: 'Largada & chegada', d: 'Arena única na Av. Beira-Mar Norte' },
              { Icon: Droplets, t: 'Hidratação', d: 'Postos a cada 2,5 km em todas as provas' },
              { Icon: HeartHandshake, t: 'Suporte', d: 'Equipe médica e resgate em todo o trajeto' },
            ] as const
          ).map(({ Icon, t, d }) => (
            <StaggerItem key={t} className="bg-[#0B0B0C] p-7">
              <Icon size={22} className="text-[#D6FF3F]" />
              <h3 className="mt-4 text-base font-bold uppercase tracking-wide">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{d}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}

function Categorias() {
  return (
    <section id="categorias" className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
          <Users size={16} /> Categorias
        </SectionLabel>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading className="text-4xl font-extrabold uppercase italic tracking-tight sm:text-5xl">
            Escolha sua prova<span className="text-[#FF5A1F]">.</span>
          </SectionHeading>
          <FadeIn delay={0.15} className="max-w-md text-sm leading-relaxed text-white/55">
            <p>
              Cada distância tem premiação separada por gênero e faixa etária.
              Você escolhe a categoria na inscrição.
            </p>
          </FadeIn>
        </div>

        <StaggerGrid className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
          {distancias.map((d) => (
            <StaggerItem key={d.km} className="bg-[#0B0B0C] p-9 sm:p-10">
              <span className="block text-6xl font-extrabold italic tracking-tighter text-[#D6FF3F] sm:text-7xl">
                {d.km}
              </span>
              <h3 className="mt-4 text-lg font-bold uppercase tracking-wide">{d.nome}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{d.detalhe}</p>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Gênero
                </p>
                <p className="mt-2 text-sm text-white/70">Masculino · Feminino</p>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Faixas etárias
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {faixas.map((f) => (
                    <span
                      key={f}
                      className="border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/65"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeIn delay={0.1} className="mt-10">
          <a
            href={INSCRICAO}
            className="inline-flex items-center gap-3 bg-[#D6FF3F] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5"
          >
            Escolher categoria e inscrever
            <ArrowRight size={16} />
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

function Kits() {
  return (
    <section id="kits" className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
              <Zap size={16} /> Kits
            </SectionLabel>
            <SectionHeading className="text-4xl font-extrabold uppercase italic tracking-tight sm:text-5xl">
              Escolha seu kit<span className="text-[#FF5A1F]">.</span>
            </SectionHeading>
            <FadeIn delay={0.1} className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
              <p>
                A inscrição já garante o kit Básico completo para correr. Os
                add-ons Premium e Embaixador são opcionais — e o Embaixador
                ainda transforma seu kit em uma doação direta à causa.
              </p>
            </FadeIn>
          </div>
          <FadeIn className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#FF5A1F]">
            <span className="lp-blink h-2 w-2 rounded-full bg-[#FF5A1F]" />
            Add-ons só até o fim do lote
          </FadeIn>
        </div>
        <StaggerGrid className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
          {kits.map((k) => (
            <StaggerItem
              key={k.nome}
              className={`flex flex-col p-9 sm:p-10 ${k.destaque ? 'bg-[#D6FF3F] text-black' : 'bg-[#0B0B0C] text-white'}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold uppercase tracking-wide">{k.nome}</h3>
                {k.destaque && (
                  <span className="border border-black px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]">Mais levado</span>
                )}
              </div>
              <p className="mt-5 text-4xl font-extrabold italic tracking-tight">
                {k.preco}
                <span className={`ml-2 text-xs font-bold uppercase not-italic tracking-[0.18em] ${k.destaque ? 'text-black/60' : 'text-white/45'}`}>{k.sub}</span>
              </p>
              <p className={`mt-5 text-sm leading-relaxed ${k.destaque ? 'text-black/70' : 'text-white/55'}`}>
                {k.desc}
              </p>
              <ul className="mt-7 flex-1 space-y-3 text-sm">
                {k.itens.map((it) => (
                  <li key={it} className={`flex gap-3 border-b pb-3 ${k.destaque ? 'border-black/15' : 'border-white/10'}`}>
                    <Zap size={15} className={`mt-0.5 shrink-0 ${k.destaque ? 'text-black' : 'text-[#D6FF3F]'}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <a href={INSCRICAO} className={`mt-8 px-6 py-4 text-center text-xs font-extrabold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5 ${k.destaque ? 'bg-black text-[#D6FF3F]' : 'border border-white/25 hover:border-[#D6FF3F] hover:text-[#D6FF3F]'}`}>
                {k.preco === 'Incluído' ? 'Inscrever-se' : `Levar ${k.nome}`}
              </a>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}

function Cronograma() {
  return (
    <section id="cronograma" className="mx-auto max-w-4xl px-6 py-24">
      <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
        <Clock size={16} /> Cronograma
      </SectionLabel>
      <SectionHeading className="mb-14 text-4xl font-extrabold uppercase italic tracking-tight sm:text-5xl">
        O dia da corrida<span className="text-[#FF5A1F]">.</span>
      </SectionHeading>
      <div className="border-l-2 border-white/15">
        {cronograma.map(([hora, evento], i) => (
          <TimelineItem key={hora} index={i}>
            <div className="relative flex gap-6 pb-9 pl-8 last:pb-0">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[#D6FF3F]" />
              <span className="w-16 shrink-0 text-2xl font-extrabold tabular-nums tracking-tight text-[#D6FF3F]">{hora}</span>
              <p className="pt-1 text-sm leading-relaxed text-white/70">{evento}</p>
            </div>
          </TimelineItem>
        ))}
      </div>
    </section>
  )
}

function Motivos() {
  return (
    <section id="motivos" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionLabel className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">
          <Award size={16} /> Por que correr
        </SectionLabel>
        <SectionHeading className="mb-12 text-4xl font-extrabold uppercase italic tracking-tight sm:text-5xl">
          Por que correr essa
        </SectionHeading>
        <StaggerGrid className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {motivos.map(([t, d]) => (
            <StaggerItem key={t} className="bg-[#0B0B0C] p-8">
              <Award size={26} className="text-[#D6FF3F]" />
              <h3 className="mt-5 text-lg font-bold uppercase tracking-wide">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{d}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}

export type SpaSection = {
  id: string
  navLabel: string
  Section: () => ReactNode
}

export const sections: SpaSection[] = [
  { id: 'sobre', navLabel: 'O projeto', Section: Sobre },
  { id: 'percurso', navLabel: 'Percurso', Section: Percurso },
  { id: 'categorias', navLabel: 'Categorias', Section: Categorias },
  { id: 'kits', navLabel: 'Kits', Section: Kits },
  { id: 'cronograma', navLabel: 'Cronograma', Section: Cronograma },
  { id: 'motivos', navLabel: 'Por que correr', Section: Motivos },
]
