import { render, screen } from "@testing-library/react";

import { FeaturesSection } from "./FeaturesSection";

jest.mock("./components/feature-item", () => ({
  FeatureItem: ({ description }: { description: string }) => (
    <div data-testid="feature-item">{description}</div>
  ),
}));

describe("<FeaturesSection />", () => {
  it("should render all features", () => {
    const { container } = render(<FeaturesSection />);

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getAllByTestId("feature-item")).toHaveLength(3);
    expect(screen.getByText("Encontre processos pelo CNJ")).toBeInTheDocument();
    expect(
      screen.getByText("Acesse as movimentações e outras informações do processo")
    ).toBeInTheDocument();
    expect(screen.getByText("Filtre por tribunal (TJAL ou TJCE)")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

