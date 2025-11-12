import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

import { CourtSession } from "./CourtSession";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<Theme>{component}</Theme>);
};

describe("<CourtSession />", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render court session", () => {
    const { container } =     renderWithTheme(
      <CourtSession value="ALL" onChange={mockOnChange} />
    );

    expect(screen.getByText("Tribunal")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should display current value", () => {
    renderWithTheme(<CourtSession value="TJAL" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveTextContent("TJAL");
  });

  it("should render select trigger", () => {
    renderWithTheme(<CourtSession value="ALL" onChange={mockOnChange} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});

