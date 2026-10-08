import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteContent } from "../data/siteContent";
import { assetManifest } from "../data/assetManifest";
import { AnchorLink } from "../components/ui/ButtonLink";
import { MediaFrame } from "../components/ui/MediaFrame";
import { HeroScene } from "../components/webgl/HeroScene";
import { gsap, useGSAP } from "../lib/gsap";
import { ease, motionAllowed, scrollState } from "../lib/motion";
import { track } from "../lib/analytics";
import styles from "./Sections.module.css";
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:1200px)", () => {
        gsap.to("[data-hero-drift]", {
          yPercent: (i) => -20 - i * 15,
          ease: ease.smooth,
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-hero-parallax]", {
          scale: 1.1,
          ease: ease.smooth,
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(scrollState, {
          progress: 1,
          ease: ease.smooth,
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.fromTo(
          "[data-seam]",
          { clipPath: "polygon(0 100%,100% 85%,100% 100%,0 100%)" },
          {
            clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)",
            ease: ease.smooth,
            scrollTrigger: {
              trigger: ref.current,
              start: "bottom 45%",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section
      id="home"
      className={styles.hero}
      ref={ref}
      data-theme="dark"
      aria-labelledby="home-heading"
    >
      <HeroScene />
      <div className={styles.heroGrid} />
      <div className={styles.heroImage} data-hero-parallax>
        <MediaFrame image={assetManifest.portrait} eager />
      </div>
      <div className={styles.heroTopline}>
        <span>Architecture · Ideas · Purpose</span>
        <span>A connected world of work</span>
      </div>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>{siteContent.eyebrow}</p>
        <h1 id="home-heading">
          <span className={styles.lineMask} data-hero-drift>
            <span data-hero-line>Building Beyond</span>
          </span>
          <span className={styles.lineMask} data-hero-drift>
            <span data-hero-line>
              <i>Buildings.</i>
            </span>
          </span>
        </h1>
        <div className={styles.heroBottom} data-hero-arrival>
          <p>{siteContent.intro}</p>
          <div className={styles.heroActions}>
            <AnchorLink
              href="#work"
              className={styles.primaryCta}
              data-magnetic
              data-cursor
              onClick={() => track("hero_explore_work")}
            >
              Explore Work <ArrowUpRight size={18} />
            </AnchorLink>
            <AnchorLink
              href="#ecosystem"
              className={styles.secondaryCta}
              data-cursor
              onClick={() => track("hero_discover_brands")}
            >
              Discover the Ecosystem <ArrowUpRight size={17} />
            </AnchorLink>
          </div>
        </div>
      </div>
      <div className={styles.heroFoot} data-hero-arrival>
        <AnchorLink href="#about">
          <ArrowDown size={15} /> Scroll to explore
        </AnchorLink>
        <span>Beyond Form. Into Meaning.</span>
        <span>01 — 07 initiatives</span>
      </div>
      <div data-seam className={styles.seam} />
    </section>
  );
}
