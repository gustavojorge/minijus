import { render, screen } from "@testing-library/react";

import { PartyItem } from "./PartyItem";

describe("<PartyItem />", () => {
  it("should render party name and role", () => {
    const { container } = render(<PartyItem name="João Silva" role="Autor" />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Parte envolvida - Autor")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

