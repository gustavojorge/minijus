import { render, screen } from "@testing-library/react";

import { LawsuitsSearchSession } from "./lawsuits-search-session";
import { Lawsuit } from "@/types";

jest.mock("./components", () => ({
  LawsuitSearchItem: ({ lawsuit }: { lawsuit: Lawsuit }) => (
    <div data-testid={`lawsuit-item-${lawsuit.id}`}>{lawsuit.number}</div>
  ),
}));

const mockLawsuits: Lawsuit[] = [
  {
    id: "1",
    number: "5001682-88.2020.8.13.0672",
    parties: [{ name: "João Silva", role: "Autor" }],
    court: "TJAL",
    startDate: "2020-01-15",
    movements: [],
  },
  {
    id: "2",
    number: "1234567-89.2021.8.06.0001",
    parties: [{ name: "Maria Santos", role: "Réu" }],
    court: "TJCE",
    startDate: "2021-03-20",
    movements: [],
  },
];

describe("<LawsuitsSearchSession />", () => {
  it("should render lawsuits list", () => {
    const { container } = render(<LawsuitsSearchSession lawsuits={mockLawsuits} />);

    expect(screen.getByRole("region", { name: "Resultados da busca" })).toBeInTheDocument();
    expect(screen.getByText("2 processos encontrados")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByTestId("lawsuit-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("lawsuit-item-2")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should handle empty list", () => {
    render(<LawsuitsSearchSession lawsuits={[]} />);

    expect(screen.getByText("0 processos encontrados")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});

