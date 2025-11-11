import { render, screen } from "@testing-library/react";

import { DetailSession } from "./DetailSession";
import { Lawsuit } from "@/types";

jest.mock("./components/DetailItem", () => ({
  DetailItem: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="detail-item">
      {label}: {value}
    </div>
  ),
}));

const mockLawsuit: Lawsuit = {
  id: "1",
  number: "5001682-88.2020.8.13.0672",
  parties: [],
  court: "TJAL",
  startDate: "2020-01-15",
  movements: [
    { id: "mov1", date: "2020-01-15", description: "Distribuição" },
    { id: "mov2", date: "2020-02-20", description: "Citação" },
  ],
};

describe("<DetailSession />", () => {
  it("should render lawsuit details", () => {
    const { container } = render(<DetailSession lawsuit={mockLawsuit} />);

    expect(screen.getByText("Detalhes do processo")).toBeInTheDocument();
    expect(screen.getAllByTestId("detail-item")).toHaveLength(3);
    expect(screen.getByText(/Tribunal:/)).toBeInTheDocument();
    expect(screen.getByText(/Data de início:/)).toBeInTheDocument();
    expect(screen.getByText(/Movimentações:/)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should format start date correctly", () => {
    render(<DetailSession lawsuit={mockLawsuit} />);

    const dateItem = screen.getByText(/Data de início:/);
    expect(dateItem.textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("should display correct movements count", () => {
    render(<DetailSession lawsuit={mockLawsuit} />);

    const movementsItem = screen.getByText(/Movimentações:/);
    expect(movementsItem.textContent).toContain("2");
  });
});

