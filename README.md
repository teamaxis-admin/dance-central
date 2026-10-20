# Dance Central

Sitio estático en HTML, CSS y JavaScript. Sin npm, sin compilación, sin backend.

## Desarrollo

Abre `index.html` en el navegador o usa Live Server. Con Python:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

## Arquitectura

Dos páginas:

| Archivo | Contenido |
|---|---|
| `index.html` | Landing: shows, estudio, clases, experiencias, contacto y ubicación. |
| `videos.html` | Galería de los showcases publicados en YouTube. |

**No hay plantillas.** El `<head>`, la cabecera, el footer y el botón de WhatsApp están duplicados en ambos archivos (~55 líneas). Al modificar cualquiera de esos bloques, hay que hacerlo en los dos.

Los enlaces del menú en `videos.html` apuntan a `index.html#clases`, no a `#clases`: las secciones viven en la landing y un ancla suelta no haría nada.

### Archivos

```
index.html
videos.html
css/
  styles.css           base, tipografía, retícula y adaptación a pantallas
  poster-surfaces.css  texturas y paleta por sección
  interactions.css     hover y foco
  class-panels.css     vista por disciplina
  videos.css           cuadrícula de videos.html
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

**Al modificar cualquier archivo de `css/` o `js/`, recalcula su hash y actualiza el `?v=` en las dos páginas.** Si no, los cambios no llegan a quien ya visitó el sitio.

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

## Despliegue

Netlify, desde la rama `main`. No requiere build: el directorio de publicación es la raíz.
