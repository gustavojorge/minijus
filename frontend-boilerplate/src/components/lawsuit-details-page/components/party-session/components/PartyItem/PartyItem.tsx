import { Text } from "@radix-ui/themes";

import { renderHighlightedText } from "@/utils/highlight";
import styles from "./PartyItem.module.css";

interface PartyItemProps {
  name?: string;
  role?: string;
}

export function PartyItem({ name, role }: PartyItemProps) {
  if (!name && !role) {
    return null;
  }

  return (
    <div className={styles.partyItem}>
      {name && (
        <Text size="3" weight="medium" className={styles.partyName}>
          {renderHighlightedText(name)}
        </Text>
      )}
      {role && (
        <Text size="2" color="gray" className={styles.partyRole}>
          Parte envolvida - {renderHighlightedText(role)}
        </Text>
      )}
    </div>
  );
}

