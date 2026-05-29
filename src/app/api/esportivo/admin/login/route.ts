import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import {
  ADMIN_COOKIE,
  createSessionToken,
  safeEqual,
  SESSION_TTL_SECONDS,
} from '@/lib/admin-auth'
import { requireEnv } from '@/lib/env'

const sha = (v: string) => createHash('sha256').update(v).digest('hex')

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  let expected: string
  try {
    expected = requireEnv('ADMIN_PASSWORD')
  } catch {
    return NextResponse.json(
      { error: 'Painel não configurado (ADMIN_PASSWORD ausente).' },
      { status: 503 },
    )
  }

  const supplied = body.password ?? ''
  if (!safeEqual(sha(supplied), sha(expected))) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return res
}
