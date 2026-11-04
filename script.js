(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const langRoot = document.getElementById("lang");
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");

  // Each language is a separate page. Old links still carry ?lang=xx, so send
  // those to the language page and keep the address and the copy in step.
  const query = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
  const htmlLang = (document.documentElement.lang || "ko").toLowerCase();
  const here = htmlLang.startsWith("zh") ? "zh" : htmlLang.slice(0, 2);
  const known = ["ko", "en", "es", "ja", "zh"];
  if (known.includes(query) && query !== here) {
    location.replace((query === "ko" ? "/" : `/${query}/`) + (location.hash || ""));
    return;
  }

  const closeLang = () => {
    if (!langMenu || !langBtn) return;
    langMenu.hidden = true;
    langBtn.setAttribute("aria-expanded", "false");
  };

  const openLang = () => {
    if (!langMenu || !langBtn) return;
    langMenu.hidden = false;
    langBtn.setAttribute("aria-expanded", "true");
  };

  langBtn?.addEventListener("click", () => {
    if (langMenu?.hidden) openLang();
    else closeLang();
  });

  document.addEventListener("click", (event) => {
    if (!langRoot || langRoot.contains(event.target)) return;
    closeLang();
  });

  const langLinks = () => (langMenu ? [...langMenu.querySelectorAll("a")] : []);

  const moveLangFocus = (direction) => {
    const links = langLinks();
    if (!links.length) return;
    const current = links.indexOf(document.activeElement);
    const selected = links.findIndex((link) => link.getAttribute("aria-selected") === "true");
    const start = current >= 0 ? current : selected >= 0 ? selected : 0;
    const next = (start + direction + links.length) % links.length;
    links[next].focus();
  };

  langBtn?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    openLang();
    const links = langLinks();
    const selected = links.find((link) => link.getAttribute("aria-selected") === "true");
    (selected || links[0])?.focus();
  });

  langMenu?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveLangFocus(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      langLinks()[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const links = langLinks();
      links[links.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeLang();
      langBtn?.focus();
    } else if (event.key === "Tab") {
      closeLang();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLang();
  });

  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const steps = document.querySelector(".steps");
  if (steps) {
    const equalizeSteps = () => {
      const items = [...steps.children].filter((node) => node.tagName === "LI");
      if (items.length < 2) return;
      for (const item of items) item.style.minHeight = "";
      const max = Math.max(...items.map((item) => item.offsetHeight));
      for (const item of items) item.style.minHeight = `${max}px`;
    };
    equalizeSteps();
    document.fonts?.ready?.then(equalizeSteps);
    window.addEventListener("resize", equalizeSteps);
  }

  const reveals = [...document.querySelectorAll(".reveal")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show = (el) => el.classList.add("is-visible");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(show);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
  );

  const revealInView = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (const el of reveals) {
      if (el.classList.contains("is-visible")) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.96 && rect.bottom > 0) {
        show(el);
        io.unobserve(el);
      }
    }
  };

  reveals.forEach((el) => io.observe(el));
  revealInView();
  window.addEventListener("load", revealInView, { once: true });
})();
