# Dance Central

Sitio estático en HTML, CSS y JavaScript. Sin npm, sin compilación, sin backend.

## Desarrollo

Abre `index.html` en el navegador o usa Live Server. Con Python:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

## Arquitectura

Cinco páginas:

| Archivo | Contenido |
|---|---|
| `index.html` | Landing: shows, estudio, clases, experiencias, contacto y ubicación. |
| `horarios.html` | Horario semanal de las dos aulas y extras, fichas y precios, y los carteles para descargar. |
| `videos.html` | Galería de los showcases publicados en YouTube. |
| `privacidad.html` | Aviso de privacidad. |
| `404.html` | Página de error. Cloudflare Pages la sirve sola, sin configurarla. |

**No hay plantillas.** El `<head>`, la cabecera, el footer y el botón de WhatsApp están duplicados en todas las páginas. Al modificar cualquiera de esos bloques, hay que hacerlo en todas.

Los enlaces del menú en `videos.html` apuntan a `index.html#clases`, no a `#clases`: las secciones viven en la landing y un ancla suelta no haría nada.

### Archivos

```
index.html
horarios.html
videos.html
privacidad.html
404.html
robots.txt
sitemap.xml
apple-touch-icon.png
css/
  styles.css           base, tipografía, retícula y adaptación a pantallas
  poster-surfaces.css  texturas y paleta por sección
  interactions.css     hover y foco
  class-panels.css     vista por disciplina (también la usan los shows)
  shows.css            tarjetas de shows para eventos
  evento.css           franja de próximo evento (showcase)
  videos.css           cuadrícula de videos.html
  horarios.css         semana, fichas y carteles de horarios.html
  legal.css            aviso de privacidad
  not-found.css        página 404
js/
  main.js              landing: nav, video, formulario, mapa, carruseles, paneles
  courses.js           contenido de la cartelera de cursos
  videos.js            menú y año del footer de todas las páginas salvo la landing
  vendor/              hls.js, solo para los videos en HLS
  horarios.js          filtro por disciplina de horarios.html
assets/
  media/               todo lo que el sitio sirve, ya optimizado
  media/videos/        miniaturas de YouTube
  media/horarios/      carteles de horarios y fichas (JPG para descargar, WebP miniatura)
  media/shows/         fotos, portadas y video de XV años, bodas y temáticas
  media/eventos/       carteles del próximo evento y de la cartelera (JPG para descargar, WebP miniatura)
  media/hls/           videos largos en trozos (HLS), alta y baja calidad
  logos/               marca
  fonts/               Barlow Condensed + licencia OFL (la licencia no se borra)
  textures/            SVG de grano y brochazos
  images/              material original del cliente, no se sirve
```

Regla: si algo lo usa el sitio, va en `assets/media/`.

## Versionado de caché

Las referencias a CSS y JS llevan `?v=` con los **primeros 12 caracteres del SHA-256 del archivo**. Evita que un HTML nuevo se mezcle con hojas viejas en caché del navegador.

**Al modificar cualquier archivo de `css/` o `js/`, recalcula su hash y actualiza el `?v=` en todas las páginas.** Si no, los cambios no llegan a quien ya visitó el sitio.

```powershell
(Get-FileHash css\styles.css -Algorithm SHA256).Hash.ToLower().Substring(0,12)
```

```sh
sha256sum css/styles.css | cut -c1-12
```

## Codificación

UTF-8 **sin BOM**. No edites CSS ni HTML con `Set-Content -Encoding utf8` de PowerShell: añade BOM y corrompe los acentos. Usa el editor o Python con `io.open(..., encoding="utf-8", newline="")`.

## Agregar contenido

**Un curso a la cartelera** — guarda el cartel optimizado en `assets/media/` y añade un objeto a `js/courses.js`:

```js
window.danceCourses = [
  {
    title: "INTENSIVO DE SALSA Y CUMBIA",
    category: "CURSOS Y TALLERES",
    image: "assets/media/curso-salsa.webp",
    alt: "Cartel del intensivo de salsa y cumbia",
    caption: "Consulta próximas fechas."
  }
];
```

Obligatorios: `title` y (`image` o `video`). Opcionales: `category`, `alt`, `caption`, `poster`.
Con la lista vacía la cartelera se oculta completa y reaparece sola al agregar un objeto.

**Una disciplina** — un `<li>` con `data-style` dentro del grupo que le toque (Urbano, Latino, Técnica y escena, Niños), y un `<article class="style-panel">` con `id="estilo-<slug>"`. El carrusel interno se inicializa solo con `data-carousel`. Mientras un estilo no tenga fotos, su `panel-body` lleva `is-text-only` y no se pone `panel-media`.

**Fotos o videos de un show** — mismo esquema que las disciplinas: tarjeta con `data-show` y panel `id="show-<slug>"` (`xv-anos`, `bodas`, `tematicas`). Las fotos van en `assets/media/shows/` a 1200×800; las verticales se centran sobre una copia desenfocada de sí mismas para no recortar el vestuario. Las portadas de las tarjetas son 900×1125.

**Videos largos** — Cloudflare Pages no sirve archivos de más de 25 MB, así que un video de más de ~30 s no cabe en un MP4 sin perder calidad. Esos van en HLS: trozos de 4 s en dos calidades dentro de `assets/media/hls/<nombre>/` (`index.m3u8`, `alta/`, `baja/`). El `<video>` lleva `data-hls` con la ruta del `index.m3u8` y un MP4 ligero en `<source>` como respaldo. Safari y Chrome reproducen HLS por sí mismos; los demás cargan `js/vendor/hls.light.min.js` (hls.js 1.7.3, licencia Apache 2.0 al lado). El reproductor empieza en la calidad baja y sube sola si la conexión lo permite.

**El próximo evento** — la franja `#evento`, debajo de la portada, lleva la fecha en `data-event-until="AAAA-MM-DD"` y se oculta sola al día siguiente. Para el siguiente evento se cambian el texto, los precios, los carteles de `assets/media/eventos/` y esa fecha; si no hay evento, se puede borrar la sección completa.

**Los horarios** — cada temporada cambian dos cosas en `horarios.html`, y van juntas:

1. El texto: un `<li class="slot">` por clase dentro del día que toca, en orden de hora. `data-style` es la disciplina del filtro; si es nueva, agrega también su botón `data-filter` con el mismo valor. Las clases exclusivas de compañías llevan `is-company` y la etiqueta `slot-flag`.
2. Los carteles en `assets/media/horarios/`: el JPG a 1200×1600 y la miniatura WebP a 480×640, con el mismo nombre.

Si se actualiza uno y no el otro, la página y el cartel se contradicen. Los precios de las fichas están en la misma página.

Los enlaces "Consulta horarios" de la landing llevan la disciplina en el hash (`horarios.html#heels`) y la página llega ya filtrada; el valor tiene que coincidir con un `data-filter`.

**Un video** — guarda la miniatura como `assets/media/videos/video-<ID>.webp` y copia un bloque `<li class="video-card">` cambiando el ID, el nombre y la imagen.

## Notas de implementación

- **El logotipo** son dos máscaras CSS (`dance-dance.svg` y `dance-central.svg`) para poder dar un color a cada palabra según el estado del header.
- **El video de portada** tiene dos versiones: recorte 16:9 para pantallas apaisadas y el original vertical para las verticales. La fuente se elige con `matchMedia` en `main.js`, no con el atributo `media` de `<source>`, que no es fiable dentro de `<video>`. Se codifican desde el original del cliente a 1600×900 y 900×1600, H.264 High, `-crf 22` con tope de 3.5 y 3 Mbps, sin reducción de ruido. Por debajo de eso el baile rápido con luces de color se cuadricula; por encima no se gana nada, porque el original ya es suave.
- **Las tarjetas de `videos.html`** abren YouTube en una pestaña nueva; no incrustan el reproductor.
- **El menú** se vuelve desplegable por debajo de 961 px, no de 761: entre esos anchos (tabletas en vertical) los seis enlaces no caben en una línea. El corte vive en el último bloque de `styles.css` y en el `matchMedia` de `main.js` y `videos.js`; si cambia uno, cambian los tres.
- **Los carruseles** comparten `initCarousel()` en `main.js`. El avance automático es opcional, con `data-carousel-autoplay="7000"`.
- **El formulario de contacto** no envía nada: compone el mensaje y abre WhatsApp para que la visitante lo revise.

## Dominio y metadatos

El dominio **`dancecentralstudio.com`** está escrito de forma absoluta en varios sitios, porque Open Graph exige URL completas. Si el dominio cambia hay que tocar **todos** estos:

- `index.html`, `horarios.html`, `videos.html`, `privacidad.html` — `canonical`, `og:url`, `og:image`
- `index.html` — el bloque JSON-LD de `LocalBusiness`
- `sitemap.xml` y `robots.txt`

Las URL canónicas van **sin `.html`** a propósito: Cloudflare Pages redirige `/videos.html` a `/videos` con un 308, así que el canónico apunta al destino final, no al que redirige. Los enlaces internos sí conservan el `.html` para que el sitio siga funcionándo abierto en local.

La tarjeta de WhatsApp y redes es `assets/media/og-dance-central.jpg` (1200×630). Se generó componiendo la foto del confeti (hoy `shows/tematicas-12.webp`) con las dos máscaras del logotipo; si se reemplaza, respeta esas medidas y mantenla por debajo de ~300 KB.

## Despliegue

Cloudflare Pages, conectado a la rama `main`. No requiere build:

| Ajuste | Valor |
|---|---|
| Framework preset | None |
| Build command | *(vacío)* |
| Build output directory | `/` |

Cada `git push` a `main` publica. No hay despliegue manual.
