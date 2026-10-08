import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { dur, ease, stagger, motionAllowed } from "../../lib/motion";
import { assetManifest } from "../../data/assetManifest";
import { useSmoothScroll } from "./SmoothScroll";

export function IntroSequence() {
  const [show, setShow] = useState(() => {
    try {
      return (
        motionAllowed() &&
        !sessionStorage.getItem("ck-intro") &&
        (!location.hash || location.hash === "#home")
      );
    } catch {
      return false;
    }
  });
  const ref = useRef<HTMLDivElement>(null);
  const { lock } = useSmoothScroll();
  useGSAP(
    (_, contextSafe) => {
      if (!motionAllowed()) return;
      // Arrival and scroll motion use separate DOM layers, so their transforms never compete.
      const entrance = gsap
        .timeline({ paused: true })
        .fromTo(
          "[data-hero-media]",
          { clipPath: "inset(12% 12% 12% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: dur.hero,
            ease: ease.inOut,
          },
          0,
        )
        .fromTo(
          "[data-hero-portrait]",
          { scale: 1.08 },
          { scale: 1, duration: dur.hero, ease: ease.out },
          0,
        )
        .fromTo(
          "[data-hero-line]",
          { y: 0, yPercent: 110 },
          {
            y: 0,
            yPercent: 0,
            duration: dur.hero,
            stagger: stagger.line,
            ease: ease.out,
          },
          0.1,
        )
        .fromTo(
          "[data-hero-arrival]",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: dur.ui,
            stagger: stagger.item,
            ease: ease.soft,
          },
          0.45,
        );
      let started = false;
      const arrive = () => {
        if (!started) {
          started = true;
          entrance.play(0);
        }
      };
      if (!show) {
        document.documentElement.classList.add("motion-ready");
        arrive();
        return () => entrance.kill();
      }
      lock(true);
      try {
        sessionStorage.setItem("ck-intro", "1");
      } catch {
        /* session storage unavailable */
      }
      const finish = () => {
        clearTimeout(failsafe);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("click", skip);
        window.removeEventListener("ck:force-reveal", skip);
        setShow(false);
        lock(false);
        document.documentElement.classList.add("motion-ready");
        ScrollTrigger.refresh();
      };
      const timeline = gsap
        .timeline({ onComplete: finish })
        .fromTo(
          "[data-intro-logo]",
          { opacity: 0, clipPath: "inset(100% 0 0 0)" },
          {
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.7,
            ease: ease.out,
          },
          0,
        )
        .fromTo(
          "[data-intro-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: ease.inOut },
          0,
        )
        .fromTo(
          "[data-intro-char]",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: dur.ui,
            stagger: stagger.char,
            ease: ease.out,
          },
          0.3,
        )
        .to(
          "[data-intro-strip]",
          { yPercent: -100, duration: 0.6, stagger: 0.05, ease: ease.inOut },
          1,
        )
        .to(
          "[data-intro-content]",
          { opacity: 0, duration: dur.micro, ease: ease.soft },
          1,
        )
        .add(contextSafe!(arrive), 1.15);
      const skip = contextSafe!(() => {
        timeline.kill();
        finish();
        arrive();
      });
      window.addEventListener("keydown", skip);
      window.addEventListener("click", skip);
      window.addEventListener("ck:force-reveal", skip);
      const failsafe = setTimeout(skip, 1900);
      return () => {
        clearTimeout(failsafe);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("click", skip);
        window.removeEventListener("ck:force-reveal", skip);
        timeline.kill();
        entrance.kill();
        lock(false);
      };
    },
    { scope: document.getElementById("root")! },
  );
  if (!show) return null;
  return (
    <div
      ref={ref}
      data-intro
      className="intro"
      aria-label="Crystal Kizor introduction"
    >
      <div className="intro-strips">
        {Array.from({ length: 5 }, (_, i) => (
          <div data-intro-strip key={i} />
        ))}
      </div>
      <div data-intro-content className="intro-content">
        <img
          data-intro-logo
          src={assetManifest["logo-monogram-light"].src}
          width={245}
          height={185}
          alt="Crystal Kizor monogram"
          loading="lazy"
        />
        <div className="intro-name">
          {"CRYSTAL KIZOR".split("").map((c, i) => (
            <span key={i}>
              <span data-intro-char>{c === " " ? "\u00a0" : c}</span>
            </span>
          ))}
        </div>
        <div data-intro-rule className="intro-rule" />
      </div>
      <button className="intro-skip" type="button">
        Skip intro ↗
      </button>
    </div>
  );
}
