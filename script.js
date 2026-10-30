(() => {
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "메뉴 열기");
  };

  const toggleMenu = () => {
    if (!nav || !menuBtn) return;
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };

  menuBtn?.addEventListener("click", toggleMenu);

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.matchMedia("(min-width: 981px)").matches) closeMenu();
    },
    { passive: true }
  );

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
    for (const el of reveals) {
      if (el.classList.contains("is-visible")) continue;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.96 && rect.bottom > 0) {
        show(el);
        io.unobserve(el);
      }
    }
  };

  reveals.forEach((el) => io.observe(el));
  revealInView();
  window.addEventListener("load", revealInView, { once: true });
  window.addEventListener("hashchange", () => {
    requestAnimationFrame(revealInView);
  });
})();
