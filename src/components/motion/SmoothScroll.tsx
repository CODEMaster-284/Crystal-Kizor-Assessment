import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import {
  motionAllowed,
  dur,
  ease,
  stagger,
  scrollStart,
} from "../../lib/motion";
interface MotionContext {
  navigate: (hash: string) => void;
  lock: (locked: boolean) => void;
}
const Context = createContext<MotionContext>({
  navigate: () => {},
  lock: () => {},
});
export const useSmoothScroll = () => useContext(Context);
export function MotionProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const locks = useRef(false);
  const [ready, setReady] = useState(false);
  const navigate = useCallback((hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      ScrollTrigger.refresh();
    }
    const offset = -86;
    // Numeric destinations avoid double-counting Lenis' automatic CSS scroll padding/margins.
    const destination = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY + offset,
    );
    history.pushState(null, "", hash);
    if (lenis.current)
      lenis.current.scrollTo(destination, {
        duration: 1.4,
        onComplete: () => {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
    else {
      window.scrollTo({
        top: destination,
        behavior: motionAllowed() ? "smooth" : "instant",
      });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }, []);
  const lock = useCallback((locked: boolean) => {
    locks.current = locked;
    if (locked) lenis.current?.stop();
    else lenis.current?.start();
    document.body.style.overflow = locked ? "hidden" : "";
  }, []);
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    let alive = true;
    void document.fonts.ready.then(() => {
      if (!alive) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      if (target instanceof HTMLDetailsElement) target.open = true;
      ScrollTrigger.refresh();
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - 86,
      );
      if (lenis.current)
        lenis.current.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top, behavior: "instant" });
    });
    return () => {
      alive = false;
    };
  }, []);
  useGSAP(
    (_, contextSafe) => {
      setReady(true);
      if (!motionAllowed()) return;
      const instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.current = instance;
      if (locks.current) instance.stop();
      instance.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => instance.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: "max",
          scrub: true,
        },
      });
      const grid = gsap.matchMedia();
      grid.add("(min-width:1200px)", () => {
        gsap.from("[data-grid-line]", {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          ease: ease.smooth,
          scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width:1200px)",
          tablet: "(min-width:768px) and (max-width:1199px)",
          mobile: "(max-width:767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        () => {
          gsap.utils.toArray<HTMLElement>("[data-gentle]").forEach((el) =>
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: dur.reveal,
              ease: ease.soft,
              scrollTrigger: {
                trigger: el,
                start: scrollStart.section,
                once: true,
              },
            }),
          );
          gsap.utils.toArray<HTMLElement>("footer a").forEach((el, i) =>
            gsap.from(el, {
              y: 12,
              duration: dur.ui,
              delay: i * stagger.item,
              ease: ease.soft,
              scrollTrigger: { trigger: el, start: "top bottom", once: true },
            }),
          );
        },
      );
      let resizeTimer: ReturnType<typeof setTimeout>;
      let settled = false;
      void document.fonts.ready.then(
        contextSafe!(() => {
          if (settled) return;
          settled = true;
          ScrollTrigger.refresh();
        }),
      );
      const observer = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
      });
      observer.observe(document.body);
      const focus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.matches("section,main,details") || target.closest("header"))
          return;
        const r = target.getBoundingClientRect();
        if (r.top < 86 || r.bottom > innerHeight)
          instance.scrollTo(Math.max(0, r.top + window.scrollY - 110), {
            immediate: true,
          });
      };
      const pop = () => {
        const target = location.hash
          ? document.querySelector<HTMLElement>(location.hash)
          : null;
        instance.scrollTo(
          target
            ? Math.max(
                0,
                target.getBoundingClientRect().top + window.scrollY - 86,
              )
            : 0,
          { immediate: true },
        );
      };
      document.addEventListener("focusin", focus);
      window.addEventListener("popstate", pop);
      return () => {
        grid.revert();
        mm.revert();
        observer.disconnect();
        clearTimeout(resizeTimer);
        document.removeEventListener("focusin", focus);
        window.removeEventListener("popstate", pop);
        gsap.ticker.remove(tick);
        instance.destroy();
        lenis.current = null;
        document.body.style.overflow = "";
      };
    },
    { scope: root },
  );
  return (
    <Context.Provider value={{ navigate, lock }}>
      <div ref={root} data-motion-ready={ready}>
        <div className="scroll-progress" data-progress />
        {children}
      </div>
    </Context.Provider>
  );
}
