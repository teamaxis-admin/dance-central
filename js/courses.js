// Cartelera de intensivos, talleres y cursos de temporada.
//
// Aquí NO van los estilos del catálogo (baile moderno, contemporáneo, hip hop,
// reggaetón, salsa y cumbia): cada uno ya tiene su panel en "Encuentra tu ritmo".
// Esta lista es solo para lo que se anuncia por temporada y luego se retira.
//
// Mientras esté vacía, la cartelera completa —encabezado y galería— se oculta
// sola. Al agregar un objeto reaparece, sin tocar el HTML.
//
// Campos: title y (image o video) son obligatorios. Opcionales: category, alt,
// caption y poster (respaldo del video).
//
//   window.danceCourses = [
//     {
//       title: "INTENSIVO DE SALSA Y CUMBIA",
//       category: "CURSOS Y TALLERES",
//       image: "assets/media/curso-salsa.webp",
//       alt: "Cartel del intensivo de salsa y cumbia de Dance Central",
//       caption: "Confirma fechas y costos antes de anunciarlo como vigente."
//     }
//   ];
//
// Confirma fechas, horarios y precios con el estudio antes de publicar un
// anuncio. Evita dejar carteles de ediciones pasadas con etiqueta de vigente.
window.danceCourses = [];
