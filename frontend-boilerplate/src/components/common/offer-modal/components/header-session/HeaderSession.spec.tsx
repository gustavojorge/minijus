import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HeaderSession } from "./HeaderSession";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, ...props }: any) => {
    return <img {...props} />;
  },
}));

describe("<HeaderSession />", () => {
  it("should render header with close button and logo", () => {
    const { container } = render(<HeaderSession onClose={jest.fn()} />);

    expect(screen.getByLabelText("Fechar modal")).toBeInTheDocument();
    expect(screen.getByAltText("Jusbrasil")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(<HeaderSession onClose={handleClose} />);

    const closeButton = screen.getByLabelText("Fechar modal");
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

