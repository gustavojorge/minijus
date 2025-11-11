import { render, screen } from "@testing-library/react";

import { FooterSession } from "./FooterSession";

describe("<FooterSession />", () => {
  it("should render footer text", () => {
    const { container } = render(<FooterSession text="Footer text test" />);

    expect(screen.getByText("Footer text test")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

