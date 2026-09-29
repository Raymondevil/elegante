# Fotos y Video El Tigre

## Objetivo
Sitio de muestra y catálogo para distribuir fotografías y videos de las topaderas, los toros y los bailes de San Pedro Lagunillas, Nayarit. Hecho con Hono + Cloudflare Pages y preparado para conectar almacenamiento de pedidos/descargas.

## Funciones implementadas
- Portada editorial y navegación adaptable a móvil.
- Galería de 10 fotos seleccionadas del material proporcionado; carrusel horizontal y ampliación con navegación por teclado.
- Catálogo y precios en MXN: video digital $600, video USB $700, foto digital $30 por imagen y foto impresa 4×6 o 6×4 $50 por imagen.
- Selector de formato, fotografía y cantidad; total estimado y mensaje de pedido a WhatsApp 311 847 0860.
- Rutas API modulares para crear pedidos pendientes, marcar el pago desde una operación autenticada y emitir enlaces privados de descarga de un solo uso con vencimiento de 48 horas.
- La entrega privada está diseñada para R2; las órdenes y tokens se guardan en D1. El token se almacena como hash y se consume antes de entregar el archivo.

## Rutas
- `/` — catálogo/galería.
- `/api/health` — estado de configuración de servicios.
- `POST /api/orders` — crear pedido pendiente. JSON: `{ "item":"video|photo", "format":"digital|usb|print", "quantity":1, "mediaId":"fiesta-color" }`.
- `POST /api/orders/:reference/confirm-payment` — confirma el pago con `Authorization: Bearer <ADMIN_TOKEN>`. La confirmación devuelve el enlace de descarga una sola vez para pedidos digitales. Es un punto de integración administrativa; no se debe llamar desde el navegador.
- `GET /api/download/:token` — entrega el archivo si el token sigue válido y no se ha usado; el segundo intento se rechaza.

## Capas
- `src/index.tsx`: composición de la aplicación y la página.
- `src/routes/api.ts`: transporte HTTP y autorización de las rutas administrativas.
- `src/services/order-service.ts`: catálogo, reglas de precio, pedidos y emisión del token.
- `src/types/bindings.ts`: contratos de Cloudflare D1/R2.
- `migrations/0001_orders.sql`: tablas e índices de D1.
- `public/static/`: estilos y comportamiento de la interfaz.
- `public/gallery/`: logo y selección de imágenes de muestra.

El código mantiene límites de servicio para separar responsabilidades. La primera versión se despliega como una aplicación Hono ligera; no se han desplegado microservicios independientes, pues eso multiplicaría infraestructura y coste sin mejorar este flujo inicial.

## Configuración pendiente para producción
1. Añadir el binding D1 `DB` y el binding privado R2 `MEDIA` a la configuración de Cloudflare, y aplicar `migrations/0001_orders.sql`.
2. Subir a R2 los originales digitales (sin marcas de agua) con estas claves exactas: `downloads/video-topaderas-completo.mp4` y `downloads/photos/{fiesta-noche,familia,jinete,amigos,arco-san-pedro,espuma,fiesta-color,recuerdo-en-pareja,topadera-1,topadera-2}.jpg`.
3. Definir el secreto `ADMIN_TOKEN` fuera del código. El equipo confirma manualmente el pago usando la ruta administrativa autenticada y comparte con el comprador el enlace devuelto. Para confirmación automática hay que elegir una pasarela (por ejemplo Mercado Pago) y conectar su webhook firmado; no se acepta una confirmación del navegador como prueba de pago.
4. Cargar el video real de avance de 10 segundos. El proyecto recibido contiene fotografías y logotipo, pero no un archivo de video; por eso la tarjeta de avance lo indica expresamente y no simula una reproducción.
5. Revisar con el propietario los métodos de pago, tiempos/envíos de USB e impresiones, y derechos de uso/publicación de las fotos.

## Integración de pedidos y pago
Sin bindings, el formulario conserva un camino de contacto a WhatsApp y no finge registrar o pagar. Con D1 activo, crea un pedido pendiente y genera folio para WhatsApp. La confirmación actual es manual y protegida; al confirmarse un artículo digital, el enlace de un solo uso vence a las 48 horas y se consume en la primera descarga. Aún no hay pasarela ni webhook configurados.

## Desarrollo
```bash
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000
```

## Estado
- Frontend: implementado.
- API y esquema D1/R2: preparados, requieren configuración de bindings y contenidos privados.
- Video real de vista previa: pendiente de recibir archivo de 10 segundos.
- Pasarela automática: pendiente de elegir proveedor y credenciales.
- Producción: no desplegada.
