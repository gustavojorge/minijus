import { render, screen } from "@testing-library/react";

import { DetailItem } from "./DetailItem";

describe("<DetailItem />", () => {
  it("should render label and value", () => {
    const { container } = render(<DetailItem label="Tribunal" value="TJAL" />);

    expect(screen.getByText("Tribunal")).toBeInTheDocument();
    expect(screen.getByText("TJAL")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

