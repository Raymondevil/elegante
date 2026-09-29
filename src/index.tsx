import { Hono } from 'hono'
import { api } from './routes/api'

const app = new Hono()
app.route('/api', api)

app.get('/', (c) => c.html(`<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#141512" />
  <meta name="description" content="Revive las topaderas, los toros y los bailes de San Pedro Lagunillas con Fotos y Video El Tigre." />
  <link rel="icon" href="/gallery/logo.jpg" type="image/jpeg" />
  <title>Fotos y Video El Tigre | San Pedro Lagunillas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#inicio" aria-label="Fotos y Video El Tigre, inicio">
      <img src="/gallery/logo.jpg" alt="Logotipo de Fotos y Video El Tigre" />
      <span><strong>EL TIGRE</strong><small>FOTOS Y VIDEO</small></span>
    </a>
    <nav class="main-nav" aria-label="Navegación principal">
      <a href="#galeria">Galería</a><a href="#coleccion">Colección</a><a href="#precios">Precios</a>
    </nav>
    <a class="header-contact" href="https://wa.me/523118470860" target="_blank" rel="noreferrer">Informes por WhatsApp <span>↗</span></a>
    <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
  </header>

  <main id="inicio">
    <section class="hero" aria-labelledby="hero-title">
      <img class="hero-photo" src="/gallery/jinete.jpg" alt="Jinete en las fiestas de San Pedro Lagunillas" />
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <p class="eyebrow"><span></span> SAN PEDRO LAGUNILLAS · NAYARIT</p>
        <h1 id="hero-title">La fiesta se vive.<br /><em>El recuerdo se queda.</em></h1>
        <p class="hero-subtitle">Topaderas, toros y bailes. Revive los momentos que hicieron vibrar al pueblo.</p>
        <div class="hero-actions"><a class="button button-gold" href="#galeria">Ver momentos <span>↓</span></a><a class="button button-outline" href="#coleccion">Conocer la colección <span>↗</span></a></div>
      </div>
      <div class="hero-caption"><span>01 / 10</span><span>Tradición que se comparte</span></div>
      <div class="hero-stamp"><span>RECUERDOS</span><b>2026</b><span>DE SAN PEDRO</span></div>
    </section>

    <section class="intro section-wrap">
      <div class="intro-mark"><span>F</span><i>✳</i></div>
      <div><p class="eyebrow dark-eyebrow">FOTOS Y VIDEO EL TIGRE</p><h2>Lo que pasa en la fiesta,<br /><em>se queda en la memoria.</em></h2></div>
      <p class="intro-text">Desde la emoción de las topaderas hasta el último baile: aquí encuentras una selección de los mejores instantes, lista para llevar contigo.</p>
    </section>

    <section class="gallery-section" id="galeria">
      <div class="section-heading section-wrap">
        <div><p class="eyebrow dark-eyebrow">MOMENTOS DESTACADOS</p><h2>Así se vivió <em>San Pedro</em></h2></div>
        <div class="gallery-controls"><span class="gallery-count"><b id="current-slide">01</b> <i>/</i> 10</span><button class="round-button" id="gallery-prev" aria-label="Foto anterior">←</button><button class="round-button" id="gallery-next" aria-label="Foto siguiente">→</button></div>
      </div>
      <div class="gallery-carousel" id="gallery-carousel" aria-label="Carrusel de fotografías destacadas">
        <div class="gallery-track" id="gallery-track">
          <button class="gallery-card gallery-card-tall" data-index="0" aria-label="Ver foto: La fiesta de noche"><img src="/gallery/fiesta-noche.jpg" alt="Amigos reunidos durante la fiesta nocturna" loading="lazy" /><span class="photo-tag">BAILE Y FIESTA</span><span class="photo-caption">La noche apenas comienza</span></button>
          <button class="gallery-card" data-index="1" aria-label="Ver foto: Recuerdos en familia"><img src="/gallery/familia.jpg" alt="Familia disfrutando de la celebración" loading="lazy" /><span class="photo-tag">EN FAMILIA</span><span class="photo-caption">Un recuerdo para todos</span></button>
          <button class="gallery-card gallery-card-tall" data-index="2" aria-label="Ver foto: Jinete en la topadera"><img src="/gallery/jinete.jpg" alt="Jinete montando un caballo en la arena" loading="lazy" /><span class="photo-tag">TOPADERAS</span><span class="photo-caption">Tradición a caballo</span></button>
          <button class="gallery-card" data-index="3" aria-label="Ver foto: Amigos de fiesta"><img src="/gallery/amigos.jpg" alt="Dos amigos posan durante la fiesta" loading="lazy" /><span class="photo-tag">BUENOS AMIGOS</span><span class="photo-caption">La alegría se contagia</span></button>
          <button class="gallery-card gallery-card-tall" data-index="4" aria-label="Ver foto: El arco de San Pedro"><img src="/gallery/arco-san-pedro.jpg" alt="Arco de bienvenida de San Pedro Lagunillas" loading="lazy" /><span class="photo-tag">SAN PEDRO</span><span class="photo-caption">Un pueblo con historia</span></button>
          <button class="gallery-card" data-index="5" aria-label="Ver foto: Fiesta de espuma"><img src="/gallery/espuma.jpg" alt="Asistentes cubiertos de espuma en la fiesta" loading="lazy" /><span class="photo-tag">TOPADERAS</span><span class="photo-caption">Pura fiesta, pura espuma</span></button>
          <button class="gallery-card gallery-card-tall" data-index="6" aria-label="Ver foto: Baile y color"><img src="/gallery/fiesta-color.jpg" alt="Participantes celebran juntos entre espuma y color" loading="lazy" /><span class="photo-tag">COLOR Y ALEGRÍA</span><span class="photo-caption">Momentos que no se repiten</span></button>
          <button class="gallery-card" data-index="7" aria-label="Ver foto: Recuerdo en pareja"><img src="/gallery/recuerdo-en-pareja.jpg" alt="Pareja comparte un momento durante la feria" loading="lazy" /><span class="photo-tag">RECUERDOS</span><span class="photo-caption">Una noche para recordar</span></button>
          <button class="gallery-card gallery-card-tall" data-index="8" aria-label="Ver foto: Topadera entre amigos"><img src="/gallery/topadera-1.jpg" alt="Grupo reunido en las topaderas" loading="lazy" /><span class="photo-tag">TOPADERAS</span><span class="photo-caption">El pueblo se reúne</span></button>
          <button class="gallery-card" data-index="9" aria-label="Ver foto: Fiesta en la plaza"><img src="/gallery/topadera-2.jpg" alt="Celebración y convivencia en San Pedro" loading="lazy" /><span class="photo-tag">FIESTA DEL PUEBLO</span><span class="photo-caption">Aquí se vive diferente</span></button>
        </div>
      </div>
      <p class="gallery-note">Una selección de 10 momentos. Pulsa cualquier foto para verla en grande.</p>
    </section>

    <section class="collection-section" id="coleccion">
      <div class="collection-layout section-wrap">
        <div class="collection-copy"><p class="eyebrow">LLEVA CONTIGO LA FIESTA</p><h2>Elige tu recuerdo.<br /><em>Nosotros lo preparamos.</em></h2><p>El video completo de las topaderas y los bailes, o esa fotografía que quieres imprimir y guardar. Atención directa por WhatsApp.</p><a class="text-link" href="#precios">Explorar formatos <span>↘</span></a></div>
        <div class="product-cards" id="precios">
          <article class="product-card video-product">
            <div class="product-image"><img src="/gallery/jinete.jpg" alt="Avance visual de las topaderas" loading="lazy" /><div class="play-button" aria-hidden="true">▶</div><span class="preview-label">VISTA PREVIA · 10 S</span><span class="preview-missing">El avance en video estará disponible próximamente</span></div>
            <div class="product-info"><div class="product-kicker">VIDEO · TOPADERAS Y BAILES</div><h3>La fiesta completa</h3><p>Revive la emoción desde cualquier lugar.</p><div class="product-price-row"><span>Digital <strong>$600</strong></span><span>En USB <strong>$700</strong></span></div><button class="product-cta" data-order="video" data-media="fiesta-completa">Apartar el video <span>↗</span></button></div>
          </article>
          <article class="product-card photo-product">
            <div class="product-image"><img src="/gallery/fiesta-color.jpg" alt="Fotografía destacada de la fiesta" loading="lazy" /><span class="print-label">EDICIÓN RECUERDO</span></div>
            <div class="product-info"><div class="product-kicker">FOTOGRAFÍAS · TAMAÑO 4×6</div><h3>Tu momento favorito</h3><p>Escoge una imagen de la galería y guárdala para siempre.</p><div class="product-price-row"><span>Digital <strong>$30</strong></span><span>Impresa <strong>$50</strong></span></div><button class="product-cta" data-order="photo" data-media="fiesta-color">Elegir fotografía <span>↗</span></button></div>
          </article>
        </div>
      </div>
    </section>

    <section class="price-strip section-wrap">
      <div class="price-intro"><p class="eyebrow dark-eyebrow">SENCILLO Y DIRECTO</p><h2>Precios claros.<br /><em>Recuerdos para siempre.</em></h2></div>
      <div class="price-item"><span class="price-icon">▶</span><div><b>Video digital</b><small>Entrega digital</small></div><strong>$600</strong></div>
      <div class="price-item"><span class="price-icon">▣</span><div><b>Video en USB</b><small>Recuerdo físico</small></div><strong>$700</strong></div>
      <div class="price-item"><span class="price-icon">▧</span><div><b>Foto digital</b><small>Por fotografía</small></div><strong>$30</strong></div>
      <div class="price-item"><span class="price-icon">▤</span><div><b>Foto impresa</b><small>4×6 o 6×4 · por foto</small></div><strong>$50</strong></div>
      <p class="currency-note">Precios en pesos mexicanos (MXN). La entrega y forma de pago se confirman por WhatsApp.</p>
    </section>

    <section class="how-section section-wrap">
      <div class="how-heading"><p class="eyebrow dark-eyebrow">¿CÓMO LO RECIBO?</p><h2>En tres pasos,<br /><em>listo para revivir.</em></h2></div>
      <div class="steps"><article><span>01</span><h3>Escoge</h3><p>Elige video o fotos, en formato digital o impreso.</p></article><article><span>02</span><h3>Confirma</h3><p>Escríbenos por WhatsApp. Revisamos tu pedido y el pago contigo.</p></article><article><span>03</span><h3>Disfruta</h3><p>Después de validar el pago, recibirás tu entrega. Los enlaces digitales serán de un solo uso.</p></article></div>
    </section>

    <section class="closing-cta"><div class="closing-text"><p class="eyebrow">¿TIENES DUDAS O BUSCAS UNA FOTO?</p><h2>El Tigre te ayuda<br /><em>a encontrarla.</em></h2></div><a class="button button-gold" href="https://wa.me/523118470860?text=Hola%2C%20quiero%20informes%20sobre%20las%20fotos%20y%20videos%20de%20San%20Pedro%20Lagunillas." target="_blank" rel="noreferrer">Hablar por WhatsApp <span>↗</span></a><span class="closing-number">311 847 0860</span></section>
  </main>

  <footer class="site-footer"><a class="footer-brand" href="#inicio"><img src="/gallery/logo.jpg" alt="" /><span>FOTOS Y VIDEO<br /><b>EL TIGRE</b></span></a><span>San Pedro Lagunillas, Nayarit</span><span>© 2026 Fotos y Video El Tigre</span><a href="https://wa.me/523118470860" target="_blank" rel="noreferrer">WhatsApp ↗</a></footer>

  <dialog class="order-dialog" id="order-dialog" aria-labelledby="order-title"><form method="dialog"><button class="dialog-close" aria-label="Cerrar">×</button></form><p class="eyebrow dark-eyebrow">PEDIDO DIRECTO</p><h2 id="order-title">Tu recuerdo, a un paso.</h2><p class="dialog-description">Selecciona cómo quieres recibirlo. El equipo de El Tigre confirmará el total y el método de pago por WhatsApp.</p><div class="order-summary" id="order-summary"></div><label class="form-label" for="order-format">Formato</label><select id="order-format"></select><div class="photo-select-wrap" id="photo-select-wrap"><label class="form-label" for="order-photo">Fotografía de la galería</label><select id="order-photo"><option value="fiesta-color">Fiesta de espuma y color</option><option value="fiesta-noche">La fiesta de noche</option><option value="familia">Recuerdo en familia</option><option value="jinete">Jinete en la topadera</option><option value="amigos">Amigos de fiesta</option><option value="arco-san-pedro">Arco de San Pedro</option><option value="espuma">Pura fiesta, pura espuma</option><option value="recuerdo-en-pareja">Recuerdo en pareja</option><option value="topadera-1">Topadera entre amigos</option><option value="topadera-2">Fiesta en la plaza</option></select></div><label class="form-label" for="order-quantity">Cantidad</label><div class="quantity-control"><button type="button" id="qty-minus" aria-label="Restar una unidad">−</button><input id="order-quantity" type="number" min="1" max="20" value="1" inputmode="numeric" /><button type="button" id="qty-plus" aria-label="Añadir una unidad">+</button></div><div class="total-line"><span>Total estimado</span><strong id="order-total">$600 MXN</strong></div><p class="secure-note">El pedido queda pendiente hasta confirmar el pago. Nunca te pediremos datos bancarios por esta página.</p><button class="button button-gold dialog-submit" id="send-order">Continuar por WhatsApp <span>↗</span></button><p class="dialog-error" id="dialog-error" role="status"></p></dialog>

  <dialog class="lightbox-dialog" id="lightbox" aria-label="Fotografía ampliada"><button class="lightbox-close" id="lightbox-close" aria-label="Cerrar imagen">×</button><button class="lightbox-arrow lightbox-prev" id="lightbox-prev" aria-label="Imagen anterior">←</button><img id="lightbox-image" src="" alt="" /><button class="lightbox-arrow lightbox-next" id="lightbox-next" aria-label="Imagen siguiente">→</button><p id="lightbox-caption"></p></dialog>
  <script src="/static/app.js" defer></script>
</body>
</html>`))

export default app
