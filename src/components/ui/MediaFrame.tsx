import { useRef } from "react";
import type { Media } from "../../types/content";
import { gsap, useGSAP } from "../../lib/gsap";
import { dur, ease, scrollStart, motionAllowed } from "../../lib/motion";
export function MediaFrame({
  image,
  eager = false,
  pinned = false,
  className = "",
}: {
  image: Media;
  eager?: boolean;
  pinned?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed() || eager) return;
      const mm = gsap.matchMedia();
      const query = pinned ? "(max-width:1199px), (pointer:coarse)" : "all";
      mm.add(query, () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: dur.wipe,
            ease: ease.inOut,
            scrollTrigger: {
              trigger: ref.current,
              start: scrollStart.image,
              once: true,
            },
          },
        );
        gsap.from(ref.current?.querySelector("img") || [], {
          scale: 1.18,
          duration: dur.wipe,
          ease: ease.out,
          scrollTrigger: {
            trigger: ref.current,
            start: scrollStart.image,
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <figure
      ref={ref}
      className={`media-frame ${className}`}
      data-hero-media={eager || undefined}
    >
      <img
        src={image.src}
        srcSet={image.srcset}
        sizes={
          eager
            ? "(max-width:767px) 65vw, 42vw"
            : pinned
              ? "100vw"
              : "(max-width:767px) 100vw, 55vw"
        }
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        data-hero-portrait={eager || undefined}
      />
      {image.status !== "verified" && (
        <figcaption className="placeholder-tag">
          Placeholder ·{" "}
          {eager ? "Portrait awaiting supplied image" : "Illustrative artwork"}
        </figcaption>
      )}
    </figure>
  );
}
