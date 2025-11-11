import { render, screen } from "@testing-library/react";

import { HelloWorld } from "./hello-world";

describe("<HelloWorld />", () => {
  it("should render with custom name", () => {
    render(<HelloWorld name="Joao" />);

    expect(screen.getByText("Hello, Joao!")).toBeInTheDocument();
  });

  it("should render with default name", () => {
    render(<HelloWorld />);

    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
