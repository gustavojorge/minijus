import { useState } from "react";
import { Button, Dialog, Text, Select, TextField } from "@radix-ui/themes";

import styles from "./FiltersModal.module.css";

type TribunalOption = "ALL" | "TJAL" | "TJCE";
type DateOperator = "<" | "=" | ">";

export interface DateFilter {
  date: string;
  operator: DateOperator;
}

export interface Filters {
  court?: TribunalOption;
  date?: DateFilter;
}

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

export function FiltersModal({
  open,
  onOpenChange,
  filters: initialFilters,
  onApplyFilters,
}: FiltersModalProps) {
  const [court, setCourt] = useState<TribunalOption>(
    initialFilters.court || "ALL"
  );
  const [dateOperator, setDateOperator] = useState<DateOperator>(
    initialFilters.date?.operator || "="
  );
  const [dateValue, setDateValue] = useState<string>(
    initialFilters.date?.date || ""
  );

  const handleApply = () => {
    const newFilters: Filters = {};

    if (court && court !== "ALL") {
      newFilters.court = court;
    }

    if (dateValue) {
      newFilters.date = {
        date: dateValue,
        operator: dateOperator,
      };
    }

    onApplyFilters(newFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setCourt("ALL");
    setDateOperator("=");
    setDateValue("");
    onApplyFilters({});
    onOpenChange(false);
  };

  const hasActiveFilters =
    (court && court !== "ALL") || dateValue !== "";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className={styles.modalContent} size="3">
        <Dialog.Title className={styles.title}>Filtros de busca</Dialog.Title>

        <div className={styles.modalBody}>
          <div className={styles.filterSection}>
            <Text size="3" weight="medium" className={styles.label}>
              Tribunal
            </Text>
            <Select.Root
              value={court}
              onValueChange={(value) => setCourt(value as TribunalOption)}
            >
              <Select.Trigger className={styles.select} />
              <Select.Content>
                <Select.Item value="ALL">Todos os tribunais</Select.Item>
                <Select.Item value="TJAL">TJAL</Select.Item>
                <Select.Item value="TJCE">TJCE</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className={styles.filterSection}>
            <Text size="3" weight="medium" className={styles.label}>
              Data de distribuição
            </Text>
            <div className={styles.dateFilter}>
              <Select.Root
                value={dateOperator}
                onValueChange={(value) => setDateOperator(value as DateOperator)}
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
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                placeholder="Selecione a data"
                className={styles.dateInput}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <Button
              variant="soft"
              color="gray"
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              Limpar
            </Button>
            <Button onClick={handleApply} color="jade">
              Aplicar filtros
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

