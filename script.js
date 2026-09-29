// =========================================================
// Anishk Verma | Portfolio scripts
// =========================================================

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 0. Resume download ----------
// In the single-file version, the PDF is stored right here as text (a data URI),
// so the Resume buttons work even if the PDF file is missing.
// In the folder version this stays empty and the buttons use the PDF file next to index.html.
const RESUME_DATA_URI = "";

if (RESUME_DATA_URI.startsWith("data:")) {
  document.querySelectorAll(".resume-link").forEach((link) => {
    link.setAttribute("href", RESUME_DATA_URI);
  });
}

// ---------- 1. Theme swap (dark-first <-> light-first) ----------
const themeBtn = document.getElementById("themeBtn");
const THEME_KEY = "portfolio-theme";

// Load the visitor's last choice, if there is one
try {
  if (localStorage.getItem(THEME_KEY) === "light-first") {
    root.setAttribute("data-theme", "light-first");
  }
} catch (error) {
  // Storage can be blocked in private mode. The default theme is fine.
}

themeBtn.addEventListener("click", () => {
  const isLightFirst = root.getAttribute("data-theme") === "light-first";

  if (isLightFirst) {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", "light-first");
  }

  try {
    localStorage.setItem(THEME_KEY, isLightFirst ? "dark-first" : "light-first");
  } catch (error) {
    // Ignore: the swap still works for this visit.
  }
});

// ---------- 2. Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ---------- 3. Typing effect in the hero ----------
const rotator = document.getElementById("rotator");
const phrases = [
  "MERN stack web apps",
  "secure REST APIs",
  "fast MongoDB backends",
  "Dockerized projects",
];

if (!prefersReducedMotion) {
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true; // start by erasing the first phrase, which is already on screen

  function type() {
    const current = phrases[phraseIndex];

    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    rotator.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 75;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1800; // pause once the phrase is complete
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 2200);
}

// ---------- 4. Scroll progress bar ----------
const progress = document.getElementById("progress");

function updateProgress() {
  const scrollable = root.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = percent + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// ---------- 5. Reveal cards when they scroll into view ----------
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in"));
}

// ---------- 6. Count-up numbers in the About stats ----------
const counters = document.querySelectorAll(".count");

function runCounter(el) {
  const target = Number(el.dataset.to);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));
}

// ---------- 7. Contact form ----------
// Opens the visitor's email app with the message filled in.
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const MY_EMAIL = "anishkverma27@gmail.com";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);

  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  formNote.textContent = "Your email app should open with the message ready to send.";
});

// ---------- 8. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
