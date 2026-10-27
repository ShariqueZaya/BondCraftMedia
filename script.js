/*
  BOND CRAFT MEDIA — WEBSITE SETTINGS

  1. Replace the placeholder contact details.
  2. Set up the enquiry form before launch.
  3. Add your own portfolio video embed URLs.
*/

const SITE_CONFIG = {
  // Indian number format: country code + mobile number, digits only.
  // Example format: 919876543210 (not your actual number).
  whatsappNumber: "+91 88774 71366",

  whatsappMessage:
    "Hi Bond Craft Media! I'd like to discuss marketing for my business.",

  phoneDisplay: "+91 88774 71366",

  email: "bondcraftmedia23@gmail.com",

  instagramUrl: "https://www.instagram.com/bondcraftmedia/",

  // Use the same Gmail address for receiving enquiries.
  enquiryEmail: "bondcraftmedia23@gmail.com"
};


// Add public YouTube or Vimeo EMBED URLs here.
// Example: https://www.youtube-nocookie.com/embed/VIDEO_ID

const PORTFOLIO_VIDEOS = {
  brothersChaap: "",
  restaurantReel: ""
};


// Shortcuts for selecting HTML elements.

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


// CREATE WHATSAPP LINK

function makeWhatsAppUrl(message = SITE_CONFIG.whatsappMessage) {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");

  if (
    !number ||
    number.includes("XXXXXXXXXX") ||
    number.length < 10
  ) {
    return "";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}


// UPDATE CONTACT DETAILS AND LINKS

function updateContactLinks() {
  const waUrl = makeWhatsAppUrl();

  $$(".whatsapp-float, .whatsapp-direct").forEach(link => {
    if (waUrl) {
      link.href = waUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contact";

      link.addEventListener("click", event => {
        event.preventDefault();

        $("#form-status").textContent =
          "Add the agency WhatsApp number in script.js to activate WhatsApp chat.";

        $("#form-status").className = "form-status error";

        $("#contact").scrollIntoView({
          behavior: "smooth"
        });
      });
    }
  });


  // Update email links.

  $$('a[href^="mailto:"]').forEach(link => {
    link.href = `mailto:${SITE_CONFIG.email}`;

    const strong = $("strong", link);

    if (strong) {
      strong.textContent = SITE_CONFIG.email;
    }
  });


  // Update phone links.

  $$('a[href^="tel:"]').forEach(link => {
    const digits = SITE_CONFIG.phoneDisplay.replace(/[^\d+]/g, "");

    link.href = `tel:${digits}`;

    const strong = $("strong", link);

    if (strong) {
      strong.textContent = SITE_CONFIG.phoneDisplay;
    }
  });


  // Update Instagram links.

  $$(".instagram-link").forEach(link => {
    link.href = SITE_CONFIG.instagramUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}


// MOBILE NAVIGATION MENU

const menuToggle = $(".menu-toggle");
const nav = $("#site-nav");

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";

  menuToggle.setAttribute("aria-expanded", String(open));

  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );

  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
});


// Close the mobile menu after a section is selected.

$$(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("menu-open");
  });
});


// PORTFOLIO CATEGORY FILTERS

$$(".filter-button").forEach(button => {
  button.addEventListener("click", () => {

    // Highlight the selected filter.

    $$(".filter-button").forEach(item => {
      item.classList.toggle("active", item === button);

      item.setAttribute(
        "aria-pressed",
        String(item === button)
      );
    });

    const filter = button.dataset.filter;


    // Show matching projects only.

    $$(".project-card").forEach(card => {
      card.hidden =
        filter !== "all" &&
        card.dataset.category !== filter;
    });
  });
});


// PACKAGE ENQUIRY BUTTONS: open WhatsApp with the package name filled in

$$("[data-package]").forEach(link => {
  const waUrl = makeWhatsAppUrl(
    `Hi Bond Craft Media! I'm interested in the ${link.dataset.package} package. Please share the scope and pricing.`
  );

  if (waUrl) {
    link.href = waUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});




// PORTFOLIO VIDEO PREVIEW

const videoDialog = $("#video-dialog");
const videoContent = $(".video-dialog-content");

$$("[data-video]").forEach((button, index) => {

  button.addEventListener("click", () => {

    const key =
      index === 0 ? "brothersChaap" : "restaurantReel";

    const url =
      PORTFOLIO_VIDEOS[key] || button.dataset.video;

    if (!url) {
      alert(
        "Add this project's video embed URL in script.js to enable its preview."
      );

      return;
    }

    videoContent.innerHTML = `
      <iframe
        src="${url}"
        title="Portfolio video preview"
        allow="accelerometer; autoplay; clipboard-write;
        encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy">
      </iframe>
    `;

    videoDialog.showModal();
  });
});


// Close the video preview.

$(".dialog-close").addEventListener("click", () => {
  videoDialog.close();
});

videoDialog.addEventListener("click", event => {
  if (event.target === videoDialog) {
    videoDialog.close();
  }
});

videoDialog.addEventListener("close", () => {
  videoContent.innerHTML = "";
});


// EMAIL ENQUIRY FORM
// Uses FormSubmit's AJAX endpoint.
// Verify the destination email before relying on it for enquiries.

const form = $("#enquiry-form");
if (form) form.addEventListener("submit", async event => {
  event.preventDefault();

  const status = $("#form-status");


  // Stop if the email hasn't been configured.

  if (SITE_CONFIG.enquiryEmail.includes("YOUR_EMAIL")) {
    status.textContent =
      "Before submitting, replace YOUR_EMAIL@gmail.com in script.js " +
      "with the agency Gmail address and follow the setup steps in README.md.";

    status.className = "form-status error";

    return;
  }


  const submitButton = $(".form-submit", form);

  submitButton.disabled = true;
  submitButton.textContent = "Sending enquiry…";

  status.textContent = "";


  // Collect the customer's form details.

  const formData = Object.fromEntries(
    new FormData(form).entries()
  );

  formData._subject = "New Bond Craft Media website enquiry";

  // Convenience setting; review spam protection before publishing.
  formData._captcha = "false";


  try {

    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(
        SITE_CONFIG.enquiryEmail
      )}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify(formData)
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      result.success === "false" ||
      result.success === false
    ) {
      throw new Error(
        result.message || "The form service could not accept the enquiry."
      );
    }


    // Show success feedback.

    status.textContent =
      "Thank you! Your enquiry has been submitted. We'll be in touch soon.";

    status.className = "form-status success";

    form.reset();

  } catch (error) {

    // Show an error and offer an alternative contact method.

    status.textContent =
      "Sorry, we couldn't send this right now. " +
      "Please use the WhatsApp button or email us directly.";

    status.className = "form-status error";

  } finally {

    submitButton.disabled = false;

    submitButton.innerHTML =
      'Send project enquiry <span>↗</span>';
  }
});


// AUTOMATIC COPYRIGHT YEAR

$("#year").textContent = new Date().getFullYear();


// ACTIVATE THE CONTACT LINKS

updateContactLinks();

/* ===== BOND CRAFT MEDIA INTRO ANIMATION ===== */

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("intro-loader");
    const progress = document.getElementById("loader-progress");
    const number = document.getElementById("loader-number");

    if (!loader || !progress || !number) return;

    document.body.classList.add("intro-active");

    let current = 0;
    let pageLoaded = document.readyState === "complete";
    const startTime = Date.now();

    window.addEventListener("load", () => {
        pageLoaded = true;
    });

    const counter = setInterval(() => {
        // Move smoothly towards 90% while loading.
        // Reach 100% after the page has loaded.
        const target = pageLoaded ? 100 : 90;

        if (current < target) {
            current += current < 70 ? 2 : 1;
            current = Math.min(current, target);
        }

        number.textContent = current;
        progress.style.width = current + "%";

        // Keep the intro brief, even on a fast connection.
        if (current >= 100 && Date.now() - startTime >= 700) {
            clearInterval(counter);

            loader.classList.add("loader-finished");
            document.body.classList.remove("intro-active");
            document.body.classList.add("intro-ready");

            setTimeout(() => {
                loader.remove();
            }, 1000);
        }
    }, 9);

    // Fallback if the load event takes unusually long.
    setTimeout(() => {
        pageLoaded = true;
    }, 2000);
});
/* ===== BOND CRAFT MEDIA — SCROLL ANIMATIONS ===== */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 1. Scroll progress line ---------- */

  const progressBar = document.getElementById("scroll-progress-bar");
  let progressTicking = false;

  function updateProgress() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;

    progressBar.style.transform =
      "scaleX(" + Math.min(Math.max(ratio, 0), 1) + ")";

    progressTicking = false;
  }

  if (progressBar) {
    window.addEventListener(
      "scroll",
      () => {
        if (!progressTicking) {
          progressTicking = true;
          requestAnimationFrame(updateProgress);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updateProgress);
    window.addEventListener("load", updateProgress);
    updateProgress();
  }

  /* ---------- 2. Reveal animations + section dividers ---------- */

  // Everything in this list fades up when it enters the screen.
    const REVEAL_SELECTORS = [
    ".section-label",
    ".section h2",
    ".section-heading > p",
    ".about-copy > *",
    ".service-card",
    ".work-project-head",
    ".why-copy > p",
    ".why-copy > .button",
    ".why-list > div",
    ".process-grid article",
    ".package-tabs",
    ".package-card",
    ".package-note",
    ".testimonial-placeholder",
    ".team-card",
    ".faq-section > div:first-child > p",
    ".faq-list details",
    ".contact-copy > p",
    ".contact-copy > .button",
    ".contact-item",
    ".contact-form",
    ".site-footer > *"
  ].join(",");

  // Sections that get a burgundy line at their top edge.
  // Delete any id you don't want a line above.
  const DIVIDER_SECTIONS = [
    "work",
    "process",
    "packages",
    "testimonials",
    "team",
    "contact"
  ];

  function createDividers() {
    return DIVIDER_SECTIONS.map(id => {
      const section = document.getElementById(id);
      if (!section) return null;

      const line = document.createElement("div");
      line.className = "section-divider";
      line.setAttribute("aria-hidden", "true");

      section.classList.add("has-divider");
      section.prepend(line);

      return line;
    }).filter(Boolean);
  }

  function showItem(el, instant, delay) {
    if (instant) {
      el.classList.add("reveal-instant");
    } else {
      el.style.setProperty("--reveal-delay", delay + "ms");
    }

    el.classList.add("is-visible");

    // Clean up afterwards so your original hover effects work normally.
    window.setTimeout(
      () => {
        el.classList.remove("reveal", "is-visible", "reveal-instant");
        el.style.removeProperty("--reveal-delay");
      },
      instant ? 60 : delay + 1100
    );
  }

  function startAnimations() {
    const dividers = createDividers();

    if (reducedMotion || !("IntersectionObserver" in window)) {
      dividers.forEach(line => line.classList.add("is-visible"));
      return;
    }

    // Reveal observer
    const revealObserver = new IntersectionObserver(
      entries => {
        const entering = [];

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entering.push(entry.target);
          } else if (entry.boundingClientRect.top < 0) {
            // Already scrolled past (e.g. page reloaded mid-way)
            showItem(entry.target, true, 0);
            revealObserver.unobserve(entry.target);
          }
        });

        // Items entering together appear one after another.
        entering.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          return Math.abs(ra.top - rb.top) > 24
            ? ra.top - rb.top
            : ra.left - rb.left;
        });

        entering.forEach((el, index) => {
          showItem(el, false, Math.min(index, 5) * 90);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(REVEAL_SELECTORS).forEach(el => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });

    // Divider observer
    const dividerObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add("is-visible");
            dividerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    dividers.forEach(line => dividerObserver.observe(line));
  }

  // Wait for your intro loader to finish before starting.
  function whenIntroDone(callback) {
    if (document.body.classList.contains("intro-active")) {
      setTimeout(() => whenIntroDone(callback), 120);
    } else {
      callback();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      whenIntroDone(startAnimations)
    );
  } else {
    whenIntroDone(startAnimations);
  }
})();
/* ===== BOND CRAFT MEDIA — MARQUEES, WORK PHOTOS, CURSOR ===== */

/* ---------- Seamless marquees ---------- */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const marquees = [...document.querySelectorAll(".marquee")];
  if (reduce || !marquees.length) return;

  marquees.forEach(m => {
    m._base = m.querySelector(".marquee-group").innerHTML;
  });

  function build(m) {
    const track = m.querySelector(".marquee-track");
    const groups = track.querySelectorAll(".marquee-group");
    const group = groups[0];

    groups.forEach((g, i) => { if (i > 0) g.remove(); });
    group.innerHTML = m._base;

    // Repeat the text until one group is wider than the screen.
    let guard = 0;
    while (group.offsetWidth < m.offsetWidth && guard < 12) {
      group.innerHTML += m._base;
      guard++;
    }

    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);

    const speed = Number(m.dataset.speed) || 50; // pixels per second
    track.style.setProperty("--marquee-duration", group.offsetWidth / speed + "s");
    m.classList.add("is-ready");
  }

  function buildAll() {
    marquees.forEach(build);
  }

  buildAll();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(buildAll);
  }

  let lastWidth = window.innerWidth;
  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        buildAll();
      }
    }, 200);
  });
})();


/* ---------- Work photos: placeholder check ---------- */
(function () {
  "use strict";

  const photos = [...document.querySelectorAll(".work-photo")];
  if (!photos.length) return;

  photos.forEach(figure => {
    const img = figure.querySelector("img");
    if (!img) return;

    const markMissing = () => figure.classList.add("is-missing");
    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();
  });
})();


/* ---------- Custom cursor (desktop mouse only) ---------- */
(function () {
  "use strict";

  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hasMouse || reduce) return;

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "cursor-label";
  ring.appendChild(label);

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.textContent = "✳";
  dot.setAttribute("aria-hidden", "true");

  document.body.append(ring, dot);
  document.body.classList.add("has-custom-cursor");

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let running = false;
  let shown = false;
  let lastLabel = "";

  function move() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    ring.style.transform =
      "translate3d(" + ringX + "px," + ringY + "px,0) translate(-50%,-50%)";

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(move);
    } else {
      running = false;
    }
  }

  window.addEventListener(
    "mousemove",
    event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      dot.style.transform =
        "translate3d(" + mouseX + "px," + mouseY + "px,0) translate(-50%,-50%)";

      if (!shown) {
        shown = true;
        ringX = mouseX;
        ringY = mouseY;
        document.body.classList.add("cursor-visible");
      }

      if (!running) {
        running = true;
        requestAnimationFrame(move);
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest("a, button, summary, select, [data-cursor]");
      const tagged = target.closest("[data-cursor]");
      const field = target.closest("input, textarea");
      const dark = target.closest(".why-section, .site-footer, .marquee");
      const text = tagged ? tagged.dataset.cursor : "";

      ring.classList.toggle("is-hover", Boolean(interactive));
      ring.classList.toggle("has-label", Boolean(tagged));
      document.body.classList.toggle("cursor-hidden", Boolean(field));
      document.body.classList.toggle("cursor-light", Boolean(dark));

      if (text !== lastLabel) {
        label.textContent = text;
        lastLabel = text;
      }
    },
    { passive: true }
  );

  document.documentElement.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-visible");
  });

  document.documentElement.addEventListener("mouseenter", () => {
    if (shown) document.body.classList.add("cursor-visible");
  });
})();
/* ---------- Package tabs ---------- */
(function () {
  "use strict";

  const tabs = [...document.querySelectorAll(".package-tab")];
  if (!tabs.length) return;

  function select(tab) {
    tabs.forEach(item => {
      const active = item === tab;

      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;

      const panel = document.getElementById(item.getAttribute("aria-controls"));
      if (panel) panel.hidden = !active;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));

    tab.addEventListener("keydown", event => {
      let next = null;

      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];

      if (next) {
        event.preventDefault();
        select(next);
        next.focus();
      }
    });
  });
})();


/* ---------- Back to top button ---------- */
(function () {
  "use strict";

  const button = document.getElementById("back-to-top");
  if (!button) return;

  button.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth"
    });
  });
})();

/* Bondcraft agency card: smooth flip + cursor tilt */

document.querySelectorAll(".agency-flip-card").forEach((card) => {
  const stage = card.closest(".agency-card-stage");

  // Click to flip the complete card
  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(flipped));

    // Reset tilt when flipping
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });

  if (!stage) return;

  // Subtle tilt follows the mouse
  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (card.classList.contains("is-flipped")) return;

    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 5;

    card.style.setProperty("--tilt-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  stage.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});
