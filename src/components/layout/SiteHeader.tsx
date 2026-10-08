import { useEffect, useRef, type RefObject } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { sections } from "../../data/navigation";
import { assetManifest } from "../../data/assetManifest";
import { AnchorLink } from "../ui/ButtonLink";
import { useSmoothScroll } from "../motion/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { dur, ease, stagger, motionAllowed } from "../../lib/motion";
import styles from "./Header.module.css";
export function SiteHeader({
  mainRef,
  open,
  setOpen,
}: {
  mainRef: RefObject<HTMLElement | null>;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const { lock } = useSmoothScroll();
  useGSAP(
    () => {
      const triggers = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-theme]"),
      ).map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 86px",
          end: "bottom 86px",
          onToggle: (self) => {
            if (self.isActive) {
              const progress =
                document.querySelector<HTMLElement>("[data-progress]");
              if (progress)
                progress.style.backgroundColor =
                  section.dataset.theme === "light" ? "#8c5138" : "#d69b7a";
            }
            if (self.isActive)
              ref.current?.classList.toggle(
                styles.light,
                section.dataset.theme === "light",
              );
          },
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref },
  );
  useGSAP(
    () => {
      const header = ref.current;
      if (!header) return;
      let last = scrollY;
      const slide = gsap.quickTo(header, "yPercent", {
        duration: dur.ui,
        ease: ease.soft,
      });
      const scroll = () => {
        header.classList.toggle(styles.solid, scrollY > 80);
        if (motionAllowed())
          slide(
            open ||
              header.contains(document.activeElement) ||
              scrollY < 100 ||
              scrollY < last
              ? 0
              : -105,
          );
        last = scrollY;
      };
      window.addEventListener("scroll", scroll, { passive: true });
      const focus = () => slide(0);
      header.addEventListener("focusin", focus);
      scroll();
      return () => {
        window.removeEventListener("scroll", scroll);
        header.removeEventListener("focusin", focus);
      };
    },
    { scope: ref, dependencies: [open], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      if (open && motionAllowed()) {
        gsap.fromTo(
          dialog.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: dur.ui, ease: ease.inOut },
        );
        gsap.from(dialog.current?.querySelectorAll("nav a") || [], {
          yPercent: 100,
          opacity: 0,
          stagger: stagger.line,
          duration: dur.ui,
          ease: ease.out,
        });
      }
    },
    { scope: ref, dependencies: [open], revertOnUpdate: true },
  );
  useEffect(() => {
    if (!open) return;
    const main = mainRef.current;
    const menuButton = button.current;
    lock(true);
    if (main) main.inert = true;
    const footer = document.querySelector("footer");
    if (footer) footer.inert = true;
    const first = dialog.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const targets = Array.from(
          dialog.current?.querySelectorAll<HTMLElement>("a,button") || [],
        );
        const first = targets[0],
          last = targets[targets.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      lock(false);
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      menuButton?.focus();
    };
  }, [open, mainRef, lock, setOpen]);
  return (
    <header ref={ref} className={styles.header}>
      <AnchorLink
        href="#home"
        className={styles.brand}
        aria-label="Crystal Kizor home"
      >
        <img
          className={styles.logoLight}
          src={assetManifest["logo-horizontal-light"].src}
          width={595}
          height={75}
          alt="Crystal Kizor"
          loading="lazy"
        />
        <img
          className={styles.logoDark}
          src={assetManifest["logo-horizontal-dark"].src}
          width={595}
          height={75}
          alt=""
          loading="lazy"
        />
        <span>ARCHITECTURE & BEYOND</span>
      </AnchorLink>
      <nav className={styles.desktopNav} aria-label="Primary navigation">
        <AnchorLink href="#about">About</AnchorLink>
        <AnchorLink href="#work">Work</AnchorLink>
        <AnchorLink href="#ecosystem">Ecosystem</AnchorLink>
        <AnchorLink href="#contact" className={styles.contactLink}>
          Let’s connect <ArrowUpRight size={15} />
        </AnchorLink>
      </nav>
      <button
        className={styles.menuButton}
        ref={button}
        aria-expanded={open}
        aria-controls="navigation-overlay"
        onClick={() => setOpen(!open)}
      >
        <span>Menu</span>
        <Menu size={19} />
      </button>
      {open && (
        <div
          id="navigation-overlay"
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.overlayTop}>
            <span>Crystal Kizor</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>
          <nav>
            {sections.map((s, i) => (
              <AnchorLink
                key={s.id}
                href={`#${s.id}`}
                onClick={() => {
                  setOpen(false);
                  lock(false);
                }}
              >
                <span>{String(i).padStart(2, "0")}</span>
                {s.label}
                <ArrowUpRight size={24} />
              </AnchorLink>
            ))}
          </nav>
          <p>Beyond Form. Into Meaning.</p>
        </div>
      )}
    </header>
  );
}
