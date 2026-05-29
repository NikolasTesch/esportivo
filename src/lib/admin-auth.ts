import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { getEnv, requireEnv } from './env'

export const ADMIN_COOKIE = 'esportivo_admin'
export const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 horas

// Chave que assina os tokens de sessão. Quando ADMIN_SESSION_SECRET está
// definido (recomendado), é independente da senha — assim, vazar a senha do
// painel NÃO permite forjar um cookie de sessão. Sem ele, cai para a própria
// senha (ainda válido, mas sem essa separação de segredos).
function sessionSecret(): string {
  return getEnv('ADMIN_SESSION_SECRET') ?? requireEnv('ADMIN_PASSWORD')
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('hex')
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

// Token de sessão: "<exp_unix>.<nonce>.<hmac>"
//  - exp:   expiração absoluta — validada no servidor (sem replay eterno)
//  - nonce: aleatório — cada login gera um cookie único, não derivável da senha
//  - hmac:  assinatura HMAC-SHA256 sobre "exp.nonce"
export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const nonce = randomBytes(16).toString('hex')
  const payload = `${exp}.${nonce}`
  return `${payload}.${sign(payload)}`
}

export function isAuthed(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  const parts = cookieValue.split('.')
  if (parts.length !== 3) return false

  const [expStr, nonce, mac] = parts
  const exp = Number(expStr)
  // Expiração validada no servidor — cookie roubado não vale para sempre.
  if (!Number.isInteger(exp) || exp * 1000 < Date.now()) return false

  try {
    return safeEqual(sign(`${expStr}.${nonce}`), mac)
  } catch {
    return false
  }
}
