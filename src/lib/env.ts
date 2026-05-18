// Acesso a variáveis de ambiente com validação preguiçosa.
// Validação no momento do uso (runtime), não no import — assim `next build`
// passa mesmo sem as chaves configuradas ainda.

export function getEnv(name: string): string | undefined {
  const value = process.env[name]
  return value && value.length > 0 ? value : undefined
}

export function requireEnv(name: string): string {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`)
  }
  return value
}
