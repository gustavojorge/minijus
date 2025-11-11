import { render, screen } from "@testing-library/react";

import { Header } from "./header";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, ...props }: any) => {
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe("<Header />", () => {
  it("should render header with logo and navigation", () => {
    const { container } = render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByLabelText("Jusbrasil - Página inicial")).toBeInTheDocument();
    expect(screen.getByLabelText("Navegação principal")).toBeInTheDocument();
    expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should have correct links", () => {
    render(<Header />);

    const logoLink = screen.getByLabelText("Jusbrasil - Página inicial");
    expect(logoLink).toHaveAttribute("href", "/");

    const cadastreLink = screen.getByText("Cadastre-se").closest("a");
    expect(cadastreLink).toHaveAttribute("href", "/");

    const entrarLink = screen.getByText("Entrar").closest("a");
    expect(entrarLink).toHaveAttribute("href", "/");
  });

  it("should render logo images", () => {
    render(<Header />);

    const logoFull = screen.getByAltText("Jusbrasil Logo");
    const logoIcon = screen.getByAltText("Jusbrasil");

    expect(logoFull).toBeInTheDocument();
    expect(logoIcon).toBeInTheDocument();
    expect(logoFull).toHaveAttribute("src", "/jus_logo.png");
    expect(logoIcon).toHaveAttribute("src", "/jus_icon.png");
  });
});

