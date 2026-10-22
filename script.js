const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton?.querySelector(".sr-only")?.replaceChildren("Abrir menú");
}

menuButton?.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  navigation?.classList.toggle("is-open", opening);
  document.body.classList.toggle("menu-open", opening);
  menuButton.querySelector(".sr-only")?.replaceChildren(opening ? "Cerrar menú" : "Abrir menú");
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll(".reveal").forEach((element) => {
  if (reduceMotion) element.classList.add("is-visible");
  else revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navigationLinks.forEach((link) => {
      link.classList.toggle("is-active", link.hash === `#${visible.target.id}`);
    });
  },
  { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55%" },
);

sections.forEach((section) => activeSectionObserver.observe(section));

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});
