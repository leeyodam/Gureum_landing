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
  const SITE = "https://gureum.yodams.com/";
  const LOCALES = {
    ko: "ko_KR",
    en: "en_US",
    es: "es_ES",
    ja: "ja_JP",
    zh: "zh_CN",
  };

  const pageUrl = (lang) => (lang === "ko" ? SITE : `${SITE}?lang=${lang}`);

  const setMeta = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  };

  const writeJsonLd = (lang, dict, htmlLang) => {
    const node = document.getElementById("structured-data");
    if (!node) return;
    const url = pageUrl(lang);
    const pairs = [
      ["about.title", "about.answer"],
      ["faq.q8", "faq.a8"],
      ["faq.q1", "faq.a1"],
      ["faq.q9", "faq.a9"],
      ["faq.q10", "faq.a10"],
      ["faq.q2", "faq.a2"],
      ["faq.q4", "faq.a4"],
      ["faq.q12", "faq.a12"],
      ["faq.q5", "faq.a5"],
      ["faq.q11", "faq.a11"],
      ["faq.q6", "faq.a6"],
      ["faq.q7", "faq.a7"],
      ["faq.q3", "faq.a3"],
    ]
      .map(([question, answer]) => ({ q: dict[question], a: dict[answer] }))
      .filter((item) => item.q && item.a);

    const steps = [1, 2, 3]
      .map((position) => ({
        "@type": "HowToStep",
        position,
        name: dict[`step${position}.title`],
        text: dict[`step${position}.body`],
      }))
      .filter((step) => step.name && step.text);

    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${SITE}#organization`,
          name: "Gureum",
          alternateName: ["구름", "雲", "云"],
          url: SITE,
          logo: `${SITE}assets/logo.png`,
          sameAs: ["https://github.com/leeyodam/Gureum_landing"],
          areaServed: "KR",
          knowsLanguage: ["ko", "en", "es", "ja", "zh"],
        },
        {
          "@type": "WebSite",
          "@id": `${SITE}#website`,
          url: SITE,
          name: "구름",
          alternateName: "Gureum",
          inLanguage: ["ko", "en", "es", "ja", "zh-Hans"],
          publisher: { "@id": `${SITE}#organization` },
        },
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: dict["meta.title"],
          description: dict["meta.description"],
          inLanguage: htmlLang,
          isPartOf: { "@id": `${SITE}#website` },
          about: { "@id": `${SITE}#app` },
          primaryImageOfPage: `${SITE}assets/og.png`,
          dateModified: "2026-11-03",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [".about__answer", ".hero__sub"],
          },
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${SITE}#app`,
          name: "구름",
          alternateName: "Gureum",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Android, iOS",
          url: SITE,
          image: `${SITE}assets/og.png`,
          inLanguage: htmlLang,
          description: dict["about.answer"],
          featureList: [dict["about.f1.dd"], dict["about.f2.dd"], dict["about.f4.dd"]].filter(Boolean),
          publisher: { "@id": `${SITE}#organization` },
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          url: `${url}#faq`,
          inLanguage: htmlLang,
          mainEntity: pairs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
        {
          "@type": "HowTo",
          "@id": `${url}#how`,
          name: dict["how.schemaTitle"],
          description: dict["how.lead"],
          inLanguage: htmlLang,
          step: steps,
        },
      ],
    };

    node.textContent = JSON.stringify(graph).replace(/</g, "\\u003c");
  };

  const syncLangUrl = (lang) => {
    const url = new URL(location.href);
    if (lang === "ko") url.searchParams.delete("lang");
    else url.searchParams.set("lang", lang);
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${location.pathname}${location.search}${location.hash}`;
    if (next !== current) history.replaceState(null, "", next);
  };

  const applyLanguage = (id) => {
    const lang = LANGS.some((item) => item.id === id) ? id : "ko";
    const dict = dictionaries[lang] || dictionaries.ko || {};
    const meta = LANGS.find((item) => item.id === lang);
    const htmlLang = meta ? meta.html : "ko";
    const url = pageUrl(lang);

    document.documentElement.lang = htmlLang;

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
    setMeta('meta[name="description"]', dict["meta.description"]);
    setMeta('meta[property="og:title"]', dict["meta.title"]);
    setMeta('meta[property="og:description"]', dict["meta.description"]);
    setMeta('meta[name="twitter:title"]', dict["meta.title"]);
    setMeta('meta[name="twitter:description"]', dict["meta.description"]);
    setMeta('meta[property="og:image:alt"]', dict["meta.imageAlt"]);
    setMeta('meta[name="twitter:image:alt"]', dict["meta.imageAlt"]);
    setMeta('meta[name="application-name"]', dict["meta.appName"]);
    setMeta('meta[name="apple-mobile-web-app-title"]', dict["meta.appName"]);
    setMeta('meta[property="og:locale"]', LOCALES[lang] || "ko_KR");
    setMeta('meta[property="og:url"]', url);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    writeJsonLd(lang, dict, htmlLang);
    syncLangUrl(lang);

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

  const fromUrl = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
  let saved = "";
  if (!LANGS.some((item) => item.id === fromUrl)) {
    try {
      saved = localStorage.getItem("gureum-lang") || "";
    } catch {
      saved = "";
    }
  }
  // The bare URL stays Korean so crawlers index one language per address.
  const initial = LANGS.some((item) => item.id === fromUrl)
    ? fromUrl
    : LANGS.some((item) => item.id === saved)
      ? saved
      : "ko";
  applyLanguage(initial);

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
