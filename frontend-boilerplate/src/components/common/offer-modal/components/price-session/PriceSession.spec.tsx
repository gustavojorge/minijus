import { render, screen } from "@testing-library/react";

import { PriceSession } from "./PriceSession";

describe("<PriceSession />", () => {
  it("should render price information", () => {
    const { container } = render(
      <PriceSession current="R$ 29,90" next="R$ 49,90" period="por mês" />
    );

    expect(screen.getByText(/de/)).toBeInTheDocument();
    expect(screen.getByText("R$ 49,90")).toBeInTheDocument();
    expect(screen.getByText("R$ 29,90")).toBeInTheDocument();
    expect(screen.getByText("por mês")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

