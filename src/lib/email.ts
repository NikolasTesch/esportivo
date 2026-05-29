import { Resend } from 'resend'
import { getEnv, requireEnv } from './env'

let client: Resend | null = null

function getResend(): Resend {
  if (!client) {
    client = new Resend(requireEnv('RESEND_API_KEY'))
  }
  return client
}

export interface SaleInfo {
  customerEmail: string
  customerName: string | null
  amountCents: number
  planLabel: string
}

function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

function fromAddress(): string {
  // Em produção, use um endereço do domínio verificado no Resend.
  return getEnv('EMAIL_FROM') ?? 'onboarding@resend.dev'
}

export interface InscricaoConfirmacao {
  email: string
  nome: string
  distancia: string
  categoria: string
  tamanhoCamisa: string
  kit: string
  amountCents: number
}

export async function sendInscricaoConfirmacao(
  i: InscricaoConfirmacao,
): Promise<void> {
  const valor = formatBRL(i.amountCents)
  await getResend().emails.send({
    from: fromAddress(),
    to: i.email,
    subject: 'Inscrição confirmada — Corrida pela Consciência 2026',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;color:#1A1A1A">
        <h2 style="color:#16A34A">Inscrição confirmada ✅</h2>
        <p>Olá, ${i.nome}!</p>
        <p>Recebemos seu pagamento e sua vaga na <strong>Corrida pela Consciência 2026</strong> está garantida. Obrigado por correr por essa causa.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#5D6D7E">Prova</td><td style="text-align:right"><strong>${i.distancia}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#5D6D7E">Categoria</td><td style="text-align:right">${i.categoria}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6D7E">Camisa</td><td style="text-align:right">${i.tamanhoCamisa}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6D7E">Kit</td><td style="text-align:right">${i.kit}</td></tr>
          <tr><td style="padding:8px 0;color:#5D6D7E">Valor pago</td><td style="text-align:right"><strong>${valor}</strong></td></tr>
        </table>
        <p>Guarde este e-mail: a retirada do kit será informada por aqui mais perto da data (12 de julho de 2026, Florianópolis).</p>
        <p style="color:#5D6D7E;font-size:13px;margin-top:24px">Este é um e-mail automático de confirmação.</p>
      </div>
    `,
  })
}

export async function sendAdminSaleNotification(info: SaleInfo): Promise<void> {
  const admin = getEnv('EMAIL_ADMIN')
  if (!admin) return
  const valor = formatBRL(info.amountCents)
  await getResend().emails.send({
    from: fromAddress(),
    to: admin,
    subject: `💰 Nova venda — ${info.planLabel} (${valor})`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;color:#1A1A1A">
        <h2>Nova venda registrada</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#5D6D7E">Plano</td><td style="text-align:right"><strong>${info.planLabel}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#5D6D7E">Valor</td><td style="text-align:right"><strong>${valor}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#5D6D7E">Cliente</td><td style="text-align:right">${info.customerName ?? '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#5D6D7E">Email</td><td style="text-align:right">${info.customerEmail || '—'}</td></tr>
        </table>
      </div>
    `,
  })
}
