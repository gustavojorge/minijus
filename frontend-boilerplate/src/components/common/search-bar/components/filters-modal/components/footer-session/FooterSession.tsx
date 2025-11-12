import { Button } from "@radix-ui/themes";

import styles from "./FooterSession.module.css";

interface FooterSessionProps {
  hasActiveFilters: boolean;
  onClear: () => void;
  onApply: () => void;
}

export function FooterSession({
  hasActiveFilters,
  onClear,
  onApply,
}: FooterSessionProps) {
  return (
    <div className={styles.modalActions}>
      <Button
        variant="soft"
        color="gray"
        onClick={onClear}
        disabled={!hasActiveFilters}
      >
        Limpar
      </Button>
      <Button onClick={onApply} color="jade">
        Aplicar filtros
      </Button>
    </div>
  );
}

