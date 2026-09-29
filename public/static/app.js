const galleryItems = [
  { src: '/gallery/fiesta-noche.jpg', title: 'La noche apenas comienza' },
  { src: '/gallery/familia.jpg', title: 'Un recuerdo para todos' },
  { src: '/gallery/jinete.jpg', title: 'Tradición a caballo' },
  { src: '/gallery/amigos.jpg', title: 'La alegría se contagia' },
  { src: '/gallery/arco-san-pedro.jpg', title: 'Un pueblo con historia' },
  { src: '/gallery/espuma.jpg', title: 'Pura fiesta, pura espuma' },
  { src: '/gallery/fiesta-color.jpg', title: 'Momentos que no se repiten' },
  { src: '/gallery/recuerdo-en-pareja.jpg', title: 'Una noche para recordar' },
  { src: '/gallery/topadera-1.jpg', title: 'El pueblo se reúne' },
  { src: '/gallery/topadera-2.jpg', title: 'Aquí se vive diferente' }
]
const prices = { video: { digital: 600, usb: 700 }, photo: { digital: 30, print: 50 } }
const formatNames = { digital: 'Digital', usb: 'En USB', print: 'Impresa 4×6 / 6×4' }
const whatsappNumber = '523118470860'
let selectedProduct = 'video'
let selectedMedia = 'fiesta-completa'
let activeImage = 0

const carousel = document.querySelector('#gallery-track')
const visibleCount = document.querySelector('#current-slide')
const cards = [...document.querySelectorAll('.gallery-card')]
const orderDialog = document.querySelector('#order-dialog')
const formatSelect = document.querySelector('#order-format')
const photoSelectWrap = document.querySelector('#photo-select-wrap')
const quantityInput = document.querySelector('#order-quantity')
const totalLabel = document.querySelector('#order-total')
const summaryLabel = document.querySelector('#order-summary')

function updateGalleryCount() {
  const nearest = cards.reduce((best, card, index) => {
    const distance = Math.abs(card.offsetLeft - carousel.scrollLeft)
    return distance < best.distance ? { index, distance } : best
  }, { index: 0, distance: Infinity })
  if (visibleCount) visibleCount.textContent = String(nearest.index + 1).padStart(2, '0')
}
function goToPhoto(index) {
  activeImage = (index + galleryItems.length) % galleryItems.length
  const item = galleryItems[activeImage]
  document.querySelector('#lightbox-image').src = item.src
  document.querySelector('#lightbox-image').alt = item.title
  document.querySelector('#lightbox-caption').textContent = item.title
}
function updatePrice() {
  const format = formatSelect.value
  const qty = Math.max(1, Math.min(20, Number.parseInt(quantityInput.value || '1', 10)))
  quantityInput.value = String(qty)
  const amount = prices[selectedProduct][format] * qty
  totalLabel.textContent = `$${amount.toLocaleString('es-MX')} MXN`
  const productName = selectedProduct === 'video' ? 'Video de topaderas y bailes' : 'Fotografía destacada'
  summaryLabel.textContent = `${productName} · ${qty} ${qty === 1 ? 'unidad' : 'unidades'} · ${formatNames[format]}`
}
function showOrder(type, media) {
  selectedProduct = type
  selectedMedia = media
  formatSelect.innerHTML = type === 'video'
    ? '<option value="digital">Video digital · $600</option><option value="usb">Video en USB · $700</option>'
    : '<option value="digital">Foto digital · $30</option><option value="print">Foto impresa 4×6 o 6×4 · $50</option>'
  photoSelectWrap.hidden = type !== 'photo'
  if (type === 'photo') document.querySelector('#order-photo').value = media
  quantityInput.value = '1'
  document.querySelector('#dialog-error').textContent = ''
  updatePrice()
  orderDialog.showModal()
}

carousel?.addEventListener('scroll', updateGalleryCount, { passive: true })
document.querySelector('#gallery-next')?.addEventListener('click', () => carousel.scrollBy({ left: 325, behavior: 'smooth' }))
document.querySelector('#gallery-prev')?.addEventListener('click', () => carousel.scrollBy({ left: -325, behavior: 'smooth' }))
cards.forEach((card, index) => card.addEventListener('click', () => {
  goToPhoto(index)
  document.querySelector('#lightbox').showModal()
}))
document.querySelector('#lightbox-close')?.addEventListener('click', () => document.querySelector('#lightbox').close())
document.querySelector('#lightbox-prev')?.addEventListener('click', () => goToPhoto(activeImage - 1))
document.querySelector('#lightbox-next')?.addEventListener('click', () => goToPhoto(activeImage + 1))
document.querySelector('#lightbox')?.addEventListener('click', (event) => {
  if (event.target.id === 'lightbox') event.currentTarget.close()
})
document.addEventListener('keydown', (event) => {
  if (!document.querySelector('#lightbox')?.open) return
  if (event.key === 'ArrowLeft') goToPhoto(activeImage - 1)
  if (event.key === 'ArrowRight') goToPhoto(activeImage + 1)
})
document.querySelectorAll('[data-order]').forEach((button) => button.addEventListener('click', () => showOrder(button.dataset.order, button.dataset.media)))
formatSelect?.addEventListener('change', updatePrice)
quantityInput?.addEventListener('input', updatePrice)
document.querySelector('#qty-minus')?.addEventListener('click', () => { quantityInput.value = String(Math.max(1, Number(quantityInput.value) - 1)); updatePrice() })
document.querySelector('#qty-plus')?.addEventListener('click', () => { quantityInput.value = String(Math.min(20, Number(quantityInput.value) + 1)); updatePrice() })
document.querySelector('#order-photo')?.addEventListener('change', (event) => { selectedMedia = event.target.value })
document.querySelector('#menu-toggle')?.addEventListener('click', (event) => {
  const nav = document.querySelector('.main-nav')
  const open = nav.classList.toggle('open')
  event.currentTarget.setAttribute('aria-expanded', String(open))
})
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.main-nav').classList.remove('open')))

document.querySelector('#send-order')?.addEventListener('click', async (event) => {
  event.preventDefault()
  const button = event.currentTarget
  const format = formatSelect.value
  const quantity = Math.max(1, Math.min(20, Number.parseInt(quantityInput.value || '1', 10)))
  const photoId = selectedProduct === 'photo' ? document.querySelector('#order-photo').value : undefined
  const productName = selectedProduct === 'video' ? 'Video de topaderas y bailes' : `Fotografía: ${document.querySelector('#order-photo option:checked').textContent}`
  const total = prices[selectedProduct][format] * quantity
  const reference = `
Quiero pedir: ${productName}
Formato: ${formatNames[format]}
Cantidad: ${quantity}
Total estimado: $${total.toLocaleString('es-MX')} MXN`
  const message = `Hola, Fotos y Video El Tigre.\n${reference}\n¿Me ayudan a confirmar disponibilidad, forma de pago y entrega?`
  button.disabled = true
  button.innerHTML = 'Preparando pedido…'
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: selectedProduct, format, quantity, mediaId: photoId })
    })
    if (response.ok) {
      const result = await response.json()
      const orderCode = `\nFolio: ${result.reference}`
      orderDialog.close()
      window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${message}${orderCode}`)}`)
      return
    }
  } catch (_) { /* El contacto por WhatsApp sigue disponible si la API aún no está conectada. */ }
  orderDialog.close()
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`)
})
updateGalleryCount()
