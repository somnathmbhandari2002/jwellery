const header = document.querySelector("[data-header]");
const loader = document.querySelector(".loader");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navBackdrop = document.querySelector("[data-nav-backdrop]");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll("[data-filter]");
const jewelCards = document.querySelectorAll(".jewel-card");
const lookImages = document.querySelectorAll(".look-tile img");
const appointmentForm = document.querySelector("#appointment");
const viewingDate = document.querySelector("#viewingDate");
const formStatus = document.querySelector(".form-status");
const whatsappDraft = document.querySelector(".whatsapp-draft");
const marqueeTrack = document.querySelector(".gem-marquee div");
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll("[data-hero-dot]");
const heroCount = document.querySelector("[data-hero-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.closest("figure")?.classList.add("image-fallback");
    image.hidden = true;
  });
});

if (marqueeTrack && !marqueeTrack.dataset.cloned) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  marqueeTrack.dataset.cloned = "true";
}

let heroSlideIndex = 0;
let heroSlideTimer;

function setHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === heroSlideIndex);
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === heroSlideIndex;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  if (heroCount) {
    const current = String(heroSlideIndex + 1).padStart(2, "0");
    const total = String(heroSlides.length).padStart(2, "0");
    heroCount.textContent = `${current} / ${total}`;
  }
}

function stopHeroSlider() {
  window.clearInterval(heroSlideTimer);
}

function startHeroSlider() {
  stopHeroSlider();

  if (reduceMotion.matches || heroSlides.length < 2) {
    return;
  }

  heroSlideTimer = window.setInterval(() => {
    setHeroSlide(heroSlideIndex + 1);
  }, 4600);
}

setHeroSlide(0);
startHeroSlider();

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setHeroSlide(Number(dot.dataset.heroDot || 0));
    startHeroSlider();
  });
});

heroSlider?.addEventListener("mouseenter", stopHeroSlider);
heroSlider?.addEventListener("mouseleave", startHeroSlider);
heroSlider?.addEventListener("focusin", stopHeroSlider);
heroSlider?.addEventListener("focusout", startHeroSlider);

reduceMotion.addEventListener?.("change", startHeroSlider);

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("done");
  }, 350);
});

window.setTimeout(() => {
  loader?.classList.add("done");
}, 1600);

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const heroY = Math.min(window.scrollY * -0.035, 0);

  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--hero-y", `${heroY}px`);
  header?.classList.toggle("scrolled", window.scrollY > 24);

  lookImages.forEach((image, index) => {
    const rect = image.getBoundingClientRect();
    const centerDistance = rect.top + rect.height / 2 - window.innerHeight / 2;
    const shift = Math.max(Math.min(centerDistance * -0.03 * (index + 1), 18), -18);
    image.style.setProperty("--look-shift", `${shift.toFixed(2)}px`);
  });
}

function closeMenu() {
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
  if (navBackdrop) {
    navBackdrop.tabIndex = -1;
  }
}

function setMenu(isOpen) {
  nav?.classList.toggle("open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("nav-open", isOpen);
  if (navBackdrop) {
    navBackdrop.tabIndex = isOpen ? 0 : -1;
  }
}

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

navBackdrop?.addEventListener("click", closeMenu);

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 900) {
    closeMenu();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId === "#top" ? document.body : document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();

    const offset = targetId === "#top" ? 0 : 92;
    const top =
      targetId === "#top"
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth"
    });

    if (targetId === "#top") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      history.replaceState(null, "", targetId);
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
  const motion = ["motion-left", "motion-right", "motion-zoom"][index % 3];
  if (!item.classList.contains("hero-content")) {
    item.classList.add(motion);
  }
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
  revealObserver.observe(item);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    jewelCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

if (viewingDate) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  viewingDate.min = `${year}-${month}-${day}`;
}

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(appointmentForm);
  const name = String(formData.get("name") || "").trim();
  const message = [
    "Hello Noirva Jewels, I want to book a private jewellery viewing.",
    `Name: ${name}`,
    `Phone: ${formData.get("phone")}`,
    `Interest: ${formData.get("interest")}`,
    `Viewing date: ${formData.get("date")}`,
    `Budget: ${formData.get("budget")}`,
    `Notes: ${formData.get("notes") || "None"}`
  ].join("\n");

  if (whatsappDraft) {
    whatsappDraft.href = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    whatsappDraft.hidden = false;
  }

  if (formStatus) {
    formStatus.textContent = `Thank you, ${name}. Your private viewing draft is ready.`;
  }
});
