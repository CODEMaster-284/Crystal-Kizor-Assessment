import { SectionShell } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { ButtonLink } from "../components/ui/ButtonLink";
import { siteContent } from "../data/siteContent";
import { assetManifest } from "../data/assetManifest";
import { MediaFrame } from "../components/ui/MediaFrame";
import styles from "./Sections.module.css";
export function Speaking() {
  return (
    <SectionShell id="speaking" label="Speaking & conversations" theme="dark">
      <div className={styles.speakingGrid}>
        <div>
          <RevealText id="speaking-heading">
            Conversations
            <br />
            that move us <i>forward.</i>
          </RevealText>
          <p className={styles.bodyCopy}>
            Architecture meets the world around it. Talks and conversations
            across design, cities, climate and entrepreneurship.
          </p>
          <ButtonLink
            href={siteContent.routes.find((r) => r.id === "speaking")?.href}
            event="speaking_enquiry_click"
          >
            Enquire about speaking
          </ButtonLink>
        </div>
        <ol className={styles.themeList}>
          {siteContent.themes.map((theme, i) => (
            <li key={theme}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <RevealText as="p">{theme}</RevealText>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.speakingEditorial}>
        <MediaFrame image={assetManifest.speaking} />
        <p>Architecture. Ideas. Conversation.</p>
      </div>
    </SectionShell>
  );
}
