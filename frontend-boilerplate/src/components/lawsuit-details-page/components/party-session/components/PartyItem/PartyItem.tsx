import { Text } from "@radix-ui/themes";

import styles from "./PartyItem.module.css";

interface PartyItemProps {
  name: string;
  role: string;
}

export function PartyItem({ name, role }: PartyItemProps) {
  return (
    <div className={styles.partyItem}>
      <Text size="3" weight="medium" className={styles.partyName}>
        {name}
      </Text>
      <Text size="2" color="gray" className={styles.partyRole}>
        Parte envolvida - {role}
      </Text>
    </div>
  );
}

