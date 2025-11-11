import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MovementItem } from "./MovementItem";

describe("<MovementItem />", () => {
  const mockMovement = {
    date: "2020-01-15",
    description: "Distribuição do processo",
  };

  it("should render movement with date and description", () => {
    const { container } = render(
      <MovementItem date={mockMovement.date} description={mockMovement.description} />
    );

    expect(screen.getByText(mockMovement.description)).toBeInTheDocument();
    expect(screen.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render blocked content when isBlocked is true", () => {
    const { container } = render(
      <MovementItem
        date={mockMovement.date}
        description={mockMovement.description}
        isBlocked
      />
    );

    expect(
      screen.getByText("Para ver informações mais atualizadas deste processo, assine agora.")
    ).toBeInTheDocument();
    expect(screen.getByText("Clique para ver oferta")).toBeInTheDocument();
    expect(screen.queryByText(mockMovement.description)).not.toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onBlockedClick when blocked item is clicked", async () => {
    const user = userEvent.setup();
    const handleBlockedClick = jest.fn();

    render(
      <MovementItem
        date={mockMovement.date}
        description={mockMovement.description}
        isBlocked
        onBlockedClick={handleBlockedClick}
      />
    );

    const blockedItem = screen.getByText("Clique para ver oferta").closest("div");
    if (blockedItem) {
      await user.click(blockedItem);
    }

    expect(handleBlockedClick).toHaveBeenCalledTimes(1);
  });

  it("should format date correctly", () => {
    render(
      <MovementItem date="2020-12-25" description="Test description" />
    );

    expect(screen.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
  });
});

