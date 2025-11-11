import { render, screen } from "@testing-library/react";

import { FeatureItem } from "./FeatureItem";

describe("<FeatureItem />", () => {
  it("should render feature with icon and description", () => {
    const { container } = render(
      <FeatureItem
        icon={<span data-testid="icon">Icon</span>}
        description="Test feature description"
      />
    );

    expect(screen.getByText("Test feature description")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Test feature description")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });
});

