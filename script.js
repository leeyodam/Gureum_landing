(() => {
  const LANGS = [
    { id: "en", label: "English", html: "en" },
    { id: "es", label: "Español", html: "es" },
    { id: "ja", label: "日本語", html: "ja" },
    { id: "zh", label: "中文", html: "zh-Hans" },
    { id: "ko", label: "한국어", html: "ko" },
  ];

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const langRoot = document.getElementById("lang");
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");
  const langCurrent = document.getElementById("langCurrent");

  const dictionaries = window.GUREUM_I18N || {};

  const applyLanguage = (id) => {
    const lang = LANGS.some((item) => item.id === id) ? id : "ko";
    const dict = dictionaries[lang] || dictionaries.ko || {};
    const meta = LANGS.find((item) => item.id === lang);

    document.documentElement.lang = meta ? meta.html : "ko";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description && dict["meta.description"]) {
      description.setAttribute("content", dict["meta.description"]);
    }
    if (ogTitle && dict["meta.title"]) ogTitle.setAttribute("content", dict["meta.title"]);
    if (ogDescription && dict["meta.description"]) {
      ogDescription.setAttribute("content", dict["meta.description"]);
    }

    if (langCurrent && meta) langCurrent.textContent = meta.label;
    langMenu?.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.lang === lang));
    });

    try {
      localStorage.setItem("gureum-lang", lang);
    } catch {
      /* ignore private mode */
    }
  };

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

  langMenu?.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.lang);
      closeLang();
    });
  });

  document.addEventListener("click", (event) => {
    if (!langRoot || langRoot.contains(event.target)) return;
    closeLang();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLang();
  });

  let saved = "ko";
  try {
    saved = localStorage.getItem("gureum-lang") || "";
  } catch {
    saved = "";
  }
  if (!LANGS.some((item) => item.id === saved)) {
    const browser = (navigator.language || "ko").toLowerCase();
    if (browser.startsWith("en")) saved = "en";
    else if (browser.startsWith("es")) saved = "es";
    else if (browser.startsWith("ja")) saved = "ja";
    else if (browser.startsWith("zh")) saved = "zh";
    else saved = "ko";
  }
  applyLanguage(saved);

  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
