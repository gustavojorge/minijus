import { render, screen } from "@testing-library/react";

import { ButtonSearchBar } from "./ButtonSearchBar";

describe("<ButtonSearchBar />", () => {
  it("should render search button", () => {
    const { container } = render(<ButtonSearchBar />);

    const button = screen.getByLabelText("Executar busca");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<ButtonSearchBar disabled />);

    const button = screen.getByLabelText("Executar busca");
    expect(button).toBeDisabled();
  });

});

