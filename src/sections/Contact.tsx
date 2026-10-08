import { SectionShell } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { siteContent } from "../data/siteContent";
import { ButtonLink } from "../components/ui/ButtonLink";
import { ArrowUpRight } from "lucide-react";
import styles from "./Sections.module.css";
export function Contact() {
  return (
    <SectionShell
      id="contact"
      label="The next possibility"
      theme="dark"
      className={styles.contact}
    >
      <svg
        className={styles.contactGrid}
        viewBox="0 0 1200 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[200, 400, 600, 800, 1000].map((x) => (
          <path key={x} data-grid-line d={`M${x} 0V1000`} pathLength="1" />
        ))}
        {[200, 400, 600, 800].map((y) => (
          <path key={y} data-grid-line d={`M0 ${y}H1200`} pathLength="1" />
        ))}
      </svg>
      <RevealText id="contact-heading">
        What could we
        <br />
        build <i>together?</i>
      </RevealText>
      <p className={styles.contactIntro}>
        Choose a direction. Begin a conversation.
      </p>
      <div className={styles.contactRoutes}>
        {siteContent.routes.map((r, i) => (
          <div key={r.id} className={styles.contactRoute}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{r.label}</h3>
              <p>{r.detail}</p>
            </div>
            {r.href ? (
              <ButtonLink
                href={r.href}
                event={
                  r.id === "speaking"
                    ? "speaking_enquiry_click"
                    : "contact_route_click"
                }
                params={{ route: r.id }}
              >
                Start a conversation
              </ButtonLink>
            ) : (
              <button
                aria-disabled="true"
                title="Link coming soon"
                type="button"
              >
                <span>Link coming soon</span>
                <ArrowUpRight size={22} />
              </button>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
