import { createHash, timingSafeEqual } from 'node:crypto'
import { requireEnv } from './env'

export const ADMIN_COOKIE = 'esportivo_admin'

// Token derivado da senha (a senha crua nunca vai para o cookie).
export function adminToken(): string {
  return createHash('sha256')
    .update(requireEnv('ADMIN_PASSWORD'))
    .digest('hex')
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export function isAuthed(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  try {
    return safeEqual(cookieValue, adminToken())
  } catch {
    return false
  }
}
