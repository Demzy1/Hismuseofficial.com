/* ==============================
   HISMUSE — main.js
   Clean, minimal interactions
================================ */

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupScrollSpy();
  setupHeaderShrink();
  setupClickableProductCards();
  setupContactFormUX();
  setupOptionalHeroRotation(); // safe: only runs if you add multiple images
});

/* ------------------------------
   1) Smooth scroll for internal links
-------------------------------- */
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Offset for sticky header
      const header = document.querySelector(".site-header");
      const headerOffset = header ? header.offsetHeight : 0;

      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset + 2;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });
}

/* ------------------------------
   2) ScrollSpy: highlight active nav link
-------------------------------- */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const makeActive = (id) => {
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("active", href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // pick most visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) makeActive(visible.target.id);
    },
    {
      root: null,
      threshold: [0.25, 0.4, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------
   3) Header shrink on scroll (subtle)
-------------------------------- */
function setupHeaderShrink() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const shrinkClass = "is-scrolled";

  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add(shrinkClass);
    else header.classList.remove(shrinkClass);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ------------------------------
   4) Make entire product card clickable
   - If your HTML has <a class="product-cta" href="..."> inside,
     this will use that link.
-------------------------------- */
function setupClickableProductCards() {
  const cards = document.querySelectorAll(".product-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.cursor = "pointer";

    card.addEventListener("click", (e) => {
      // If user clicked a link/button inside card, let it behave normally
      const isLinkClick = e.target.closest("a, button");
      if (isLinkClick) return;

      const cta = card.querySelector("a.product-cta, a.btn, a[href]");
      if (cta && cta.getAttribute("href")) {
        // If it's a hash link, just trigger normal scroll
        const href = cta.getAttribute("href");
        if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          return;
        }
        window.location.href = href;
      }
    });
  });
}

/* ------------------------------
   5) Contact form UX (no backend yet)
   - Shows a success message
   - Keeps it honest: "message prepared" not "sent"
-------------------------------- */
function setupContactFormUX() {
  const form = document.querySelector("form[data-contact-form]");
  if (!form) return;

  const status = document.querySelector("[data-form-status]");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic required validation
    const required = form.querySelectorAll("[required]");
    let valid = true;

    required.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = "rgba(139,111,78,0.9)";
      } else {
        field.style.borderColor = "rgba(0,0,0,0.08)";
      }
    });

    if (!valid) {
      if (status) {
        status.textContent = "Please fill in the required fields.";
        status.style.color = "#8b6f4e";
      }
      return;
    }

    // Fake "send" (until you connect a backend)
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
    }

    setTimeout(() => {
      if (status) {
        status.textContent =
          "Thanks — your message is ready. We’ll reply within 24–48 hours.";
        status.style.color = "#2b2622";
      }

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }, 700);
  });
}

/* ------------------------------
   6) Optional: Hero image rotation (Netflix-ish but subtle)
   - Only runs if you add multiple images:
     <div class="hero-media">
       <img data-hero-slide src="..." />
       <img data-hero-slide src="..." />
     </div>
   - If there is only 1 image, it does nothing.
-------------------------------- */
function setupOptionalHeroRotation() {
  const slides = document.querySelectorAll(".hero-media img[data-hero-slide]");
  if (!slides.length || slides.length < 2) return;

  let index = 0;

  // initial styles
  slides.forEach((img, i) => {
    img.style.position = "absolute";
    img.style.inset = "0";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.transition = "opacity 800ms ease";
    img.style.opacity = i === 0 ? "0.25" : "0";
  });

  setInterval(() => {
    slides[index].style.opacity = "0";
    index = (index + 1) % slides.length;
    slides[index].style.opacity = "0.25";
  }, 5000);
}
