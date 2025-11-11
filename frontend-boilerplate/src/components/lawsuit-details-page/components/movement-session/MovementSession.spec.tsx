import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MovementSession } from "./MovementSession";
import { Movement } from "@/types";

jest.mock("./components/MovementItem", () => ({
  MovementItem: ({ date, description, isBlocked, onBlockedClick }: any) => (
    <div data-testid="movement-item">
      <span>{date}</span>
      <span>{description}</span>
      {isBlocked && (
        <button onClick={onBlockedClick} data-testid="blocked-button">
          Blocked
        </button>
      )}
    </div>
  ),
}));

const mockMovements: Movement[] = [
  { id: "mov1", date: "2020-01-15", description: "Distribuição" },
  { id: "mov2", date: "2020-02-20", description: "Citação do réu" },
  { id: "mov3", date: "2020-03-10", description: "Resposta do réu" },
];

describe("<MovementSession />", () => {
  it("should render movements list", () => {
    const { container } = render(<MovementSession movements={mockMovements} />);

    expect(screen.getByText("Movimentações")).toBeInTheDocument();
    expect(screen.getAllByTestId("movement-item")).toHaveLength(3);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render empty state when no movements", () => {
    render(<MovementSession movements={[]} />);

    expect(screen.getByText("Nenhuma movimentação encontrada.")).toBeInTheDocument();
    expect(screen.queryByTestId("movement-item")).not.toBeInTheDocument();
  });

  it("should block first movement when shouldBlockLastMovement is true", () => {
    render(
      <MovementSession
        movements={mockMovements}
        shouldBlockLastMovement
        onBlockedMovementClick={jest.fn()}
      />
    );

    const items = screen.getAllByTestId("movement-item");
    const firstItem = items[0];
    expect(firstItem.querySelector('[data-testid="blocked-button"]')).toBeInTheDocument();
  });

  it("should call onBlockedMovementClick when blocked movement is clicked", async () => {
    const user = userEvent.setup();
    const handleBlockedClick = jest.fn();

    render(
      <MovementSession
        movements={mockMovements}
        shouldBlockLastMovement
        onBlockedMovementClick={handleBlockedClick}
      />
    );

    const blockedButton = screen.getByTestId("blocked-button");
    await user.click(blockedButton);

    expect(handleBlockedClick).toHaveBeenCalledWith("mov1");
  });

  it("should not block movements when shouldBlockLastMovement is false", () => {
    render(<MovementSession movements={mockMovements} shouldBlockLastMovement={false} />);

    const items = screen.getAllByTestId("movement-item");
    items.forEach((item) => {
      expect(item.querySelector('[data-testid="blocked-button"]')).not.toBeInTheDocument();
    });
  });
});

