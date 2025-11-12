import { useState } from "react";
import { Dialog } from "@radix-ui/themes";

import { CourtSession, DataSession, FooterSession } from "./components";
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
          <CourtSession value={court} onChange={setCourt} />
          <DataSession
            operator={dateOperator}
            date={dateValue}
            onOperatorChange={setDateOperator}
            onDateChange={setDateValue}
          />
          <FooterSession
            hasActiveFilters={hasActiveFilters}
            onClear={handleClear}
            onApply={handleApply}
          />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

