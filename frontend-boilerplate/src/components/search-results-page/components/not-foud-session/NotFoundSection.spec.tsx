import { render, screen } from "@testing-library/react";

import { NotFoundSection } from "./NotFoundSection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("<NotFoundSection />", () => {
  it("should render not found message and image", () => {
    const { container } = render(<NotFoundSection />);

    expect(screen.getByText("Processo não encontrado")).toBeInTheDocument();
    expect(screen.getByAltText("Nenhum resultado encontrado")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render image with correct attributes", () => {
    render(<NotFoundSection />);

    const image = screen.getByAltText("Nenhum resultado encontrado");
    expect(image).toHaveAttribute("src", "/not_found.png");
  });
});

