// Generates one static HTML page per language from i18n.js + index.html.
// index.html is both the Korean page and the structural template: every
// translatable string is replaced from the dictionary, so the markup is shared
// and the copy has a single source.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://gureum.yodams.com";

const LANGS = [
  { id: "ko", html: "ko", locale: "ko_KR", path: "/", out: "index.html", label: "한국어", hreflang: "ko" },
  { id: "en", html: "en", locale: "en_US", path: "/en/", out: "en/index.html", label: "English", hreflang: "en" },
  { id: "es", html: "es", locale: "es_ES", path: "/es/", out: "es/index.html", label: "Español", hreflang: "es" },
  { id: "ja", html: "ja", locale: "ja_JP", path: "/ja/", out: "ja/index.html", label: "日本語", hreflang: "ja" },
  { id: "zh", html: "zh-Hans", locale: "zh_CN", path: "/zh/", out: "zh/index.html", label: "中文", hreflang: "zh-Hans" },
];

const dictCtx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "i18n.js"), "utf8"), dictCtx);
const I18N = dictCtx.window.GUREUM_I18N;

for (const lang of LANGS) {
  if (!I18N[lang.id]) throw new Error("missing language " + lang.id);
}

const pageUrl = (lang) => SITE + lang.path;
const abs = (p) => SITE + p;

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escapeJson = (value) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

function buildFaq(dict) {
  const pairs = [
    ["about.title", "about.answer"],
    ["faq.q14", "faq.a14"],
    ["faq.q15", "faq.a15"],
    ["faq.q20", "faq.a20"],
    ["faq.q8", "faq.a8"],
    ["faq.q1", "faq.a1"],
    ["faq.q18", "faq.a18"],
    ["faq.q9", "faq.a9"],
    ["faq.q10", "faq.a10"],
    ["faq.q2", "faq.a2"],
    ["faq.q4", "faq.a4"],
    ["faq.q12", "faq.a12"],
    ["faq.q16", "faq.a16"],
    ["faq.q17", "faq.a17"],
    ["faq.q5", "faq.a5"],
    ["faq.q19", "faq.a19"],
    ["faq.q11", "faq.a11"],
    ["faq.q6", "faq.a6"],
    ["faq.q7", "faq.a7"],
    ["faq.q3", "faq.a3"],
    ["faq.q13", "faq.a13"],
  ];
  return pairs
    .map(([q, a]) => ({ q: dict[q], a: dict[a] }))
    .filter((item) => item.q && item.a);
}

function buildGraph(lang, dict) {
  const url = pageUrl(lang);
  const faq = buildFaq(dict);
  const steps = [1, 2, 3]
    .map((position) => ({ position, name: dict[`step${position}.title`], text: dict[`step${position}.body`] }))
    .filter((s) => s.name && s.text);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Gureum",
        alternateName: ["구름", "雲", "云"],
        url: `${SITE}/`,
        logo: abs("/assets/favicon-192.png"),
        sameAs: ["https://github.com/leeyodam/Gureum_landing"],
        areaServed: "KR",
        knowsLanguage: ["ko", "en", "es", "ja", "zh"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "구름",
        alternateName: "Gureum",
        inLanguage: ["ko", "en", "es", "ja", "zh-Hans"],
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: dict["meta.title"],
        description: dict["meta.description"],
        inLanguage: lang.html,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#app` },
        primaryImageOfPage: abs("/assets/og.png"),
        dateModified: "2026-11-04",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".about__answer", ".hero__sub"],
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#app`,
        name: "구름",
        alternateName: "Gureum",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Android, iOS",
        url,
        image: abs("/assets/og.png"),
        inLanguage: lang.html,
        description: dict["about.answer"],
        featureList: [dict["about.f1.dd"], dict["about.f2.dd"], dict["about.f4.dd"]].filter(Boolean),
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url: `${url}#faq`,
        inLanguage: lang.html,
        mainEntity: faq.map((item) => ({
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
        inLanguage: lang.html,
        step: steps.map((s) => ({
          "@type": "HowToStep",
          position: s.position,
          name: s.name,
          text: s.text,
        })),
      },
    ],
  };
}

function setMetaContent(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*?content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta not found: ${attr}=${key}`);
  return html.replace(re, (m, a, b) => a + escapeAttr(value) + b);
}

function setMetaContentOnce(html, attr, key, value) {
  // for tags that appear once (og:title etc.); same implementation, asserted above
  return setMetaContent(html, attr, key, value);
}

function replaceAlternates(html, lang) {
  const order = LANGS.filter((l) => l.id !== lang.id).map(
    (l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${pageUrl(l)}" />`
  );
  const block = [
    `    <link rel="alternate" hreflang="${lang.hreflang}" href="${pageUrl(lang)}" />`,
    ...order,
    `    <link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
  ].join("\n");
  return html.replace(/(\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*" \/>)+/, "\n" + block);
}

function replaceLangMenu(html, lang) {
  // Clear any existing selection, then mark the active language. The menu items
  // are links now, so the marker can sit anywhere inside the start tag.
  let next = html.replace(
    /(<a\b[^>]*\brole="option"[^>]*?)\s+aria-selected="true"/g,
    "$1"
  );
  const marker = new RegExp(`(<a\\b[^>]*\\bdata-lang="${lang.id}"[^>]*?)(>)`);
  if (!marker.test(next)) throw new Error("lang menu link not found for " + lang.id);
  next = next.replace(marker, `$1 aria-selected="true"$2`);
  next = next.replace(/(<span id="langCurrent">)[^<]*(<\/span>)/, `$1${lang.label}$2`);
  return next;
}

function localizeText(html, dict) {
  let out = html.replace(
    /<(\w+)([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, key, inner) => {
      const value = dict[key];
      if (value == null) throw new Error("missing i18n key " + key);
      if (value.includes("<")) return whole;
      return `<${tag}${attrs}>${value}</${tag}>`;
    }
  );
  out = out.replace(
    /<(\w+)([^>]*\sdata-i18n-html="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, key) => {
      const value = dict[key];
      if (value == null) throw new Error("missing i18n key " + key);
      return `<${tag}${attrs}>${value}</${tag}>`;
    }
  );
  out = out.replace(
    /(data-i18n-aria="([^"]+)"\s+aria-label=")([^"]*)(")/g,
    (whole, pre, key, old, post) => {
      const value = dict[key];
      if (value == null) return whole;
      return pre + escapeAttr(value) + post;
    }
  );
  return out;
}

function rootPaths(html) {
  const swaps = [
    ['href="styles.css', 'href="/styles.css'],
    ['src="assets/', 'src="/assets/'],
    ['href="assets/', 'href="/assets/'],
    ['href="llms.txt"', 'href="/llms.txt"'],
    ['src="script.js', 'src="/script.js'],
    ['src="analytics.js', 'src="/analytics.js'],
  ];
  let out = html;
  for (const [from, to] of swaps) out = out.split(from).join(to);
  return out;
}

const template = rootPaths(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));

// i18n.js is a build input now, so the page no longer loads it.
const noI18n = template.replace(/\s*<script src="(\/)?i18n\.js[^"]*" defer><\/script>/, "");

let wrote = 0;
for (const lang of LANGS) {
  const dict = I18N[lang.id];
  let html = noI18n;

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang.html}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${dict["meta.title"]}</title>`);

  html = setMetaContentOnce(html, "name", "description", dict["meta.description"]);
  html = setMetaContentOnce(html, "name", "application-name", dict["meta.appName"]);
  html = setMetaContentOnce(html, "name", "apple-mobile-web-app-title", dict["meta.appName"]);

  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${pageUrl(lang)}$2`
  );
  html = replaceAlternates(html, lang);

  html = setMetaContentOnce(html, "property", "og:title", dict["meta.title"]);
  html = setMetaContentOnce(html, "property", "og:description", dict["meta.description"]);
  html = setMetaContentOnce(html, "property", "og:url", pageUrl(lang));
  html = setMetaContentOnce(html, "property", "og:locale", lang.locale);
  html = setMetaContentOnce(html, "property", "og:image:alt", dict["meta.imageAlt"]);
  html = setMetaContentOnce(html, "name", "twitter:title", dict["meta.title"]);
  html = setMetaContentOnce(html, "name", "twitter:description", dict["meta.description"]);
  html = setMetaContentOnce(html, "name", "twitter:image:alt", dict["meta.imageAlt"]);

  html = localizeText(html, dict);
  html = replaceLangMenu(html, lang);

  const graph = buildGraph(lang, dict);
  html = html.replace(
    /(<script type="application\/ld\+json" id="structured-data">)[\s\S]*?(<\/script>)/,
    (m, a, b) => `${a}\n${escapeJson(graph)}\n    ${b}`
  );

  const target = path.join(ROOT, lang.out);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  wrote += 1;
  console.log("wrote", lang.out, html.length, "bytes");
}
console.log("pages", wrote);
