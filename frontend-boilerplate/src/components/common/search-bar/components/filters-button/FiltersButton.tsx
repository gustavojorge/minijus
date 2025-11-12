import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import styles from "./FiltersButton.module.css";

interface FiltersButtonProps {
  onClick: () => void;
  hasActiveFilters?: boolean;
  disabled?: boolean;
}

export function FiltersButton({
  onClick,
  hasActiveFilters = false,
  disabled = false,
}: FiltersButtonProps) {
  return (
    <Button
      type="button"
      variant={hasActiveFilters ? "solid" : "soft"}
      color={hasActiveFilters ? "jade" : "gray"}
      onClick={onClick}
      disabled={disabled}
      className={styles.filtersButton}
      aria-label="Abrir filtros de busca"
    >
      <MixerHorizontalIcon className={styles.icon} aria-hidden="true" />
      Filtros
    </Button>
  );
}

