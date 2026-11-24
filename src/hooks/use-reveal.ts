import { useEffect } from "react";

const show = (el: Element) => el.classList.add("is-visible");

const inViewport = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};

/**
 * One app-wide scroll-reveal manager (mount once, inside the router).
 *
 * Every `.reveal` element starts hidden. A MutationObserver picks up elements
 * as pages render — so client-side navigation behaves exactly like a fresh
 * load — and elements already on screen are shown straight away. A light
 * interval is a safety net so content can never stay invisible.
 */
export function useRevealObserver() {
  useEffect(() => {
    const hidden = () => Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));

    if (!("IntersectionObserver" in window)) {
      hidden().forEach(show);
      const mo = new MutationObserver(() => hidden().forEach(show));
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );

    const seen = new WeakSet<Element>();
    const sweep = () => {
      hidden().forEach((el) => {
        if (inViewport(el)) {
          show(el);
          io.unobserve(el);
        } else if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    };

    sweep();
    const mo = new MutationObserver(() => requestAnimationFrame(sweep));
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", sweep);
    const safety = window.setInterval(() => {
      hidden().forEach((el) => inViewport(el) && show(el));
    }, 500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("hashchange", sweep);
      window.clearInterval(safety);
    };
  }, []);
}
