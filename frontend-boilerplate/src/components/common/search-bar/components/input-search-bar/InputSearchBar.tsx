import styles from "./InputSearchBar.module.css";

interface InputSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputSearchBar({
  value,
  onChange,
  disabled = false,
  placeholder = "Digite um número de processo (CNJ)",
}: InputSearchBarProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.searchInput}
      disabled={disabled}
      aria-label="Campo de busca de processos"
    />
  );
}

