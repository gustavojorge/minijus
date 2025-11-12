import { Select, Text } from "@radix-ui/themes";

import styles from "./CourtSession.module.css";

type TribunalOption = "ALL" | "TJAL" | "TJCE";

interface CourtSessionProps {
  value: TribunalOption;
  onChange: (value: TribunalOption) => void;
}

export function CourtSession({ value, onChange }: CourtSessionProps) {
  return (
    <div className={styles.filterSection}>
      <Text size="3" weight="medium" className={styles.label}>
        Tribunal
      </Text>
      <Select.Root
        value={value}
        onValueChange={(val) => onChange(val as TribunalOption)}
      >
        <Select.Trigger className={styles.select} />
        <Select.Content>
          <Select.Item value="ALL">Todos os tribunais</Select.Item>
          <Select.Item value="TJAL">TJAL</Select.Item>
          <Select.Item value="TJCE">TJCE</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

