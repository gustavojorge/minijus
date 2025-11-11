import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import styles from "./ButtonSearchBar.module.css";

interface ButtonSearchBarProps {
  disabled?: boolean;
}

export function ButtonSearchBar({ disabled = false }: ButtonSearchBarProps) {
  return (
    <button
      type="submit"
      className={styles.searchIconButton}
      disabled={disabled}
      aria-label="Executar busca"
    >
      <MagnifyingGlassIcon className={styles.searchIcon} aria-hidden="true" />
    </button>
  );
}

