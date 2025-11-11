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
  SelectSearchBar: ({ value, onChange, disabled }: any) => (
    <select
      data-testid="select-search-bar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Filtrar por tribunal"
    >
      <option value="ALL">Tribunal</option>
      <option value="TJAL">TJAL</option>
      <option value="TJCE">TJCE</option>
    </select>
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
    expect(screen.getByTestId("select-search-bar")).toBeInTheDocument();

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
      expect(mockOnSearch).toHaveBeenCalledWith("1234567-89.2021.8.06.0001", "ALL");
    });
  });

  it("should call onSearch with court filter when only court is selected", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const select = screen.getByTestId("select-search-bar");
    const button = screen.getByTestId("button-search-bar");

    await user.selectOptions(select, "TJAL");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("", "TJAL");
    });
  });

  it("should call onSearch with both CNJ and court when both are provided", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByTestId("input-search-bar");
    const select = screen.getByTestId("select-search-bar");
    const button = screen.getByTestId("button-search-bar");

    await user.type(input, "1234567-89.2021.8.06.0001");
    await user.selectOptions(select, "TJCE");
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("1234567-89.2021.8.06.0001", "TJCE");
    });
  });

  it("should not call onSearch when form is empty and court is ALL", async () => {
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

  it("should disable button when form is empty and court is ALL", () => {
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

