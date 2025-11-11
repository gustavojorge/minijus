import Image from "next/image";

import styles from "./NotFoundSection.module.css";

export function NotFoundSection() {
  return (
    <div className={styles.notFoundContainer}>
      <p className={styles.notFoundText}>Processo não encontrado</p>
      <Image
        src="/not_found.png"
        alt="Nenhum resultado encontrado"
        width={400}
        height={300}
        className={styles.notFoundImage}
      />
    </div>
  );
}

