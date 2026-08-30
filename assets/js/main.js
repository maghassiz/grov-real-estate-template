document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initFaqAccordion();
  initScrollReveal();
  initFilterPills();
});

/* ---- Mobile / tablet nav toggle ---- */
function initNavToggle() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  if (!header || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.getAttribute("data-nav-open") === "true";
    header.setAttribute("data-nav-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.querySelectorAll(".nav__item, .nav__actions a, .nav__actions button").forEach((el) => {
    el.addEventListener("click", () => {
      header.setAttribute("data-nav-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---- Blog category filter pills (single-select toggle) ---- */
function initFilterPills() {
  const groups = document.querySelectorAll(".filter-pills");

  groups.forEach((group) => {
    const pills = group.querySelectorAll(".filter-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => {
          p.classList.remove("filter-pill--active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("filter-pill--active");
        pill.setAttribute("aria-selected", "true");
      });
    });
  });
}

/* ---- FAQ accordion ---- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const question = item.querySelector(".faq-item__question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      question.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

/* ---- Subtle scroll-reveal (GSAP tween + IntersectionObserver) ----
   IntersectionObserver drives the trigger instead of GSAP ScrollTrigger:
   ScrollTrigger computes trigger offsets from layout at init time, so on
   pages with large below-the-fold images it can lock in offsets before
   images finish loading and shift the layout — leaving sections stuck at
   opacity:0. IntersectionObserver re-checks the live viewport instead, so
   it can't go stale that way. */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const useGsap = typeof gsap !== "undefined";

  if (useGsap) {
    gsap.set(targets, { opacity: 0, y: 24 });
  } else {
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    });
  }

  if (!("IntersectionObserver" in window)) {
    // No IntersectionObserver support: show everything immediately.
    if (useGsap) {
      gsap.set(targets, { opacity: 1, y: 0 });
    } else {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (useGsap) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        } else {
          el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          el.style.opacity = "1";
          el.style.transform = "none";
        }
        observer.unobserve(el);
      });
    },
    // threshold 0 (not e.g. 0.15): intersectionRatio is relative to the
    // target's own height, so a section taller than viewport/threshold
    // (e.g. a long stacked card grid on mobile) could never reach a
    // higher threshold even at full scroll — rootMargin alone controls
    // how close the section must be before it reveals.
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
