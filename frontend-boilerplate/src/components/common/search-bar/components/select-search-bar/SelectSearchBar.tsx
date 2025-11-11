import styles from "./SelectSearchBar.module.css";

type TribunalOption = "ALL" | "TJAL" | "TJCE";

interface SelectSearchBarProps {
  value: TribunalOption;
  onChange: (value: TribunalOption) => void;
  disabled?: boolean;
}

export function SelectSearchBar({
  value,
  onChange,
  disabled = false,
}: SelectSearchBarProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TribunalOption)}
      className={styles.courtSelect}
      disabled={disabled}
      aria-label="Filtrar por tribunal"
    >
      <option value="ALL">Tribunal</option>
      <option value="TJAL">TJAL</option>
      <option value="TJCE">TJCE</option>
    </select>
  );
}

