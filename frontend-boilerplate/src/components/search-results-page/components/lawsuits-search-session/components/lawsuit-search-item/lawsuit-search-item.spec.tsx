import { render, screen } from "@testing-library/react";

import { LawsuitSearchItem } from "./lawsuit-search-item";
import { Lawsuit } from "@/types";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

const mockLawsuit: Lawsuit = {
  id: "1",
  number: "5001682-88.2020.8.13.0672",
  parties: [
    { name: "João Silva", role: "Autor" },
    { name: "Maria Santos", role: "Réu" },
  ],
  court: "TJAL",
  startDate: "2020-01-15",
  movements: [
    { id: "mov1", date: "2020-01-15", description: "Distribuição" },
    { id: "mov2", date: "2020-02-20", description: "Citação do réu" },
  ],
};

describe("<LawsuitSearchItem />", () => {
  it("should render lawsuit information", () => {
    const { container } = render(<LawsuitSearchItem lawsuit={mockLawsuit} />);

    expect(screen.getByText(mockLawsuit.number)).toBeInTheDocument();
    expect(screen.getByText(mockLawsuit.court)).toBeInTheDocument();
    expect(screen.getByText("João Silva (Autor) x Maria Santos (Réu)")).toBeInTheDocument();
    expect(screen.getByText(/Início:/)).toBeInTheDocument();
    const movementsText = screen.getByText(/movimentação/);
    expect(movementsText.textContent).toMatch(/2\s*movimentação(ões)?/);
    expect(screen.getByText("Ver Detalhes")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render correct link to lawsuit details", () => {
    render(<LawsuitSearchItem lawsuit={mockLawsuit} />);

    const link = screen.getByLabelText(`Ver detalhes do processo ${mockLawsuit.number}`);
    expect(link).toHaveAttribute("href", `/lawsuit/${encodeURIComponent(mockLawsuit.number)}`);
  });

  it("should format date correctly", () => {
    render(<LawsuitSearchItem lawsuit={mockLawsuit} />);

    const dateText = screen.getByText(/Início:/);
    expect(dateText.textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

});

