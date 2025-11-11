import { ReactNode } from "react";

import styles from "./FeatureItem.module.css";

interface FeatureItemProps {
  icon: ReactNode;
  description: string;
}

export function FeatureItem({ icon, description }: FeatureItemProps) {
  return (
    <article className={styles.card} aria-label={`${description}`}>
      <div className={styles.iconContainer} aria-hidden="true">
        {icon}
      </div>
      <p className={styles.description}>{description}</p>
    </article>
  );
}

