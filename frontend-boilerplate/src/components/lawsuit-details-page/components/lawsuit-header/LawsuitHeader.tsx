import { Text } from "@radix-ui/themes";

import { formatDate } from "@/utils/date";
import { renderHighlightedText } from "@/utils/highlight";
import styles from "./LawsuitHeader.module.css";

interface LawsuitHeaderProps {
  number: string;
  court?: string;
  startDate?: string;
}

export function LawsuitHeader({ number, court, startDate }: LawsuitHeaderProps) {
  return (
    <div className={styles.headerSection}>
      <h1 className={styles.title}>
        Processo n. {renderHighlightedText(number)}
        {court && (
          <>
            {" "}do {renderHighlightedText(court)}
          </>
        )}
      </h1>
      {startDate && (
      <Text size="3" color="gray" className={styles.date}>
          Distribuído em {formatDate(startDate)}
      </Text>
      )}
    </div>
  );
}

