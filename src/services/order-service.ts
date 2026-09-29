import type { D1Database } from '../types/bindings'

export const catalog = {
  video: {
    title: 'Video de topaderas y bailes',
    formats: { digital: 600, usb: 700 },
    mediaKey: 'downloads/video-topaderas-completo.mp4'
  },
  photo: {
    title: 'Fotografía destacada',
    formats: { digital: 30, print: 50 },
    photos: {
      'fiesta-noche': 'downloads/photos/fiesta-noche.jpg',
      familia: 'downloads/photos/familia.jpg',
      jinete: 'downloads/photos/jinete.jpg',
      amigos: 'downloads/photos/amigos.jpg',
      'arco-san-pedro': 'downloads/photos/arco-san-pedro.jpg',
      espuma: 'downloads/photos/espuma.jpg',
      'fiesta-color': 'downloads/photos/fiesta-color.jpg',
      'recuerdo-en-pareja': 'downloads/photos/recuerdo-en-pareja.jpg',
      'topadera-1': 'downloads/photos/topadera-1.jpg',
      'topadera-2': 'downloads/photos/topadera-2.jpg'
    } as Record<string, string>
  }
} as const

export type Product = 'video' | 'photo'
export type Format = 'digital' | 'usb' | 'print'

export async function createOrder(db: D1Database, input: { item: Product; format: Format; quantity: number; mediaId?: string }) {
  const item = catalog[input.item]
  const unitPrice = item.formats[input.format as keyof typeof item.formats]
  if (typeof unitPrice !== 'number') throw new Error('Formato no válido para este producto.')
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 20) throw new Error('La cantidad debe estar entre 1 y 20.')

  let mediaKey: string
  let title = item.title
  if (input.item === 'photo') {
    const photoKey = catalog.photo.photos[input.mediaId ?? '']
    if (!photoKey) throw new Error('Selecciona una fotografía disponible.')
    mediaKey = photoKey
    title = `${item.title}: ${input.mediaId}`
  } else {
    mediaKey = catalog.video.mediaKey
  }

  const reference = `TIG-${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`
  const total = unitPrice * input.quantity
  await db.prepare(`INSERT INTO orders (reference, product, format, media_id, media_key, title, quantity, unit_price, total_mxn, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`)
    .bind(reference, input.item, input.format, input.mediaId ?? null, mediaKey, title, input.quantity, unitPrice, total).run()
  return { reference, product: input.item, format: input.format, quantity: input.quantity, totalMxn: total, status: 'pending' as const }
}

export async function confirmPayment(db: D1Database, reference: string, appOrigin: string) {
  const order = await db.prepare(`SELECT reference, product, format, media_key, title, status FROM orders WHERE reference = ?`)
    .bind(reference).first<{ reference: string; product: Product; format: Format; media_key: string; title: string; status: string }>()
  if (!order) return { kind: 'missing' as const }
  if (order.status !== 'pending') return { kind: 'not-pending' as const }

  const updated = await db.prepare(`UPDATE orders SET status = 'paid', paid_at = datetime('now') WHERE reference = ? AND status = 'pending'`)
    .bind(reference).run()
  if (!updated.meta.changes) return { kind: 'not-pending' as const }

  if (order.format !== 'digital') return { kind: 'paid' as const, reference }

  const rawToken = randomUrlToken()
  const tokenHash = await sha256(rawToken)
  await db.prepare(`INSERT INTO download_tokens (order_reference, token_hash, expires_at)
    VALUES (?, ?, datetime('now', '+48 hours'))`).bind(reference, tokenHash).run()

  return {
    kind: 'paid' as const,
    reference,
    downloadUrl: `${appOrigin}/api/download/${rawToken}`
  }
}

function randomUrlToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
