import { SectionShell } from "../components/layout/SectionShell";
import { RevealText } from "../components/ui/RevealText";
import { ScrubWords } from "../components/ui/ScrubWords";
import { MediaFrame } from "../components/ui/MediaFrame";
import { assetManifest } from "../data/assetManifest";
import { siteContent } from "../data/siteContent";
import styles from "./Sections.module.css";
export function About() {
  return (
    <SectionShell id="about" label="The person behind the possibilities">
      <div className={styles.aboutGrid}>
        <div className={styles.aboutImage}>
          <MediaFrame image={assetManifest.about} />
          <span className={styles.imageNote}>
            One person. Many possibilities.
          </span>
        </div>
        <div className={styles.aboutCopy}>
          <span className={styles.overline}>Beyond the built environment</span>
          <RevealText id="about-heading">
            An architect.
            <br />A wider perspective.
          </RevealText>
          <p className={styles.bodyCopy}>{siteContent.bio}</p>
          <ScrubWords
            text={siteContent.statement}
            className={styles.statement}
          />
          <p className={styles.bodyCopy}>{siteContent.aboutDetail}</p>
          <img
            className={styles.signature}
            src={assetManifest["logo-signature-dark"].src}
            alt="Crystal Kizor signature logo"
            width={425}
            height={165}
            loading="lazy"
          />
        </div>
      </div>
      <div className={styles.practiceEditorial}>
        <MediaFrame image={assetManifest.practice} />
        <div>
          <span className={styles.overline}>
            One practice. Many expressions.
          </span>
          <h3>
            Spaces.
            <br />
            Ideas.
            <br />
            <i>Possibilities.</i>
          </h3>
          <img
            src={assetManifest["logo-primary-dark"].src}
            width={835}
            height={375}
            alt="Crystal Kizor primary wordmark"
            loading="lazy"
          />
        </div>
      </div>
    </SectionShell>
  );
}
