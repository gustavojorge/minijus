import { Text } from "@radix-ui/themes";

import styles from "./LawsuitHeader.module.css";

interface LawsuitHeaderProps {
  number: string;
  court: string;
  startDate: string;
}

export function LawsuitHeader({ number, court, startDate }: LawsuitHeaderProps) {
  return (
    <div className={styles.headerSection}>
      <h1 className={styles.title}>
        Processo n. {number} do {court}
      </h1>
      <Text size="3" color="gray" className={styles.date}>
        Distribuído em {new Date(startDate).toLocaleDateString("pt-BR")}
      </Text>
    </div>
  );
}

