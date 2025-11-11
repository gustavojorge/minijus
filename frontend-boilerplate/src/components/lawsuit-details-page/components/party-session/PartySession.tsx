import { Text } from "@radix-ui/themes";

import { Party } from "@/types";
import { PartyItem } from "./components/PartyItem";
import styles from "./PartySession.module.css";

interface PartySessionProps {
  parties: Party[];
}

export function PartySession({ parties }: PartySessionProps) {
  return (
    <div className={styles.partySession}>
      <div className={styles.sectionHeader}>
        <Text size="4" weight="bold">
          Partes envolvidas
        </Text>
      </div>
      <div className={styles.partiesList}>
        {parties && parties.length > 0 ? (
          parties.map((party, index) => (
            <PartyItem key={index} name={party.name} role={party.role} />
          ))
        ) : (
          <Text size="3" color="gray">
            Nenhuma parte encontrada.
          </Text>
        )}
      </div>
    </div>
  );
}

