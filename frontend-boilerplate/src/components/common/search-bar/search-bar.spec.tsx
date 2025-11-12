import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchBar } from "./search-bar";

jest.mock("./components", () => ({
  InputSearchBar: ({ value, onChange, disabled }: any) => (
    <input
      data-testid="input-search-bar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Campo de busca de processos"
    />
  ),
  ButtonSearchBar: ({ disabled }: any) => (
    <button
      data-testid="button-search-bar"
      type="submit"
      disabled={disabled}
      aria-label="Executar busca"
    >
      Buscar
    </button>
  ),
  FiltersButton: ({ onClick, hasActiveFilters, disabled }: any) => (
    <button
      data-testid="filters-button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Abrir filtros de busca"
    >
      Filtros
    </button>
  ),
  FiltersModal: ({ open, onOpenChange, filters, onApplyFilters }: any) => (
    open ? (
      <div data-testid="filters-modal">
        <button onClick={() => onOpenChange(false)}>Fechar</button>
        <button onClick={() => onApplyFilters(filters)}>Aplicar</button>
      </div>
    ) : null
  ),
}));

describe("<SearchBar />", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("should render search form", () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar processos")).toBeInTheDocument();
    expect(screen.getByTestId("input-search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("button-search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("filters-button")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onSearch with CNJ when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByTestId("input-search-bar");
    const button = screen.getByTestId("button-search-bar");

    await user.type(input, "1234567-89.2021.8.06.0001");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("1234567-89.2021.8.06.0001", {});
    });
  });

  it("should not call onSearch when form is empty and no filters", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const button = screen.getByTestId("button-search-bar");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  it("should disable button when loading", () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading />);

    const button = screen.getByTestId("button-search-bar");
    expect(button).toBeDisabled();
  });

  it("should disable button when form is empty and no filters", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const button = screen.getByTestId("button-search-bar");
    expect(button).toBeDisabled();
  });

  it("should enable button when input has value", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByTestId("input-search-bar");
    const button = screen.getByTestId("button-search-bar");

    expect(button).toBeDisabled();

    await user.type(input, "123");

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

});

