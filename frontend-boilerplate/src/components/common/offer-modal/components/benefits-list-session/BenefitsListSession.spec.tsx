import { render, screen } from "@testing-library/react";

import { BenefitsListSession } from "./BenefitsListSession";

describe("<BenefitsListSession />", () => {
  const mockBenefits = [
    "Benefício 1",
    "Benefício 2",
    "Benefício 3",
  ];

  it("should render benefits list", () => {
    const { container } = render(<BenefitsListSession benefits={mockBenefits} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Benefício 1")).toBeInTheDocument();
    expect(screen.getByText("Benefício 2")).toBeInTheDocument();
    expect(screen.getByText("Benefício 3")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

