const header = document.querySelector("[data-header]");
const heroPhoto = document.querySelector("[data-hero-photo]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fontMap = {
  "Bebas Neue": '"Bebas Neue", "Arial Narrow", sans-serif',
  Syne: '"Syne", "Helvetica Neue", sans-serif',
  Anton: '"Anton", "Arial Narrow", sans-serif',
  Oswald: '"Oswald", "Arial Narrow", sans-serif',
  "Archivo Black": '"Archivo Black", "Helvetica Neue", sans-serif',
};

function applyContent(content) {
  if (!content) return;

  document.querySelectorAll("[data-bind]").forEach((element) => {
    const key = element.dataset.bind;
    if (key && typeof content[key] === "string") {
      element.textContent = content[key];
    }
  });

  document.querySelectorAll("[data-image]").forEach((element) => {
    const key = element.dataset.image;
    if (key && content[key]) element.src = content[key];
  });

  const phoneLink = document.querySelector('[data-link="phone"]');
  const emailLink = document.querySelector('[data-link="email"]');
  const instagramLink = document.querySelector('[data-link="instagram"]');
  if (phoneLink && content.phone) phoneLink.href = `tel:${content.phone.replace(/[^+\d]/g, "")}`;
  if (emailLink && content.email) emailLink.href = `mailto:${content.email}`;
  if (instagramLink && content.instagram) {
    instagramLink.href = `https://www.instagram.com/${content.instagram.replace(/^@/, "")}`;
  }

  const root = document.documentElement;
  if (content.accentColor) root.style.setProperty("--orange", content.accentColor);
  if (content.backgroundColor) root.style.setProperty("--ink", content.backgroundColor);
  if (content.displayFont && fontMap[content.displayFont]) {
    root.style.setProperty("--font-display", fontMap[content.displayFont]);
  }
}

applyContent(window.SOVA_CONTENT);
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type === "SOVA_PREVIEW") applyContent(event.data.content);
});

function updateHeaderAndHero() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 24);

  if (heroPhoto && !reducedMotion && y < window.innerHeight * 1.2) {
    const shift = Math.min(y * 0.09, 72);
    const scale = 1.04 + Math.min(y / 9000, 0.08);
    heroPhoto.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
  }
}

let scrollFrame = 0;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(() => {
        updateHeaderAndHero();
        scrollFrame = 0;
      });
    }
  },
  { passive: true },
);

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
  document.body.classList.remove("nav-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (reducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -30px" },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

updateHeaderAndHero();
