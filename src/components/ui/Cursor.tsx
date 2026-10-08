import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { dur, ease, motionAllowed } from "../../lib/motion";
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:1200px) and (hover:hover) and (pointer:fine)", () => {
        gsap.set(ref.current, { display: "block" });
        const x = gsap.quickTo(ref.current, "x", {
          duration: dur.ui,
          ease: ease.soft,
        });
        const y = gsap.quickTo(ref.current, "y", {
          duration: dur.ui,
          ease: ease.soft,
        });
        const scaleX = gsap.quickTo(ref.current, "scaleX", {
          duration: dur.micro,
          ease: ease.soft,
        });
        const scaleY = gsap.quickTo(ref.current, "scaleY", {
          duration: dur.micro,
          ease: ease.soft,
        });
        const move = (e: PointerEvent) => {
          x(e.clientX);
          y(e.clientY);
          const size = (e.target as Element).closest("[data-cursor]") ? 1.9 : 1;
          scaleX(size);
          scaleY(size);
        };
        window.addEventListener("pointermove", move);
        const cleanups: (() => void)[] = [];
        document
          .querySelectorAll<HTMLElement>("[data-magnetic]")
          .forEach((el) => {
            const tx = gsap.quickTo(el, "x", {
              duration: dur.ui,
              ease: ease.soft,
            });
            const ty = gsap.quickTo(el, "y", {
              duration: dur.ui,
              ease: ease.soft,
            });
            let rect: DOMRect;
            const enter = () => {
              rect = el.getBoundingClientRect();
            };
            const magnetic = (e: PointerEvent) => {
              if (!rect) return;
              tx(
                Math.max(
                  -12,
                  Math.min(12, (e.clientX - rect.left - rect.width / 2) * 0.15),
                ),
              );
              ty(
                Math.max(
                  -12,
                  Math.min(12, (e.clientY - rect.top - rect.height / 2) * 0.15),
                ),
              );
            };
            const leave = () => {
              tx(0);
              ty(0);
            };
            el.addEventListener("pointerenter", enter);
            el.addEventListener("pointermove", magnetic);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointerenter", enter);
              el.removeEventListener("pointermove", magnetic);
              el.removeEventListener("pointerleave", leave);
            });
          });
        return () => {
          window.removeEventListener("pointermove", move);
          cleanups.forEach((fn) => fn());
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <div ref={ref} className="cursor-ring" aria-hidden="true" />;
}
