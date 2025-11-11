import { Text } from "@radix-ui/themes";

import { Lawsuit } from "@/types";
import { formatDate as formatDateUtil } from "@/utils/date";
import { DetailItem } from "./components/DetailItem";
import styles from "./DetailSession.module.css";

interface DetailSessionProps {
  lawsuit: Lawsuit;
}

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

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
          label="Data de distribuição"
          value={lawsuit.date ? formatDateUtil(lawsuit.date) : undefined}
        />
        <DetailItem label="Natureza" value={lawsuit.nature} />
        <DetailItem label="Tipo" value={lawsuit.kind} />
        <DetailItem label="Assunto" value={lawsuit.subject} />
        <DetailItem label="Juiz" value={lawsuit.judge} />
        <DetailItem
          label="Valor da causa"
          value={
            lawsuit.value !== undefined && lawsuit.value !== null
              ? formatCurrency(lawsuit.value)
              : undefined
          }
        />
        <DetailItem
          label="Movimentações"
          value={(lawsuit.movements?.length || 0).toString()}
        />
      </div>
    </div>
  );
}

