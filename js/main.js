"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const video = document.querySelector("#hero-video");
const videoButton = document.querySelector("#video-toggle");
const desktop = window.matchMedia("(min-width: 761px)");

function setMenu(open, returnFocus = false) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  header.classList.toggle("menu-open", open);
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !mobileMenu.hidden) setMenu(false, true);
});
document.addEventListener("click", event => {
  if (!mobileMenu.hidden && !header.contains(event.target)) setMenu(false);
});
header.addEventListener("focusout", () => {
  requestAnimationFrame(() => { if (!header.contains(document.activeElement)) setMenu(false); });
});
desktop.addEventListener("change", () => setMenu(false));

function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 100); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// The moving mark is a decorative copy; the real home link stays in place.
function animateBrand() {
  if (reducedMotion.matches || window.scrollY > 80) return;
  const mark = document.querySelector(".brand-mark");
  if (typeof mark.animate !== "function") return;
  const copy = mark.cloneNode();
  copy.className = "brand-intro";
  copy.alt = "";
  copy.setAttribute("aria-hidden", "true");
  document.body.append(copy);
  const source = copy.getBoundingClientRect();
  const target = mark.getBoundingClientRect();
  document.body.classList.add("intro-brand-hidden");
  const motion = copy.animate([
    { opacity: 0, transform: "translate(55px, -60px) scale(.72) rotate(12deg)", offset: 0 },
    { opacity: 1, transform: "translate(0, 0) scale(1) rotate(0deg)", offset: .25 },
    { opacity: 1, transform: "translate(0, 0) scale(1) rotate(0deg)", offset: .4 },
    { opacity: 1, transform: `translate(${target.left - source.left}px, ${target.top - source.top}px) scale(${target.width / source.width}, ${target.height / source.height})`, offset: 1 }
  ], { duration: 2100, easing: "cubic-bezier(.22,.7,.2,1)", fill: "forwards" });
  copy.style.transformOrigin = "top left";
  const finish = () => {
    copy.remove();
    document.body.classList.remove("intro-brand-hidden");
    window.removeEventListener("resize", finish);
    window.removeEventListener("scroll", finish);
    reducedMotion.removeEventListener("change", finish);
  };
  motion.onfinish = finish;
  motion.oncancel = finish;
  window.addEventListener("resize", finish, { once: true });
  window.addEventListener("scroll", finish, { once: true, passive: true });
  reducedMotion.addEventListener("change", finish, { once: true });
}
requestAnimationFrame(animateBrand);

let userPaused = false;
let mediaFailed = false;
let videoInView = true;
function updateVideoButton() {
  const playing = !video.paused && !video.ended;
  videoButton.querySelector(".video-icon").textContent = playing ? "Ⅱ" : "▶";
  videoButton.querySelector(".video-label").textContent = playing ? "Pausar video" : "Reproducir video";
  videoButton.setAttribute("aria-label", playing ? "Pausar video de portada" : "Reproducir video de portada");
}
async function playVideo() {
  if (mediaFailed) return;
  try { await video.play(); } catch { updateVideoButton(); }
}
video.addEventListener("play", updateVideoButton);
video.addEventListener("pause", updateVideoButton);
const showVideoFallback = () => {
  mediaFailed = true;
  videoButton.hidden = true;
};
video.addEventListener("error", showVideoFallback);
video.querySelector("source").addEventListener("error", showVideoFallback);
videoButton.addEventListener("click", () => {
  if (video.paused) { userPaused = false; playVideo(); }
  else { userPaused = true; video.pause(); }
});
function syncVideo() {
  if (document.hidden || !videoInView || reducedMotion.matches || userPaused) video.pause();
  else playVideo();
}
if ("IntersectionObserver" in window) {
  new IntersectionObserver(entries => {
    videoInView = entries[0].isIntersecting;
    syncVideo();
  }, { threshold: .1 }).observe(video);
} else if (!reducedMotion.matches) { playVideo(); }
document.addEventListener("visibilitychange", syncVideo);
reducedMotion.addEventListener("change", syncVideo);

const eventType = document.querySelector("#event-type");
const eventDate = document.querySelector("#event-date");
const eventForm = document.querySelector("#event-form");
const now = new Date();
eventDate.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const dateField = document.querySelector("#event-date-field");
const formStatus = document.querySelector("#form-status");
const eventNote = document.querySelector("#event-note");
const isClassInquiry = () => eventType.selectedOptions[0]?.dataset.kind === "classes";

function syncInquiry() {
  const classes = isClassInquiry();
  const needsDate = Boolean(eventType.value) && !classes;
  dateField.hidden = !needsDate;
  eventDate.disabled = !needsDate;
  eventDate.required = needsDate;
  document.querySelector(".submit-label").textContent = needsDate ? "Cotizar show por WhatsApp" : "Consultar por WhatsApp";
  eventNote.placeholder = classes ? "Tu nivel, horarios que te convienen o el curso que buscas…" : "Lugar, temática o esa idea que tienes en mente…";
  formStatus.textContent = classes ? "Consulta horarios, niveles y costos. Se abrirá WhatsApp con tu mensaje listo." : "Se abrirá WhatsApp con tu consulta lista para enviar.";
}
eventType.addEventListener("change", syncInquiry);
document.querySelectorAll("[data-event]").forEach(link => {
  link.addEventListener("click", () => {
    eventType.value = link.dataset.event;
    syncInquiry();
  });
});
document.querySelectorAll('[data-inquiry="classes"]').forEach(link => {
  link.addEventListener("click", () => {
    eventType.value = "Clases y cursos";
    syncInquiry();
  });
});
syncInquiry();
window.addEventListener("pageshow", syncInquiry);

eventForm.addEventListener("submit", () => {
  const note = eventNote.value.trim();
  let message;
  if (isClassInquiry()) {
    message = `Hola, vi la página de Dance Central y me interesa recibir información sobre ${eventType.value.toLowerCase()}. ¿Me comparten horarios, niveles y costos?`;
  } else {
    const date = new Date(`${eventDate.value}T12:00:00`);
    const formattedDate = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(date);
    message = `Hola, vi la página de Dance Central y quisiera cotizar un show para ${eventType.value.toLowerCase()} el ${formattedDate}. ¿Me comparten disponibilidad y opciones?`;
  }
  document.querySelector("#whatsapp-message").value = message + (note ? `\n\n${note}` : "");
  formStatus.textContent = "Tu consulta está preparada. Revisa el mensaje en WhatsApp antes de enviarlo.";
});
document.querySelector("#year").textContent = new Date().getFullYear();

// Mantiene la misma dirección al alternar entre mapa y fotografía satelital.
const studioMap = document.querySelector("#studio-map");
document.querySelectorAll("[data-map-type]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") === "true") return;
    const mapUrl = new URL(studioMap.src);
    mapUrl.searchParams.set("t", button.dataset.mapType);
    studioMap.src = mapUrl.toString();
    const satellite = button.dataset.mapType === "k";
    studioMap.title = `${satellite ? "Vista satelital" : "Mapa"} de Dance Central, Avenida Reforma Norte 233, Tehuacán`;
    document.querySelectorAll("[data-map-type]").forEach(option => {
      option.setAttribute("aria-pressed", String(option === button));
    });
    document.querySelector("#map-status").textContent = satellite ? "Vista satelital" : "Vista de mapa";
  });
});

// Cartelera real: admite carteles completos y videos con controles nativos.
const courses = Array.isArray(window.danceCourses) ? window.danceCourses : [];
const courseTrack = document.querySelector("#course-track");
for (const course of courses) {
  if (!course.title || (!course.image && !course.video)) continue;
  const article = document.createElement("article");
  article.className = "carousel-slide course-item";
  article.setAttribute("role", "group");
  article.setAttribute("aria-roledescription", "diapositiva");
  const media = document.createElement("div");
  media.className = "course-media";
  if (course.video) {
    media.classList.add("has-video");
    const clip = document.createElement("video");
    clip.src = course.video;
    clip.controls = true;
    clip.playsInline = true;
    clip.muted = true;
    clip.preload = "none";
    if (course.poster) clip.poster = course.poster;
    clip.setAttribute("aria-label", course.alt || course.title);
    media.append(clip);
  } else {
    const image = document.createElement("img");
    image.src = course.image;
    image.alt = course.alt || `Cartel de ${course.title}`;
    image.loading = "lazy";
    media.append(image);
  }
  const copy = document.createElement("div");
  copy.className = "course-copy";
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = course.category || "CURSOS Y TALLERES";
  const heading = document.createElement("h4");
  heading.textContent = course.title;
  const caption = document.createElement("p");
  caption.textContent = course.caption || "Consulta próximas fechas.";
  copy.append(category, heading, caption);
  article.append(media, copy);
  courseTrack.append(article);
}
document.querySelector("#course-gallery").hidden = !courseTrack.children.length;

function initCarousel(carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = [...track.children];
  if (!slides.length) return;
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const counter = carousel.querySelector("[data-carousel-count]");
  let active = 0;
  let frame = 0;

  const slideLeft = index => slides[index].offsetLeft - slides[0].offsetLeft;
  function render() {
    let nearest = 0;
    for (let i = 1; i < slides.length; i++) {
      if (Math.abs(slideLeft(i) - track.scrollLeft) < Math.abs(slideLeft(nearest) - track.scrollLeft)) nearest = i;
    }
    active = nearest;
    const label = `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (counter.textContent !== label) counter.textContent = label;
    previous.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    carousel.style.setProperty("--carousel-progress", `${100 * (active + 1) / slides.length}%`);
    slides.forEach((slide, index) => {
      slide.inert = index !== active;
      slide.setAttribute("aria-label", `${index + 1} de ${slides.length}`);
      if (index !== active) slide.querySelectorAll("video").forEach(clip => clip.pause());
    });
  }
  function goTo(index, instant = false) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: slideLeft(target), behavior: instant || reducedMotion.matches ? "instant" : "smooth" });
  }
  previous.addEventListener("click", () => goTo(active - 1));
  next.addEventListener("click", () => goTo(active + 1));
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  }, { passive: true });
  track.addEventListener("keydown", event => {
    if (event.target !== track) return; // Conserva los atajos de los controles de video.
    const destinations = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  });
  if ("ResizeObserver" in window) {
    let previousWidth = track.clientWidth;
    new ResizeObserver(() => {
      if (track.clientWidth !== previousWidth) {
        previousWidth = track.clientWidth;
        goTo(active, true);
      }
      render();
    }).observe(track);
  } else {
    window.addEventListener("resize", () => { goTo(active, true); render(); });
  }
  render();
}
document.querySelectorAll("[data-carousel]").forEach(initCarousel);

const galleryVideos = [...document.querySelectorAll(".media-carousel video")];
galleryVideos.forEach(clip => {
  clip.addEventListener("play", () => {
    galleryVideos.forEach(other => { if (other !== clip) other.pause(); });
    video.pause();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) clip.pause();
    }, { threshold: .1 }).observe(clip);
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) galleryVideos.forEach(clip => clip.pause());
});

// El contenido permanece visible sin JavaScript. Las apariciones se ejecutan
// una vez por elemento, y se completan si se activa movimiento reducido.
const motionHeadings = [...document.querySelectorAll("h1, h2, .courses h3, .show-row h3, .footer-wordmark")];
const motionDetails = [...document.querySelectorAll(".section-heading, .shows-intro > p, .studio-copy > p, .studio-photo, .class-poster, .testimonial, .courses-copy, .visit-details, .footer-socials")];
const motionPlayed = new WeakSet();
const runningMotions = new Set();
let motionObserver;
let wordsPrepared = false;

function trackMotion(element, frames, options) {
  const animation = element.animate(frames, options);
  runningMotions.add(animation);
  animation.finished.then(() => runningMotions.delete(animation)).catch(() => runningMotions.delete(animation));
}

function prepareWords() {
  if (wordsPrepared) return;
  motionHeadings.forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.textContent.trim() && !node.parentElement.closest(".split-ink, .sr-only, .motion-word") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part.trim()) fragment.append(document.createTextNode(part));
        else {
          const word = document.createElement("span");
          word.className = "motion-word";
          word.textContent = part;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
  });
  wordsPrepared = true;
}

function revealElement(element) {
  if (motionPlayed.has(element) || reducedMotion.matches) return;
  motionPlayed.add(element);
  if (motionHeadings.includes(element)) {
    const isHero = element.tagName === "H1";
    const parts = [...element.querySelectorAll(".motion-word, .split-glyph")];
    parts.forEach((part, index) => {
      trackMotion(part, [
        { opacity: 0, transform: "translate3d(0, .48em, 0) rotate(2deg)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) rotate(0deg)" }
      ], {
        duration: isHero ? 1000 : 800,
        delay: (isHero ? 220 : 0) + Math.min(index * (isHero ? 110 : 38), 520),
        easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards"
      });
    });
  } else {
    const isPhoto = element.matches(".studio-photo, .class-poster");
    trackMotion(element, [
      { opacity: 0, transform: `translateY(${isPhoto ? 38 : 22}px)` },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: isPhoto ? 1100 : 850, delay: 80, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
  }
}

function setupMotion() {
  if (!Element.prototype.animate || !("IntersectionObserver" in window)) return;
  if (reducedMotion.matches) {
    motionObserver?.disconnect();
    runningMotions.forEach(animation => animation.finish());
    return;
  }
  prepareWords();
  motionObserver?.disconnect();
  motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealElement(entry.target);
      motionObserver.unobserve(entry.target);
    });
  }, { threshold: .16, rootMargin: "0px 0px -35px 0px" });
  [...motionHeadings, ...motionDetails].forEach(element => {
    if (!motionPlayed.has(element)) motionObserver.observe(element);
  });
}
setupMotion();
reducedMotion.addEventListener("change", setupMotion);
