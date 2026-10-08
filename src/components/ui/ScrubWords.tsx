import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { motionAllowed, ease, stagger } from "../../lib/motion";
export function ScrubWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:1200px)", () => {
        gsap.from(ref.current?.querySelectorAll("[data-word]") || [], {
          opacity: 0.2,
          stagger: stagger.word,
          ease: ease.smooth,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-word aria-hidden="true">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
