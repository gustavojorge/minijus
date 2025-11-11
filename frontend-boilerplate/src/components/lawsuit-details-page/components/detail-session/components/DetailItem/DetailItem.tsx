import { Text } from "@radix-ui/themes";

import { renderHighlightedText } from "@/utils/highlight";
import styles from "./DetailItem.module.css";

interface DetailItemProps {
  label: string;
  value?: string | null;
}

export function DetailItem({ label, value }: DetailItemProps) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className={styles.detailItem}>
      <Text size="3" color="gray">
        {label}
      </Text>
      <Text size="3" weight="medium">
        {renderHighlightedText(value)}
      </Text>
    </div>
  );
}

