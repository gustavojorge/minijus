import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import { BackButton } from "./BackButton";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

describe("<BackButton />", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it("should render with default label", () => {
    const { container } = render(<BackButton />);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should navigate to default href when clicked", async () => {
    const user = userEvent.setup();
    render(<BackButton />);

    const button = screen.getByText("Voltar");
    await user.click(button);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

});

