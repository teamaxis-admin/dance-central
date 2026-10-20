"use strict";

// Página de videos. Hoy cada tarjeta es un enlace que abre YouTube, así que
// aquí solo vive el menú móvil y el año del footer.
//
// Por qué no se reproducen aquí mismo: los videos del estudio tienen la
// inserción permitida ("playableInEmbed": true) pero YouTube igual responde
// "este video no está disponible" dentro de un iframe, mientras que un video
// ajeno de control sí reproduce desde el mismo origen. Eso apunta a un
// reclamo de derechos sobre la música, que YouTube no expone públicamente.
//
// Si el cliente lo resuelve, se vuelve a la fachada: cambiar el <a> de cada
// tarjeta por un <button class="video-facade" data-video="ID"> y reactivar
// este bloque, que inserta el reproductor solo al hacer clic:
//
//   document.querySelectorAll(".video-facade").forEach(facade => {
//     facade.addEventListener("click", () => {
//       const player = document.createElement("iframe");
//       player.src = `https://www.youtube-nocookie.com/embed/${facade.dataset.video}?autoplay=1&rel=0`;
//       player.title = facade.dataset.name || "Video de Dance Central";
//       player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
//       player.allowFullscreen = true;
//       facade.replaceWith(player);
//       player.focus({ preventScroll: true });
//     });
//   });

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu && header) {
  const desktop = window.matchMedia("(min-width: 761px)");
  const setMenu = (open, returnFocus = false) => {
    mobileMenu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
    if (returnFocus) menuButton.focus();
  };
  menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));
  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !mobileMenu.hidden) setMenu(false, true);
  });
  document.addEventListener("click", event => {
    if (!mobileMenu.hidden && !header.contains(event.target)) setMenu(false);
  });
  desktop.addEventListener("change", () => setMenu(false));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
