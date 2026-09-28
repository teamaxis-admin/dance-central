# Dance Central

Landing page estática en HTML, CSS y JavaScript. No requiere npm, compilación ni backend.

## Abrir la página

Abre `index.html` en tu navegador. También puedes usar Live Server desde tu editor.

Si tienes Python instalado, ejecuta dentro de esta carpeta:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Después visita http://127.0.0.1:4173. Para revisar con otro dispositivo de tu red, usa la herramienta de previsualización que prefieras y su configuración de acceso local.

## Contenido e interacciones

- Video de portada con reproducción silenciosa, pausa y fotografía de respaldo.
- Entrada del símbolo desde la esquina superior derecha al cargar la página desde arriba, también al recargar.
- Menú móvil con control por teclado y cabecera fija al desplazarse.
- Shows para XV años, bodas y recepciones temáticas. Al elegir uno, queda seleccionado en la consulta.
- Presentación del estudio y sus clases.
- Dos carruseles visibles: del estudio al escenario, y cartelera de clases y cursos. Admiten imágenes y videos, flechas, contador, teclado y gestos táctiles.
- Consulta por WhatsApp con tipo de evento, fecha y comentario. El visitante revisa y envía el mensaje en WhatsApp; la página no envía mensajes automáticamente.
- Mapa de Google Maps antes del footer, con selector de mapa o satélite, teléfono y enlaces para llegar.
- Movimiento reducido: sin entrada animada ni reproducción automática del video; los carruseles cambian sin animación. Los videos de las galerías se pausan al salir de la diapositiva o de la pantalla.

## Archivos

- `index.html`: contenido y estructura.
- `css/styles.css`: diseño, tipografía y adaptación a pantallas.
- `js/main.js`: navegación, video, cotización y cartelera.
- `js/courses.js`: contenido de la cartelera, con imágenes o videos.
- `assets/media/`: imágenes WebP y video preparados para la web.
- `assets/fonts/`: Barlow Condensed y su licencia SIL Open Font License.
- `assets/logos/dance-mark.svg`: símbolo aislado del SVG original para la cabecera.
- Las imágenes y videos originales permanecen en las carpetas donde los colocaste.

## Agregar un curso

1. Guarda su cartel en `assets/images/`, por ejemplo `curso-salsa.jpg`.
2. Agrega un objeto a la lista de `js/courses.js`:

```js
window.danceCourses = [
  {
    title: "Intensivo de salsa y cumbia",
    image: "assets/images/curso-salsa.jpg",
    alt: "Cartel del intensivo de salsa y cumbia de Dance Central",
    caption: "Curso impartido. Consulta próximas ediciones.",
    message: "Hola, ¿tendrán nuevas fechas para el intensivo de salsa y cumbia?"
  }
];
```

La cartelera muestra un elemento por vez, conserva las proporciones de los carteles y tiene controles visibles con un contador. Incluye el cartel de baile moderno y un fragmento real de las clases. Para añadir video, usa `video` con la ruta del archivo y `poster` con la imagen de respaldo en lugar de `image`. Los campos opcionales `category` y `linkLabel` permiten personalizar el encabezado y el enlace. Una lista vacía oculta únicamente la galería.

Confirma las fechas, horarios y precios antes de anunciar inscripciones vigentes. Evita incluir carteles antiguos con una etiqueta de próxima apertura.

## Material utilizado

- `imagen-dance4.png`: presentación de shows.
- `imagen-dance1.png`: comunidad del estudio.
- `imagen-dance3.png`: anuncio de baile moderno en la cartelera.
- `imagen-dance5.png`: fotografía de la sección Encuentra tu ritmo, servida como `assets/media/dance-rhythm.webp`.
- `video_dance_central.mp4`: fragmento de 13 segundos, del segundo 6 al 19, sin audio y preparado para reproducción web.
- `logo-dance.svg`: origen del símbolo usado en la cabecera.

Las tres imágenes se prepararon como WebP con un peso conjunto aproximado de 588 KB. El video original y las fotos no se modificaron. La fuente se sirve localmente. El mapa incrustado necesita conexión a Google Maps y se carga de forma diferida al acercarse a la sección.

## Información a confirmar antes de publicar

El teléfono, la ubicación y las redes se transcribieron del material proporcionado. Deben revisarse con el negocio antes de publicar. No se inventaron paquetes, precios ni disponibilidad de clases. Los estilos corresponden a las publicaciones compartidas y sus enlaces invitan a consultar disponibilidad.

El cartel del intensivo compartido en el chat todavía no está en la carpeta de imágenes. La cartelera ya muestra el material de clases disponible y admite nuevos anuncios de cursos con información vigente confirmada.

## Referencias de dirección visual

- Nederlands Dans Theater: https://www.ndt.nl/en/
- BASE Dance Studios: https://www.basedancestudios.com/

La composición usa el material de Dance Central. No se copiaron código, fotografías ni videos de los sitios de referencia.

## Color y tipografía

El acento de marca es morado ciruela (#71437e). En algunos títulos, la clase .split-ink aplica un corte diagonal negro/morado dentro de cada letra. El fondo del estudio y los detalles de contacto usan variantes suaves del mismo color.

## Mapa, testimonios y redes

- El mapa consulta el nombre y la dirección de Dance Central. Los botones alternan la vista callejera y la satelital manteniendo esa ubicación. Se verificaron visualmente ambas vistas y el marcador del estudio.
- La sección de experiencias contiene tres textos ficticios, identificados como testimonios de muestra. Deben sustituirse por reseñas reales antes de publicar una versión comercial.
- El footer incluye iconos SVG de Instagram y Facebook, junto con etiquetas de texto y enlaces a los perfiles.
- El efecto diagonal de los títulos se aplica a cada letra. Los lectores de pantalla reciben una sola copia del texto.

Referencia para insertar mapas: https://support.google.com/maps/answer/7101463?hl=es
## Llamado a la acción y movimiento

- WhatsApp queda fijo en la esquina inferior derecha. En escritorio incluye texto; en móvil usa el icono con nombre accesible.
- Los títulos aparecen por palabras y los fragmentos bicolor por letras. Las fotos y algunos textos entran al alcanzar su sección; cada aparición se reproduce una sola vez por carga.
- La animación del logo ya no se bloquea mediante sessionStorage. Se omite si la página se abre en una sección interior, si se empieza a desplazar o si está activada la preferencia de movimiento reducido.
- Al activar movimiento reducido se completan las animaciones pendientes y el contenido permanece visible. Sin JavaScript, los textos, la imagen y el enlace flotante siguen disponibles.
- Se retiró el párrafo explicativo de los testimonios. Se mantienen las etiquetas breves que identifican las opiniones como ejemplos.
## Imágenes y actualización de estilos

- Las fotos tienen un zoom suave de 4.5% al pasar el cursor; los carteles usan 2.5%. El encuadre contiene el efecto para que no se desplace el contenido. Los videos conservan sus controles sin zoom.
- El botón flotante de WhatsApp cambia gradualmente de morado a negro al pasar el cursor. Su SVG tiene dimensiones explícitas de 29 x 29 tanto en HTML como en CSS.
- Las referencias a CSS y JavaScript llevan una versión basada en su contenido para evitar mezclar HTML actualizado con archivos antiguos en caché. Al cambiar esos archivos, actualiza el parámetro `v` de sus referencias en `index.html`.
- El zoom se activa con ratón o trackpad y se omite con la preferencia de movimiento reducido.