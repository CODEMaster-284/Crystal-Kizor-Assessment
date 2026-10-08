import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "../../lib/gsap";
import {
  dur,
  ease,
  stagger,
  scrollStart,
  motionAllowed,
} from "../../lib/motion";
export function RevealText({
  children,
  as: Tag = "h2",
  id,
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    (_, contextSafe) => {
      if (!motionAllowed()) return;
      let alive = true;
      let split: SplitText | undefined;
      void document.fonts.ready.then(
        contextSafe!(() => {
          if (!alive || !ref.current) return;
          split = SplitText.create(ref.current, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: dur.reveal,
                ease: ease.out,
                stagger: stagger.line,
                scrollTrigger: {
                  trigger: ref.current,
                  start: scrollStart.section,
                  once: true,
                  markers: new URLSearchParams(location.search).has("markers"),
                },
              });
            },
          });
        }),
      );
      return () => {
        alive = false;
        split?.revert();
      };
    },
    { scope: ref },
  );
  return (
    <Tag id={id} ref={ref} className={className}>
      {children}
    </Tag>
  );
}
