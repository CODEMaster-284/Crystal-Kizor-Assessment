import { useRef } from "react";
import { projects } from "../data/projects";
import { ProjectGalleries } from "../components/ui/ProjectGalleries";
import { SectionLabel } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { ButtonLink } from "../components/ui/ButtonLink";
import { MediaFrame } from "../components/ui/MediaFrame";
import { gsap, useGSAP } from "../lib/gsap";
import { dur, ease, motionAllowed } from "../lib/motion";
import styles from "./Sections.module.css";
export function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!motionAllowed()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:1200px) and (pointer:fine)", () => {
        const stage = ref.current?.querySelector<HTMLElement>(
          "[data-project-stage]",
        );
        const panels = gsap.utils.toArray<HTMLElement>(
          "[data-project]",
          ref.current,
        );
        if (!stage) return;
        stage.classList.add(styles.pinnedStage);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            pinSpacing: true,
            start: "top 86px",
            end: () => `+=${innerHeight * projects.length * 0.85}`,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (projects.length - 1),
              duration: dur.ui,
              ease: ease.smooth,
            },
            markers: new URLSearchParams(location.search).has("markers"),
          },
        });
        panels.slice(1).forEach((p, i) => {
          gsap.set(p, { clipPath: "inset(100% 0 0 0)" });
          timeline.to(
            p,
            { clipPath: "inset(0% 0 0 0)", duration: 1, ease: ease.smooth },
            i,
          );
          timeline.from(
            p.querySelector("img"),
            { scale: 1.15, duration: 1, ease: ease.smooth },
            i,
          );
        });
        const focus = (e: FocusEvent) => {
          const index = panels.findIndex((p) => p.contains(e.target as Node));
          const trigger = timeline.scrollTrigger;
          if (index >= 0 && trigger)
            window.scrollTo({
              top:
                trigger.start +
                ((trigger.end - trigger.start) * index) / (panels.length - 1),
              behavior: "instant",
            });
        };
        stage.addEventListener("focusin", focus);
        return () => {
          stage.classList.remove(styles.pinnedStage);
          stage.removeEventListener("focusin", focus);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section
      id="work"
      ref={ref}
      className={styles.work}
      data-theme="dark"
      aria-labelledby="work-heading"
    >
      <div className={styles.workHeading}>
        <SectionLabel id="work" label="Selected work" />
        <div className={styles.sectionTitleRow}>
          <RevealText id="work-heading">Thoughtful by design.</RevealText>
          <p>
            Architecture shaped by people,
            <br />
            materials and the world around it.
          </p>
        </div>
      </div>
      <div data-project-stage className={styles.projectStage}>
        {projects.map((p, i) => (
          <article data-project key={p.id} className={styles.project}>
            <MediaFrame image={p.image} pinned />
            <div className={styles.projectScrim} />
            <div className={styles.projectTop}>
              <span>
                {p.status !== "verified" ? "Sample panel · " : ""}
                {p.category}
              </span>
              <span>
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
            <div className={styles.projectDetails}>
              <div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
              </div>
              <ButtonLink
                href={p.href || `#project-${p.id}`}
                event="project_open"
                params={{ project_id: p.id }}
              >
                View project
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
      <ProjectGalleries />
    </section>
  );
}
