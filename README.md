# Dance Central

Sitio estático en HTML, CSS y JavaScript. Sin npm, sin compilación, sin backend.

## Desarrollo

Abre `index.html` en el navegador o usa Live Server. Con Python:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

## Arquitectura

Cuatro páginas:

| Archivo | Contenido |
|---|---|
| `index.html` | Landing: shows, estudio, clases, experiencias, contacto y ubicación. |
| `videos.html` | Galería de los showcases publicados en YouTube. |
| `privacidad.html` | Aviso de privacidad. |
| `404.html` | Página de error. Cloudflare Pages la sirve sola, sin configurarla. |

**No hay plantillas.** El `<head>`, la cabecera, el footer y el botón de WhatsApp están duplicados en las cuatro páginas. Al modificar cualquiera de esos bloques, hay que hacerlo en todas.

Los enlaces del menú en `videos.html` apuntan a `index.html#clases`, no a `#clases`: las secciones viven en la landing y un ancla suelta no haría nada.

### Archivos

```
index.html
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
  class-panels.css     vista por disciplina
  videos.css           cuadrícula de videos.html
  legal.css            aviso de privacidad
  not-found.css        página 404
js/
  main.js              landing: nav, video, formulario, mapa, carruseles, paneles
  courses.js           contenido de la cartelera de cursos
  videos.js            menú de videos.html
assets/
  media/               todo lo que el sitio sirve, ya optimizado
  media/videos/        miniaturas de YouTube
  logos/               marca
  fonts/               Barlow Condensed + licencia OFL (la licencia no se borra)
  textures/            SVG de grano y brochazos
  images/              material original del cliente, no se sirve
```

Regla: si algo lo usa el sitio, va en `assets/media/`.

## Versionado de caché

Las referencias a CSS y JS llevan `?v=` con los **primeros 12 caracteres del SHA-256 del archivo**. Evita que un HTML nuevo se mezcle con hojas viejas en caché del navegador.

**Al modificar cualquier archivo de `css/` o `js/`, recalcula su hash y actualiza el `?v=` en las cuatro páginas.** Si no, los cambios no llegan a quien ya visitó el sitio.

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

**Una disciplina** — un `<li>` con `data-style` en la lista de estilos, y un `<article class="style-panel">` con `id="estilo-<slug>"`. El carrusel interno se inicializa solo con `data-carousel`.

**Un video** — guarda la miniatura como `assets/media/videos/video-<ID>.webp` y copia un bloque `<li class="video-card">` cambiando el ID, el nombre y la imagen.

## Notas de implementación

- **El logotipo** son dos máscaras CSS (`dance-dance.svg` y `dance-central.svg`) para poder dar un color a cada palabra según el estado del header.
- **El video de portada** tiene dos versiones: recorte 16:9 para pantallas apaisadas y el original vertical para las verticales. La fuente se elige con `matchMedia` en `main.js`, no con el atributo `media` de `<source>`, que no es fiable dentro de `<video>`.
- **Las tarjetas de `videos.html`** abren YouTube en una pestaña nueva; no incrustan el reproductor.
- **Los carruseles** comparten `initCarousel()` en `main.js`. El avance automático es opcional, con `data-carousel-autoplay="7000"`.
- **El formulario de contacto** no envía nada: compone el mensaje y abre WhatsApp para que la visitante lo revise.

## Dominio y metadatos

El dominio **`dancecentralstudio.com`** está escrito de forma absoluta en varios sitios, porque Open Graph exige URL completas. Si el dominio cambia hay que tocar **todos** estos:

- `index.html`, `videos.html`, `privacidad.html` — `canonical`, `og:url`, `og:image`
- `index.html` — el bloque JSON-LD de `LocalBusiness`
- `sitemap.xml` y `robots.txt`

Las URL canónicas van **sin `.html`** a propósito: Cloudflare Pages redirige `/videos.html` a `/videos` con un 308, así que el canónico apunta al destino final, no al que redirige. Los enlaces internos sí conservan el `.html` para que el sitio siga funcionándo abierto en local.

La tarjeta de WhatsApp y redes es `assets/media/og-dance-central.jpg` (1200×630). Se genera componiendo `show-cierre.webp` con las dos máscaras del logotipo; si se reemplaza, respeta esas medidas y mantenla por debajo de ~300 KB.

## Despliegue

Cloudflare Pages, conectado a la rama `main`. No requiere build:

| Ajuste | Valor |
|---|---|
| Framework preset | None |
| Build command | *(vacío)* |
| Build output directory | `/` |

Cada `git push` a `main` publica. No hay despliegue manual.
