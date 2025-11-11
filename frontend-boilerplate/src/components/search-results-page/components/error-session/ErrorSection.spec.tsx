import { render, screen } from "@testing-library/react";

import { ErrorSection } from "./ErrorSection";

describe("<ErrorSection />", () => {
  it("should render default error message when no message prop is provided", () => {
    const { container } = render(<ErrorSection />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("Erro ao carregar resultados. Por favor, tente novamente.")
    ).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render custom error message when message prop is provided", () => {
    const customMessage = "Erro de formatação:CNJ inválido.";
    const { container } = render(<ErrorSection message={customMessage} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(
      screen.queryByText("Erro ao carregar resultados. Por favor, tente novamente.")
    ).not.toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

