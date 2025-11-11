import { render, screen } from "@testing-library/react";

import { PartySession } from "./PartySession";
import { Party } from "@/types";

jest.mock("./components/PartyItem", () => ({
  PartyItem: ({ name, role }: { name: string; role: string }) => (
    <div data-testid="party-item">
      {name} - {role}
    </div>
  ),
}));

const mockParties: Party[] = [
  { name: "João Silva", role: "Autor" },
  { name: "Maria Santos", role: "Réu" },
];

describe("<PartySession />", () => {
  it("should render parties list", () => {
    const { container } = render(<PartySession parties={mockParties} />);

    expect(screen.getByText("Partes envolvidas")).toBeInTheDocument();
    expect(screen.getAllByTestId("party-item")).toHaveLength(2);
    expect(screen.getByText("João Silva - Autor")).toBeInTheDocument();
    expect(screen.getByText("Maria Santos - Réu")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render empty state when no parties", () => {
    render(<PartySession parties={[]} />);

    expect(screen.getByText("Nenhuma parte encontrada.")).toBeInTheDocument();
    expect(screen.queryByTestId("party-item")).not.toBeInTheDocument();
  });
});

