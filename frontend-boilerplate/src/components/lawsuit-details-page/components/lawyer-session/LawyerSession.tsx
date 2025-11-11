import { Text } from "@radix-ui/themes";

import { Lawyer } from "@/types";
import { LawyerItem } from "./components/LawyerItem";
import styles from "./LawyerSession.module.css";

interface LawyerSessionProps {
  lawyers: Lawyer[];
}

export function LawyerSession({ lawyers }: LawyerSessionProps) {
  if (!lawyers || lawyers.length === 0) {
    return null;
  }

  return (
    <div className={styles.lawyerSession}>
      <div className={styles.sectionHeader}>
        <Text size="4" weight="bold">
          Advogados
        </Text>
      </div>
      <div className={styles.lawyersList}>
        {lawyers.map((lawyer, index) => (
          <LawyerItem key={index} name={lawyer.name} />
        ))}
      </div>
    </div>
  );
}

