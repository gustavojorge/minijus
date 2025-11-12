import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

import { DataSession } from "./DataSession";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<Theme>{component}</Theme>);
};

describe("<DataSession />", () => {
  const mockOnOperatorChange = jest.fn();
  const mockOnDateChange = jest.fn();

  beforeEach(() => {
    mockOnOperatorChange.mockClear();
    mockOnDateChange.mockClear();
  });

  it("should render data session", () => {
    const { container } = renderWithTheme(
      <DataSession
        operator="="
        date=""
        onOperatorChange={mockOnOperatorChange}
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText("Data de distribuição")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should display current operator value", () => {
    renderWithTheme(
      <DataSession
        operator="<"
        date=""
        onOperatorChange={mockOnOperatorChange}
        onDateChange={mockOnDateChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveTextContent("Antes de");
  });

  it("should display current date value", () => {
    renderWithTheme(
      <DataSession
        operator="="
        date="2023-05-15"
        onOperatorChange={mockOnOperatorChange}
        onDateChange={mockOnDateChange}
      />
    );

    const dateInput = screen.getByDisplayValue("2023-05-15");
    expect(dateInput).toBeInTheDocument();
  });

  it("should call onDateChange when date changes", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DataSession
        operator="="
        date=""
        onOperatorChange={mockOnOperatorChange}
        onDateChange={mockOnDateChange}
      />
    );

    const dateInput = screen.getByPlaceholderText("Selecione a data");
    await user.type(dateInput, "2023-05-15");

    expect(mockOnDateChange).toHaveBeenCalled();
  });

  it("should render operator select", () => {
    renderWithTheme(
      <DataSession
        operator="="
        date=""
        onOperatorChange={mockOnOperatorChange}
        onDateChange={mockOnDateChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});

