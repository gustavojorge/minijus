import { useState, FormEvent } from "react";

import { InputSearchBar, ButtonSearchBar, SelectSearchBar } from "./components";
import styles from "./search-bar.module.css";

type TribunalOption = "ALL" | "TJAL" | "TJCE";

interface SearchBarProps {
  onSearch: (cnj: string, court: TribunalOption) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [court, setCourt] = useState<TribunalOption>("ALL");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cnj = searchTerm.trim();
    
    if (!cnj && court === "ALL") {
      return;
    }

    onSearch(cnj, court);
  };

  const canSubmit = searchTerm.trim() || (court !== "ALL");

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.searchForm}
      role="search"
      aria-label="Buscar processos"
    >
      <div className={styles.searchControls}>
        <div className={styles.searchWrapper}>
          <InputSearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            disabled={isLoading}
          />
          <ButtonSearchBar disabled={isLoading || !canSubmit} />
        </div>
        <SelectSearchBar
          value={court}
          onChange={setCourt}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}

