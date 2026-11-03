(function () {
  var MEASUREMENT_ID = "G-4PZ6F5ZGPY";
  var SCROLL_MARKS = [50, 90];
  var SECTIONS = ["when", "features", "how", "privacy", "about", "faq", "download"];

  function lang() {
    return document.documentElement.lang || "ko";
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_flags: "SameSite=Lax;Secure",
    page_lang: lang(),
  });

  var script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(script);

  document.addEventListener("click", function (event) {
    var node = event.target;
    if (!node || !node.closest) return;

    var langButton = node.closest("[data-lang]");
    if (langButton) {
      var next = langButton.getAttribute("data-lang") || lang();
      gtag("event", "language_change", { page_lang: next });
      gtag("config", MEASUREMENT_ID, {
        page_lang: next,
        send_page_view: false,
      });
      gtag("event", "page_view", {
        page_lang: next,
        page_location: location.href,
        page_title: document.title,
      });
      return;
    }

    var link = node.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) === "#") {
      var section = href.slice(1) || "top";
      var name = section === "download" ? "download_click" : "section_click";
      gtag("event", name, { section: section, page_lang: lang() });
      return;
    }

    var url;
    try {
      url = new URL(href, location.href);
    } catch (error) {
      return;
    }
    if (url.host && url.host !== location.host) {
      gtag("event", "outbound_click", { link_host: url.host, page_lang: lang() });
    }
  });

  document.addEventListener(
    "toggle",
    function (event) {
      var details = event.target;
      if (!details || details.tagName !== "DETAILS" || !details.open) return;
      if ((details.id || "").indexOf("faq") !== 0) return;
      gtag("event", "faq_open", { faq_id: details.id, page_lang: lang() });
    },
    true
  );

  var scrolled = {};
  function onScroll() {
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (height <= 0) return;
    var percent = Math.round((window.scrollY / height) * 100);
    for (var i = 0; i < SCROLL_MARKS.length; i += 1) {
      var mark = SCROLL_MARKS[i];
      if (scrolled[mark] || percent < mark) continue;
      scrolled[mark] = true;
      gtag("event", "scroll_depth", {
        percent_scrolled: mark,
        page_lang: lang(),
      });
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!("IntersectionObserver" in window)) return;
  var seen = {};
  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i += 1) {
        var entry = entries[i];
        if (!entry.isIntersecting) continue;
        var id = entry.target.id;
        if (!id || seen[id]) continue;
        seen[id] = true;
        gtag("event", "section_view", { section: id, page_lang: lang() });
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.35 }
  );
  for (var s = 0; s < SECTIONS.length; s += 1) {
    var element = document.getElementById(SECTIONS[s]);
    if (element) observer.observe(element);
  }
})();
