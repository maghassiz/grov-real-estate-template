document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initFaqAccordion();
  initScrollReveal();
  initFilterPills();
  initFilterDropdowns();
  initTestimonialsCarousel();
  initBlogHeroSlideshow();
  initFeaturedHoverPreview();
  initStatCounters();
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

/* ---- House list filter pills (placeholder dropdown panels) ---- */
function initFilterDropdowns() {
  const dropdowns = Array.from(document.querySelectorAll(".filters__dropdown"));
  if (!dropdowns.length) return;

  const closeAll = (except) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.setAttribute("data-open", "false");
      dropdown.querySelector(".filters__pill")?.setAttribute("aria-expanded", "false");
    });
  };

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".filters__pill");
    const label = dropdown.querySelector(".filters__pill-label");
    const options = dropdown.querySelectorAll(".filters__dropdown-option");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.getAttribute("data-open") === "true";
      closeAll(dropdown);
      dropdown.setAttribute("data-open", String(!isOpen));
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((o) => {
          o.classList.remove("filters__dropdown-option--active");
          o.setAttribute("aria-selected", "false");
        });
        option.classList.add("filters__dropdown-option--active");
        option.setAttribute("aria-selected", "true");
        if (label) label.textContent = option.textContent;
        dropdown.setAttribute("data-open", "false");
        trigger.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}

/* ---- Testimonials carousel (slides the track left/right through client stories) ---- */
function initTestimonialsCarousel() {
  const section = document.querySelector(".testimonials");
  if (!section) return;

  const track = section.querySelector(".testimonials__track");
  const slides = Array.from(section.querySelectorAll(".testimonials__slide"));
  if (!track || !slides.length) return;

  const counter = section.querySelector(".testimonials__counter");
  const [prevBtn, nextBtn] = section.querySelectorAll(".testimonials__controls .btn--outline");
  const total = slides.length;
  const pad = (n) => String(n).padStart(2, "0");

  let index = Math.max(
    slides.findIndex((slide) => slide.getAttribute("data-active") === "true"),
    0
  );

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.setAttribute("data-active", String(isActive));
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  };

  const go = (delta) => {
    index = (index + delta + total) % total;
    render();
  };

  prevBtn?.addEventListener("click", () => go(-1));
  nextBtn?.addEventListener("click", () => go(1));

  render();
}

/* ---- Blog hero slideshow (cycles featured articles behind the hero panel) ---- */
function initBlogHeroSlideshow() {
  const section = document.querySelector(".blog-hero");
  if (!section) return;

  const track = section.querySelector(".blog-hero__track");
  const slides = Array.from(section.querySelectorAll(".blog-hero__slide"));
  if (!track || !slides.length) return;

  const total = slides.length;
  let index = Math.max(
    slides.findIndex((slide) => slide.getAttribute("data-active") === "true"),
    0
  );

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.setAttribute("data-active", String(isActive));
      slide.toggleAttribute("inert", !isActive);
    });
  };

  const go = (delta) => {
    index = (index + delta + total) % total;
    render();
  };

  // Every slide carries its own prev/next controls (mirrors the visible
  // panel), so bind on the section and let clicks bubble from whichever
  // slide is currently active.
  section.addEventListener("click", (event) => {
    if (event.target.closest(".blog-hero__prev")) go(-1);
    else if (event.target.closest(".blog-hero__next")) go(1);
  });

  render();
}

/* ---- Featured project: hover preview image that follows the cursor ---- */
function initFeaturedHoverPreview() {
  const listing = document.querySelector(".featured__listing");
  if (!listing) return;

  const items = Array.from(listing.querySelectorAll(".featured__item"));
  if (!items.length) return;

  const preview = document.createElement("img");
  preview.className = "featured__cursor-img";
  preview.alt = "";
  preview.setAttribute("aria-hidden", "true");
  listing.appendChild(preview);

  const movePreview = (event) => {
    const rect = listing.getBoundingClientRect();
    preview.style.left = `${event.clientX - rect.left}px`;
    preview.style.top = `${event.clientY - rect.top}px`;
  };

  items.forEach((item) => {
    const src = item.getAttribute("data-preview");

    item.addEventListener("mouseenter", () => {
      if (src) {
        preview.src = src;
        preview.classList.add("is-visible");
      }
      items.forEach((other) => other.classList.toggle("featured__item--active", other === item));
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("featured__item--active");
    });
  });

  listing.addEventListener("mousemove", movePreview);
  listing.addEventListener("mouseleave", () => {
    preview.classList.remove("is-visible");
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

  // Reveal each target's own direct children with a slight stagger instead
  // of fading the whole block in at once — every element inside a section
  // eases in on its own beat when the section enters view.
  const childrenOf = (el) => {
    const kids = Array.from(el.children);
    return kids.length ? kids : [el];
  };
  const allElements = Array.from(targets).flatMap(childrenOf);

  if (useGsap) {
    gsap.set(allElements, { opacity: 0, y: 24 });
  } else {
    allElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    });
  }

  if (!("IntersectionObserver" in window)) {
    // No IntersectionObserver support: show everything immediately.
    if (useGsap) {
      gsap.set(allElements, { opacity: 1, y: 0 });
    } else {
      allElements.forEach((el) => {
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
        const children = childrenOf(entry.target);
        if (useGsap) {
          gsap.to(children, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 });
        } else {
          children.forEach((child, i) => {
            child.style.transition = `opacity 0.8s ease ${i * 0.08}s, transform 0.8s ease ${i * 0.08}s`;
            child.style.opacity = "1";
            child.style.transform = "none";
          });
        }
        observer.unobserve(entry.target);
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

/* ---- Stat counters (count up from 0 once the awards section scrolls into view) ---- */
function initStatCounters() {
  const grid = document.querySelector(".stat-grid");
  if (!grid) return;

  const values = Array.from(grid.querySelectorAll(".stat-card__value"));
  if (!values.length) return;

  const counters = values
    .map((el) => {
      const text = el.textContent.trim();
      const match = text.match(/^(\D*)([\d,]+)(\D*)$/);
      if (!match) return null;
      const [, prefix, digits, suffix] = match;
      el.textContent = `${prefix}0${suffix}`;
      return { el, prefix, suffix, target: parseInt(digits.replace(/,/g, ""), 10), useCommas: digits.includes(",") };
    })
    .filter(Boolean);

  if (!counters.length) return;

  const duration = 1500;

  const animate = () => {
    counters.forEach(({ el, prefix, suffix, target, useCommas }) => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${prefix}${useCommas ? value.toLocaleString("en-US") : value}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  if (!("IntersectionObserver" in window)) {
    animate();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate();
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(grid);
}

