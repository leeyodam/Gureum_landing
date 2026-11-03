(function () {
  var MEASUREMENT_ID = "G-4PZ6F5ZGPY";

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
      gtag("event", "language_change", {
        page_lang: next,
        page_location: location.href,
      });
      gtag("config", MEASUREMENT_ID, { page_lang: next });
      return;
    }

    var link = node.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) === "#") {
      var section = href.slice(1) || "top";
      if (section === "download") {
        gtag("event", "download_click", { section: section, page_lang: lang() });
      } else {
        gtag("event", "section_click", { section: section, page_lang: lang() });
      }
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
})();
