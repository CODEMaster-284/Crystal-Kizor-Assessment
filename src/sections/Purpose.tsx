import { SectionShell } from "../components/layout/SectionShell";
import { brands } from "../data/brands";
import { ButtonLink } from "../components/ui/ButtonLink";
import styles from "./Sections.module.css";
export function Purpose() {
  return (
    <SectionShell
      id="purpose"
      label="Purpose & communities"
      className={styles.purpose}
    >
      <div className={styles.sectionTitleRow}>
        <h2 id="purpose-heading">A purpose beyond practice.</h2>
        <p>
          Making space for opportunity.
          <br />
          Making room for belonging.
        </p>
      </div>
      <div className={styles.purposeGrid}>
        {["ako", "alive"].map((id) => {
          const b = brands.find((b) => b.id === id)!;
          return (
            <article key={id} data-gentle>
              <span className={styles.overline}>{b.pathway}</span>
              <h3>{b.name}</h3>
              <p>{b.summary}</p>
              <ButtonLink href={b.href}>{b.cta}</ButtonLink>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
