import { Card, Text, Button } from "@radix-ui/themes";
import Link from "next/link";

import { Lawsuit } from "@/types";
import { formatDate } from "@/utils/date";
import { renderHighlightedText, stripMarkTags } from "@/utils/highlight";
import styles from "./lawsuit-search-item.module.css";

interface LawsuitSearchItemProps {
  lawsuit: Lawsuit;
  originalQuery?: string;
}

export function LawsuitSearchItem({ lawsuit, originalQuery }: LawsuitSearchItemProps) {
  const getDetailUrl = () => {
    const baseUrl = `/lawsuit/${encodeURIComponent(stripMarkTags(lawsuit.number))}`;
    if (originalQuery) {
      return `${baseUrl}?q=${encodeURIComponent(originalQuery)}`;
    }
    return baseUrl;
  };

  return (
    <Card className={styles.card} role="listitem">
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <Text size="4" weight="bold">
            {renderHighlightedText(lawsuit.number)}
          </Text>
          {lawsuit.court && (
            <Text size="2" color="gray" className={styles.court}>
              {renderHighlightedText(lawsuit.court)}
            </Text>
          )}
        </div>
        <div className={styles.parties}>
          {lawsuit.parties && lawsuit.parties.length > 0 ? (
            <Text size="3" color="gray">
              {lawsuit.parties.map((party, idx) => (
                <span key={idx}>
                  {idx > 0 && " x "}
                  {renderHighlightedText(party.name || "")} ({party.role || ""})
                </span>
              ))}
            </Text>
          ) : (
            <Text size="3" color="gray">
              Nenhuma parte encontrada
            </Text>
          )}
        </div>
        <div className={styles.metadata}>
          {lawsuit.startDate && (
            <Text size="1" color="gray">
              Data de distribuição: {formatDate(lawsuit.startDate)}
            </Text>
          )}
          <Text size="1" color="gray">
            {(lawsuit.movements?.length || 0)} {(lawsuit.movements?.length || 0) === 1 ? "movimentação" : "movimentações"}
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
            href={getDetailUrl()}
            aria-label={`Ver detalhes do processo ${stripMarkTags(lawsuit.number)}`}
          >
            Ver Detalhes
          </Link>
        </Button>
      </div>
    </Card>
  );
}

