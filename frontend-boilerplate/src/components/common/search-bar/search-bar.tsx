import { useState, FormEvent } from "react";

import {
  InputSearchBar,
  ButtonSearchBar,
  FiltersButton,
  FiltersModal,
  type Filters,
} from "./components";
import styles from "./search-bar.module.css";

interface SearchBarProps {
  onSearch: (cnj: string, filters?: Filters) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cnj = searchTerm.trim();
    
    const hasActiveFilters = filters.court || filters.date;
    if (!cnj && !hasActiveFilters) {
      return;
    }

    onSearch(cnj, filters);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = filters.court || filters.date;
  const canSubmit = searchTerm.trim() || hasActiveFilters;

  return (
    <>
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
          <FiltersButton
            onClick={() => setIsFiltersModalOpen(true)}
            hasActiveFilters={hasActiveFilters}
            disabled={isLoading}
          />
        </div>
      </form>

      <FiltersModal
        open={isFiltersModalOpen}
        onOpenChange={setIsFiltersModalOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
}

