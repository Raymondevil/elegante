import { Hono } from 'hono'
import type { Bindings } from '../types/bindings'
import { confirmPayment, createOrder, sha256, type Format, type Product } from '../services/order-service'

export const api = new Hono<{ Bindings: Bindings }>()

api.get('/health', (c) => c.json({ ok: true, service: 'el-tigre-orders', storageReady: Boolean(c.env.DB && c.env.MEDIA) }))

api.post('/orders', async (c) => {
  if (!c.env.DB) return c.json({ error: 'La recepción automática de pedidos aún no está configurada. Escríbenos por WhatsApp.' }, 503)
  let body: { item?: Product; format?: Format; quantity?: number; mediaId?: string }
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Solicitud no válida.' }, 400)
  }
  if ((body.item !== 'video' && body.item !== 'photo') || typeof body.format !== 'string') {
    return c.json({ error: 'Selecciona un producto y formato válido.' }, 400)
  }
  try {
    const order = await createOrder(c.env.DB, {
      item: body.item,
      format: body.format as Format,
      quantity: Number(body.quantity),
      mediaId: typeof body.mediaId === 'string' ? body.mediaId : undefined
    })
    return c.json(order, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar el pedido.'
    return c.json({ error: message }, 400)
  }
})

api.post('/orders/:reference/confirm-payment', async (c) => {
  const configuredToken = c.env.ADMIN_TOKEN
  const auth = c.req.header('Authorization')
  if (!configuredToken) return c.json({ error: 'Confirmación administrativa no configurada.' }, 503)
  if (auth !== `Bearer ${configuredToken}`) return c.json({ error: 'No autorizado.' }, 401)
  if (!c.env.DB) return c.json({ error: 'Base de datos no configurada.' }, 503)

  const reference = c.req.param('reference')
  const origin = new URL(c.req.url).origin
  const result = await confirmPayment(c.env.DB, reference, origin)
  if (result.kind === 'missing') return c.json({ error: 'No existe ese pedido.' }, 404)
  if (result.kind === 'not-pending') return c.json({ error: 'El pedido ya fue confirmado o ya no está pendiente.' }, 409)
  if ('downloadUrl' in result) {
    return c.json({ status: 'paid', reference: result.reference, downloadUrl: result.downloadUrl, expiresInHours: 48 })
  }
  return c.json({ status: 'paid', reference: result.reference, message: 'Pedido confirmado. La entrega física se coordina por WhatsApp.' })
})

api.get('/download/:token', async (c) => {
  if (!c.env.DB || !c.env.MEDIA) return c.json({ error: 'El sistema de entrega todavía no está configurado.' }, 503)
  const token = c.req.param('token')
  if (!/^[A-Za-z0-9_-]{40,50}$/.test(token)) return c.json({ error: 'Enlace no válido o ya utilizado.' }, 404)
  const tokenHash = await sha256(token)
  const grant = await c.env.DB.prepare(`SELECT d.order_reference, o.media_key, o.title, o.product
    FROM download_tokens d JOIN orders o ON o.reference = d.order_reference
    WHERE d.token_hash = ? AND d.consumed_at IS NULL AND d.expires_at > datetime('now') AND o.status = 'paid' AND o.format = 'digital'`)
    .bind(tokenHash).first<{ order_reference: string; media_key: string; title: string; product: string }>()
  if (!grant) return c.json({ error: 'Enlace no válido, vencido o ya utilizado.' }, 404)

  const asset = await c.env.MEDIA.get(grant.media_key)
  if (!asset) return c.json({ error: 'El archivo aún no está disponible. Contacta al equipo por WhatsApp.' }, 404)
  const consumed = await c.env.DB.prepare(`UPDATE download_tokens SET consumed_at = datetime('now')
    WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > datetime('now')`)
    .bind(tokenHash).run()
  if (!consumed.meta.changes) return c.json({ error: 'Este enlace ya fue utilizado o venció.' }, 410)

  const extension = grant.media_key.split('.').pop() || 'bin'
  const fileName = grant.product === 'video' ? `el-tigre-${grant.order_reference.toLowerCase()}.${extension}` : `foto-el-tigre-${grant.order_reference.toLowerCase()}.${extension}`
  c.header('Content-Type', asset.httpMetadata?.contentType || (extension === 'mp4' ? 'video/mp4' : 'image/jpeg'))
  c.header('Content-Disposition', `attachment; filename="${fileName}"`)
  c.header('Cache-Control', 'private, no-store, max-age=0')
  c.header('X-Content-Type-Options', 'nosniff')
  return c.body(asset.body)
})
