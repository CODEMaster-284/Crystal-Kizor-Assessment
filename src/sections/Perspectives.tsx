import { SectionShell } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { articles } from "../data/articles";
import { assetManifest } from "../data/assetManifest";
import { MediaFrame } from "../components/ui/MediaFrame";
import styles from "./Sections.module.css";
export function Perspectives() {
  return (
    <SectionShell id="perspectives" label="Perspectives">
      <div className={styles.sectionTitleRow}>
        <RevealText id="perspectives-heading">
          Ideas with a wider lens.
        </RevealText>
        <span className={styles.overline}>Research · Writing · Media</span>
      </div>
      <div className={styles.perspectivesEditorial}>
        <MediaFrame image={assetManifest.research} />
        <div>
          {articles.length ? (
            articles.map((a) => (
              <a
                key={a.href}
                className={styles.articleRow}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{a.type}</span>
                <h3>{a.title}</h3>
                {a.date && <time>{a.date}</time>}
              </a>
            ))
          ) : (
            <div className={styles.emptyState}>
              <span>Room for what comes next.</span>
              <p>
                Selected writing and research
                <br />
                will appear here.
              </p>
              <span>Verified publications awaiting supplied material</span>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
