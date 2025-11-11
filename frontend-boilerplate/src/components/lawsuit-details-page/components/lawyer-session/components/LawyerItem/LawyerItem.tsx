import { Text } from "@radix-ui/themes";

import { renderHighlightedText } from "@/utils/highlight";
import styles from "./LawyerItem.module.css";

interface LawyerItemProps {
  name?: string;
}

export function LawyerItem({ name }: LawyerItemProps) {
  if (!name) {
    return null;
  }

  return (
    <div className={styles.lawyerItem}>
      <Text size="3">{renderHighlightedText(name)}</Text>
    </div>
  );
}

