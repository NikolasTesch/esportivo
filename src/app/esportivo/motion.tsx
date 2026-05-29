'use client'

import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const E = [0.16, 1, 0.3, 1] as const
const VP = { once: true, margin: '-80px' } as const

// ── Hero (mount animations) ────────────────────────────────────────────────

export function AnimatedBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: E }}
      className={className}
    >
      {children}
    </motion.p>
  )
}

export function HeroHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: E, delay: 0.12 }}
      className={className}
    >
      {children}
    </motion.h1>
  )
}

export function HeroBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: E, delay: 0.35 }}
      className={className}
    >
      {children}
    </motion.p>
  )
}

export function HeroActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: E, delay: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroBg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.4 }}
      className={className}
      aria-hidden
    >
      {children}
    </motion.span>
  )
}

// ── Hero marquee (logo "Corrida+" em loop contínuo) ────────────────────────

export function HeroMarquee({
  className,
  duration = 28,
}: {
  className?: string
  duration?: number
}) {
  // Duas cópias idênticas deslocando -50% garantem loop sem emenda.
  const item = (
    <span className="px-[0.15em] font-extrabold uppercase italic leading-none">
      Corrida<span className="text-[#D6FF3F]/[0.04]">+</span>
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.4 }}
      className={className}
      aria-hidden
    >
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <span className="flex shrink-0">
          {item}
          {item}
          {item}
          {item}
        </span>
        <span className="flex shrink-0">
          {item}
          {item}
          {item}
          {item}
        </span>
      </motion.div>
    </motion.div>
  )
}

// ── Scroll-triggered ───────────────────────────────────────────────────────

export function FadeIn({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, ease: E, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.4, ease: E }}
      className={className}
    >
      {children}
    </motion.p>
  )
}

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, ease: E, delay: 0.08 }}
      className={className}
    >
      {children}
    </motion.h2>
  )
}

// ── Stagger grid ───────────────────────────────────────────────────────────

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: E } },
}

export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      variants={gridVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// ── Animated SVG path (route drawing) ─────────────────────────────────────

export function DrawPath(props: React.SVGProps<SVGPathElement>) {
  return (
    <motion.path
      {...(props as React.ComponentProps<typeof motion.path>)}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.25 }}
    />
  )
}

export function FadePath(props: React.SVGProps<SVGPathElement>) {
  return (
    <motion.path
      {...(props as React.ComponentProps<typeof motion.path>)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.2 }}
    />
  )
}

// ── Count-up number ────────────────────────────────────────────────────────

export function CountUp({
  to,
  prefix = '',
  suffix = '',
  duration = 1.8,
  className,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('pt-BR')),
    })
    return ctrl.stop
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// ── Timeline item ──────────────────────────────────────────────────────────

export function TimelineItem({ children, index }: { children: ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: E, delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  )
}

// ── Depoimento block ───────────────────────────────────────────────────────

export function QuoteBlock({
  children,
  className,
  direction = 1,
}: {
  children: ReactNode
  className?: string
  direction?: 1 | -1
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: E }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── CTA block ──────────────────────────────────────────────────────────────

export function CtaContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: E }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Animated navbar (scroll-aware) ────────────────────────────────────────

export function AnimatedNavbar({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 60], ['rgba(11,11,12,0.85)', 'rgba(11,11,12,0.97)'])
  const border = useTransform(
    scrollY,
    [0, 60],
    ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.14)'],
  )

  return (
    <motion.header
      style={{ backgroundColor: bg, borderBottomColor: border }}
      className="sticky top-0 z-50 border-b backdrop-blur"
    >
      {children}
    </motion.header>
  )
}
