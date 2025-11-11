import { Text } from "@radix-ui/themes";

import { Lawsuit } from "@/types";
import { DetailItem } from "./components/DetailItem";
import styles from "./DetailSession.module.css";

interface DetailSessionProps {
  lawsuit: Lawsuit;
}

export function DetailSession({ lawsuit }: DetailSessionProps) {
  return (
    <div className={styles.detailSession}>
      <div className={styles.sectionHeader}>
        <Text size="4" weight="bold">
          Detalhes do processo
        </Text>
      </div>
      <div className={styles.detailsList}>
        <DetailItem label="Tribunal" value={lawsuit.court} />
        <DetailItem
          label="Data de início"
          value={new Date(lawsuit.startDate).toLocaleDateString("pt-BR")}
        />
        <DetailItem
          label="Movimentações"
          value={lawsuit.movements.length.toString()}
        />
      </div>
    </div>
  );
}

