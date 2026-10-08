import { brands } from "../../data/brands";
import { assetManifest } from "../../data/assetManifest";
import { AnchorLink } from "../ui/ButtonLink";
import styles from "./Layout.module.css";
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <span className={styles.wordmark}>
          <img
            src={assetManifest["logo-horizontal-light"].src}
            width={595}
            height={75}
            alt="Crystal Kizor"
            loading="lazy"
          />
          <span>Beyond Form. Into Meaning.</span>
        </span>
        <div className={styles.brandMap}>
          {brands.map((b) => (
            <AnchorLink key={b.id} href="#ecosystem">
              {b.name}
            </AnchorLink>
          ))}
        </div>
      </div>
      <details className={styles.identity}>
        <summary>The Crystal Kizor identity</summary>
        <img
          src={assetManifest.logoCollection.src}
          width={2172}
          height={724}
          alt={assetManifest.logoCollection.alt}
          loading="lazy"
        />
      </details>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Crystal Kizor</span>
        <span>Architecture. Ideas. Purpose.</span>
        <AnchorLink href="#home">Back to top ↑</AnchorLink>
      </div>
    </footer>
  );
}
