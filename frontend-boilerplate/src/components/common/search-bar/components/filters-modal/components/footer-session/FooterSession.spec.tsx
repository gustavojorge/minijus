import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

import { FooterSession } from "./FooterSession";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<Theme>{component}</Theme>);
};

describe("<FooterSession />", () => {
  const mockOnClear = jest.fn();
  const mockOnApply = jest.fn();

  beforeEach(() => {
    mockOnClear.mockClear();
    mockOnApply.mockClear();
  });

  it("should render footer session", () => {
    const { container } = render(
      <FooterSession
        hasActiveFilters={false}
        onClear={mockOnClear}
        onApply={mockOnApply}
      />
    );

    expect(screen.getByText("Limpar")).toBeInTheDocument();
    expect(screen.getByText("Aplicar filtros")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onApply when apply button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FooterSession
        hasActiveFilters={false}
        onClear={mockOnClear}
        onApply={mockOnApply}
      />
    );

    const applyButton = screen.getByText("Aplicar filtros");
    await user.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it("should call onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <FooterSession
        hasActiveFilters={true}
        onClear={mockOnClear}
        onApply={mockOnApply}
      />
    );

    const clearButton = screen.getByText("Limpar");
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

});

