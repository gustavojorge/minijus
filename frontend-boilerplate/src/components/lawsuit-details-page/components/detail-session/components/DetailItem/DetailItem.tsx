import { Text } from "@radix-ui/themes";

import styles from "./DetailItem.module.css";

interface DetailItemProps {
  label: string;
  value: string;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className={styles.detailItem}>
      <Text size="3" color="gray">
        {label}
      </Text>
      <Text size="3" weight="medium">
        {value}
      </Text>
    </div>
  );
}

