import { useRef, useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { brands, pathways } from "../data/brands";
import { SectionShell } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { ButtonLink } from "../components/ui/ButtonLink";
import { gsap, useGSAP } from "../lib/gsap";
import { ease, dur, motionAllowed } from "../lib/motion";
import { track } from "../lib/analytics";
import styles from "./Sections.module.css";
export function Ecosystem() {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const old = useRef(0);
  const b = brands[preview];
  useGSAP(
    () => {
      if (!motionAllowed() || expanded === null) return;
      const panel = document.getElementById(
        `brand-panel-${brands[expanded].id}`,
      );
      if (innerWidth < 768 && panel)
        gsap.fromTo(
          panel,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: dur.ui, ease: ease.soft },
        );
    },
    { scope: ref, dependencies: [expanded], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const direction = preview >= old.current ? 100 : -100;
      old.current = preview;
      const timeline = gsap.timeline();
      timeline
        .fromTo(
          "[data-preview-media]",
          { clipPath: `inset(${direction > 0 ? "100% 0 0 0" : "0 0 100% 0"})` },
          { clipPath: "inset(0% 0 0 0)", duration: dur.wipe, ease: ease.inOut },
        )
        .fromTo(
          "[data-preview-copy]",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.ui, ease: ease.out },
          0,
        );
      return () => {
        timeline.kill();
      };
    },
    { scope: ref, dependencies: [preview], revertOnUpdate: true },
  );
  const select = (index: number) => {
    setSelected(index);
    setPreview(index);
    setExpanded(expanded === index ? null : index);
    track("ecosystem_select", { brand_id: brands[index].id });
  };
  const key = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowDown") next = (index + 1) % brands.length;
    else if (e.key === "ArrowUp")
      next = (index - 1 + brands.length) % brands.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = brands.length - 1;
    else return;
    e.preventDefault();
    setSelected(next);
    setPreview(next);
    ref.current
      ?.querySelector<HTMLButtonElement>(`[data-brand-index="${next}"]`)
      ?.focus();
  };
  return (
    <SectionShell id="ecosystem" label="The ecosystem">
      <div className={styles.sectionTitleRow}>
        <RevealText id="ecosystem-heading">
          Different expressions.
          <br />
          <i>One connected purpose.</i>
        </RevealText>
        <p>
          Seven initiatives.
          <br />
          Find your way into the work.
        </p>
      </div>
      <div className={styles.ecosystemGrid} ref={ref}>
        <div className={styles.directory}>
          {pathways.map((pathway) => (
            <div className={styles.pathway} key={pathway}>
              <h3>{pathway}</h3>
              <ul>
                {brands
                  .filter((b) => b.pathway === pathway)
                  .map((brand) => {
                    const index = brands.indexOf(brand);
                    return (
                      <li
                        key={brand.id}
                        className={preview === index ? styles.activeBrand : ""}
                      >
                        <button
                          data-brand-index={index}
                          tabIndex={selected === index ? 0 : -1}
                          aria-current={selected === index ? "true" : undefined}
                          aria-expanded={expanded === index}
                          aria-controls={`brand-panel-${brand.id}`}
                          onMouseEnter={() => setPreview(index)}
                          onMouseLeave={() => setPreview(selected)}
                          onFocus={() => setPreview(index)}
                          onClick={() => select(index)}
                          onKeyDown={(e) => key(e, index)}
                          data-cursor
                        >
                          <span className={styles.brandIndex}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{brand.name}</span>
                          <ArrowUpRight
                            className={styles.desktopArrow}
                            size={20}
                          />
                          {expanded === index ? (
                            <Minus className={styles.mobileIcon} size={18} />
                          ) : (
                            <Plus className={styles.mobileIcon} size={18} />
                          )}
                        </button>
                        <div
                          id={`brand-panel-${brand.id}`}
                          className={`${styles.brandPanel} ${expanded === index ? styles.expanded : ""}`}
                        >
                          <p>{brand.summary}</p>
                          <ButtonLink
                            href={brand.href}
                            event="brand_external_click"
                            params={{ brand_id: brand.id }}
                          >
                            {brand.cta}
                          </ButtonLink>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
        <aside className={styles.preview} aria-label="Initiative preview">
          <div className={styles.previewMedia} data-preview-media>
            <img
              src={b.image.src}
              srcSet={b.image.srcset}
              sizes="(max-width:767px) 100vw, 40vw"
              width={b.image.width}
              height={b.image.height}
              alt={b.image.alt}
              loading="lazy"
            />
            {b.image.status !== "verified" && (
              <span className="placeholder-tag">
                Placeholder · Initiative imagery
              </span>
            )}
          </div>
          <div data-preview-copy className={styles.previewCopy}>
            <div className={styles.previewMeta}>
              <span>{b.pathway}</span>
              <span>{String(preview + 1).padStart(2, "0")} / 07</span>
            </div>
            <h3>{b.name}</h3>
            <p>{b.summary}</p>
            <ButtonLink
              href={b.href}
              event="brand_external_click"
              params={{ brand_id: b.id }}
            >
              {b.cta}
            </ButtonLink>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
