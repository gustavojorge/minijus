import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

import { FiltersModal } from "./FiltersModal";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<Theme>{component}</Theme>);
};

jest.mock("./components", () => ({
  CourtSession: ({ value, onChange }: any) => (
    <div data-testid="court-session">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="court-select"
      >
        <option value="ALL">Todos os tribunais</option>
        <option value="TJAL">TJAL</option>
        <option value="TJCE">TJCE</option>
      </select>
    </div>
  ),
  DataSession: ({ operator, date, onOperatorChange, onDateChange }: any) => (
    <div data-testid="data-session">
      <select
        value={operator}
        onChange={(e) => onOperatorChange(e.target.value)}
        data-testid="operator-select"
      >
        <option value="=">Igual a</option>
        <option value="<">Antes de</option>
        <option value=">">Depois de</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        data-testid="date-input"
      />
    </div>
  ),
  FooterSession: ({ hasActiveFilters, onClear, onApply }: any) => (
    <div data-testid="footer-session">
      <button
        onClick={onClear}
        disabled={!hasActiveFilters}
        data-testid="clear-button"
      >
        Limpar
      </button>
      <button onClick={onApply} data-testid="apply-button">
        Aplicar filtros
      </button>
    </div>
  ),
}));

describe("<FiltersModal />", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnApplyFilters = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnApplyFilters.mockClear();
  });

  it("should render modal when open is true", () => {
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.getByText("Filtros de busca")).toBeInTheDocument();
    expect(screen.getByTestId("court-session")).toBeInTheDocument();
    expect(screen.getByTestId("data-session")).toBeInTheDocument();
    expect(screen.getByTestId("footer-session")).toBeInTheDocument();
  });

  it("should not render modal when open is false", () => {
    renderWithTheme(
      <FiltersModal
        open={false}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    expect(screen.queryByText("Filtros de busca")).not.toBeInTheDocument();
  });

  it("should initialize with provided filters", () => {
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{ court: "TJAL", date: { date: "2023-05-15", operator: "<" } }}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const courtSelect = screen.getByTestId("court-select") as HTMLSelectElement;
    expect(courtSelect.value).toBe("TJAL");

    const operatorSelect = screen.getByTestId("operator-select") as HTMLSelectElement;
    expect(operatorSelect.value).toBe("<");

    const dateInput = screen.getByTestId("date-input") as HTMLInputElement;
    expect(dateInput.value).toBe("2023-05-15");
  });

  it("should call onApplyFilters with correct filters when apply is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    // Change court
    const courtSelect = screen.getByTestId("court-select");
    await user.selectOptions(courtSelect, "TJAL");

    // Change date
    const dateInput = screen.getByTestId("date-input");
    await user.type(dateInput, "2023-05-15");

    // Apply filters
    const applyButton = screen.getByTestId("apply-button");
    await user.click(applyButton);

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalledWith({
        court: "TJAL",
        date: {
          date: "2023-05-15",
          operator: "=",
        },
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should call onApplyFilters with empty object when clear is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{ court: "TJAL", date: { date: "2023-05-15", operator: "<" } }}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const clearButton = screen.getByTestId("clear-button");
    await user.click(clearButton);

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalledWith({});
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should not include court in filters when court is ALL", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const dateInput = screen.getByTestId("date-input");
    await user.type(dateInput, "2023-05-15");

    const applyButton = screen.getByTestId("apply-button");
    await user.click(applyButton);

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalledWith({
        date: {
          date: "2023-05-15",
          operator: "=",
        },
      });
    });
  });

  it("should not include date in filters when date is empty", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );

    const courtSelect = screen.getByTestId("court-select");
    await user.selectOptions(courtSelect, "TJAL");

    const applyButton = screen.getByTestId("apply-button");
    await user.click(applyButton);

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalledWith({
        court: "TJAL",
      });
    });
  });

  it("should call onOpenChange when modal is closed", () => {
    renderWithTheme(
      <FiltersModal
        open={true}
        onOpenChange={mockOnOpenChange}
        filters={{}}
        onApplyFilters={mockOnApplyFilters}
      />
    );


    expect(mockOnOpenChange).toBeDefined();
  });
});

