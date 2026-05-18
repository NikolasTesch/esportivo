// ============================================================
// CONTRATO DA LANDING PAGE
// Este é o único arquivo que define o "schema" aceito pelo boilerplate.
// O Claude Code deve preencher current_lp.json respeitando estas interfaces.
// ============================================================

export interface NavLink {
  label: string
  href: string
}

export interface CtaButton {
  label: string
  href: string
}

export interface NavbarSection {
  logo: {
    text: string
    href: string
  }
  links: NavLink[]
  cta?: CtaButton
}

export interface HeroSection {
  badge?: string
  headline: string
  subheadline: string
  primaryCta: CtaButton
  secondaryCta?: CtaButton
  image?: string
}

export interface FeatureItem {
  // Nome do ícone do lucide-react — ver lista em PROMPT_TEMPLATE.md
  icon: string
  title: string
  description: string
}

export interface FeaturesSection {
  badge?: string
  title: string
  subtitle?: string
  items: FeatureItem[]
}

export interface TestimonialItem {
  quote: string
  author: string
  role: string
  avatar?: string
}

export interface TestimonialsSection {
  badge?: string
  title: string
  subtitle?: string
  items: TestimonialItem[]
}

export interface CtaSection {
  headline: string
  description: string
  primaryCta: CtaButton
  secondaryCta?: CtaButton
  note?: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  logo: string
  tagline?: string
  links?: FooterLink[]
  copyright: string
}

export interface MetaSection {
  title: string
  description: string
  ogImage?: string
}

// Tipo raiz — representa o JSON completo em current_lp.json
export interface LandingPage {
  meta: MetaSection
  navbar: NavbarSection
  hero: HeroSection
  features: FeaturesSection
  testimonials: TestimonialsSection
  cta: CtaSection
  footer: FooterSection
}
