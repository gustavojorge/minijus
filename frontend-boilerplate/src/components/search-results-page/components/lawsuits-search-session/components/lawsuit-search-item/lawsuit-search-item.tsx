import { Card, Text, Button } from "@radix-ui/themes";
import Link from "next/link";

import { Lawsuit } from "@/types";
import styles from "./lawsuit-search-item.module.css";

interface LawsuitSearchItemProps {
  lawsuit: Lawsuit;
}

export function LawsuitSearchItem({ lawsuit }: LawsuitSearchItemProps) {
  return (
    <Card className={styles.card} role="listitem">
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <Text size="4" weight="bold">
            {lawsuit.number}
          </Text>
          <Text size="2" color="gray" className={styles.court}>
            {lawsuit.court}
          </Text>
        </div>
        <div className={styles.parties}>
          <Text size="3" color="gray">
            {lawsuit.parties
              .map((party) => `${party.name} (${party.role})`)
              .join(" x ")}
          </Text>
        </div>
        <div className={styles.metadata}>
          <Text size="1" color="gray">
            Início: {new Date(lawsuit.startDate).toLocaleDateString("pt-BR")}
          </Text>
          <Text size="1" color="gray">
            {lawsuit.movements.length} movimentação
            {lawsuit.movements.length !== 1 ? "ões" : ""}
          </Text>
        </div>
        <Button
          asChild
          variant="outline"
          color="jade"
          size="2"
          className={styles.viewButton}
        >
          <Link
            href={`/lawsuit/${encodeURIComponent(lawsuit.number)}`}
            aria-label={`Ver detalhes do processo ${lawsuit.number}`}
          >
            Ver Detalhes
          </Link>
        </Button>
      </div>
    </Card>
  );
}

