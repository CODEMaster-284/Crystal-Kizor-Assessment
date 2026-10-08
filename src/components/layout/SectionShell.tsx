import type { ReactNode } from "react";
import { sectionNumber } from "../../data/navigation";
import styles from "./Layout.module.css";
export function SectionLabel({ id, label }: { id: string; label: string }) {
  return (
    <div className={styles.label}>
      <span>{sectionNumber(id)}</span>
      <span>{label}</span>
      <span className={styles.labelRule} />
    </div>
  );
}
export function SectionShell({
  id,
  label,
  theme = "light",
  children,
  className = "",
}: {
  id: string;
  label: string;
  theme?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`${styles.section} ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <SectionLabel id={id} label={label} />
      {children}
    </section>
  );
}
