import Stripe from 'stripe'
import { requireEnv } from './env'

let client: Stripe | null = null

// Cliente Stripe singleton. apiVersion omitido de propósito: usa a versão
// fixada na conta, evitando divergência com a versão do SDK ao migrar.
export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(requireEnv('STRIPE_SECRET_KEY'))
  }
  return client
}
