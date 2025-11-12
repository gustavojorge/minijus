import { Select, Text, TextField } from "@radix-ui/themes";

import styles from "./DataSession.module.css";

type DateOperator = "<" | "=" | ">";

interface DataSessionProps {
  operator: DateOperator;
  date: string;
  onOperatorChange: (operator: DateOperator) => void;
  onDateChange: (date: string) => void;
}

export function DataSession({
  operator,
  date,
  onOperatorChange,
  onDateChange,
}: DataSessionProps) {
  return (
    <div className={styles.filterSection}>
      <Text size="3" weight="medium" className={styles.label}>
        Data de distribuição
      </Text>
      <div className={styles.dateFilter}>
        <Select.Root
          value={operator}
          onValueChange={(val) => onOperatorChange(val as DateOperator)}
        >
          <Select.Trigger className={styles.operatorSelect} />
          <Select.Content>
            <Select.Item value="=">Igual a</Select.Item>
            <Select.Item value="<">Antes de</Select.Item>
            <Select.Item value=">">Depois de</Select.Item>
          </Select.Content>
        </Select.Root>
        <TextField.Root
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          placeholder="Selecione a data"
          className={styles.dateInput}
        />
      </div>
    </div>
  );
}

