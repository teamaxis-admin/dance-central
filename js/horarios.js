"use strict";

// Filtro de la página de horarios. Sin JavaScript se ve la semana completa y
// los botones no aparecen; aquí solo se ocultan las clases que no son de la
// disciplina elegida, y los días que se quedan vacíos.
//
// La disciplina viaja en el hash (horarios.html#twerk): así los enlaces de
// la landing llegan ya filtrados y un filtro se puede compartir tal cual.
// El menú móvil y el año del footer los resuelve js/videos.js.

const filterBar = document.querySelector(".schedule-filter");
const schedule = document.querySelector("#semana");
const statusLine = document.querySelector("#schedule-status");
const signup = document.querySelector("#signup-link");

if (filterBar && schedule && statusLine) {
  const buttons = [...filterBar.querySelectorAll("[data-filter]")];
  const slots = [...schedule.querySelectorAll(".slot")];
  const days = [...schedule.querySelectorAll(".day")];
  const names = new Map(buttons.map(button => [button.dataset.filter, button.textContent.trim()]));
  const signupBase = signup ? signup.href.split("?")[0] : "";

  const describe = (name, open, company) => {
    const total = open + company;
    let text = `${name}: ${total} ${total === 1 ? "clase" : "clases"} a la semana`;
    if (company) text += `, ${company} solo para compañías`;
    return `${text}.`;
  };

  const apply = style => {
    const all = style === "todas";
    let open = 0;
    let company = 0;
    slots.forEach(slot => {
      const match = all || slot.dataset.style === style;
      slot.hidden = !match;
      if (!match) return;
      if (slot.classList.contains("is-company")) company += 1;
      else open += 1;
    });
    days.forEach(day => { day.hidden = !day.querySelector(".slot:not([hidden])"); });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === style)));
    // En el celular la fila de botones se desliza: que el activo quede a la vista.
    const active = buttons.find(button => button.dataset.filter === style);
    if (active && filterBar.scrollWidth > filterBar.clientWidth) {
      const offset = active.getBoundingClientRect().left - filterBar.getBoundingClientRect().left;
      filterBar.scrollLeft += offset - 24;
    }
    statusLine.textContent = all ? "" : describe(names.get(style), open, company);
    if (signup) {
      const wish = all ? "" : ` a ${names.get(style)}`;
      const message = `Hola, vi los horarios en la página de Dance Central y quiero inscribirme${wish}.`;
      signup.href = `${signupBase}?text=${encodeURIComponent(message)}`;
    }
  };

  const fromHash = () => {
    const style = decodeURIComponent(location.hash.slice(1));
    return style !== "todas" && names.has(style) ? style : null;
  };

  buttons.forEach(button => button.addEventListener("click", () => {
    const style = button.dataset.filter;
    apply(style);
    history.replaceState(null, "", style === "todas" ? location.pathname + location.search : `#${style}`);
  }));

  // Solo un hash de disciplina mueve el filtro: "#contenido" (saltar al
  // contenido, volver arriba) también cambia el hash y no debe reiniciarlo.
  window.addEventListener("hashchange", () => {
    const style = fromHash();
    if (style) apply(style);
  });

  filterBar.hidden = false;
  const initial = fromHash();
  apply(initial || "todas");
  if (initial) schedule.scrollIntoView({ block: "start" });
}

// Copiar la CLABE. Teclear 18 dígitos en el celular es donde más se equivoca
// la gente. El botón solo aparece si el navegador deja escribir en el
// portapapeles, lo que exige HTTPS: probando en local por IP no se ve.
const copyButton = document.querySelector(".copy-clabe");
const copyStatus = document.querySelector("#copy-status");

if (copyButton && navigator.clipboard && window.isSecureContext) {
  let reset;
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
    } catch {
      if (copyStatus) copyStatus.textContent = "No se pudo copiar. Mantén presionado el número para copiarlo.";
      return;
    }
    copyButton.textContent = "Copiada";
    copyButton.dataset.copied = "";
    if (copyStatus) copyStatus.textContent = "CLABE copiada.";
    clearTimeout(reset);
    reset = setTimeout(() => {
      copyButton.textContent = "Copiar";
      delete copyButton.dataset.copied;
    }, 2400);
  });
}
