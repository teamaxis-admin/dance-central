// Cartelera de intensivos, talleres y cursos de temporada.
//
// Aquí NO van los estilos del catálogo (hip hop, k-pop, flow latino, etc.):
// cada uno ya tiene su panel en "Encuentra tu ritmo".
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
window.danceCourses = [
  {
    title: "DANCE KIDS",
    category: "INSCRIPCIONES ABIERTAS",
    image: "assets/media/eventos/dance-kids-inscripciones-mini.webp",
    alt: "Cartel de inscripciones de Dance Kids para niñas y niños de 6 a 12 años: martes y jueves 6:00 PM, sábados 12:00 PM; mes completo $450, sabatino $300, inscripción $150",
    caption: "Para niñas y niños de 6 a 12 años. Martes y jueves a las 6:00 PM, sábados a las 12:00 PM. Mes completo $450, sabatino $300, inscripción $150."
  },
  {
    title: "BACK TO CLASS 2026",
    category: "REGRESO A CLASES",
    image: "assets/media/eventos/back-to-class-2026-mini.webp",
    alt: "Cartel de Back to Class 2026 de Dance Central con alumnos de distintos estilos en blanco y negro",
    caption: "Vuelve al salón con tu estilo favorito. Consulta horarios y fichas para inscribirte."
  }
];
