import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

import { FiltersButton } from "./FiltersButton";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<Theme>{component}</Theme>);
};

describe("<FiltersButton />", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("should render filters button", () => {
    const { container } = renderWithTheme(
      <FiltersButton onClick={mockOnClick} />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByLabelText("Abrir filtros de busca")).toBeInTheDocument();
    expect(screen.getByText("Filtros")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FiltersButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    renderWithTheme(<FiltersButton onClick={mockOnClick} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

});

