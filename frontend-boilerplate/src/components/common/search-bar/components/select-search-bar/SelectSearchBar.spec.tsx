import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SelectSearchBar } from "./SelectSearchBar";

describe("<SelectSearchBar />", () => {
  it("should render select with all options", () => {
    const { container } = render(
      <SelectSearchBar value="ALL" onChange={jest.fn()} />
    );

    const select = screen.getByLabelText("Filtrar por tribunal");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Tribunal")).toBeInTheDocument();
    expect(screen.getByText("TJAL")).toBeInTheDocument();
    expect(screen.getByText("TJCE")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should display selected value", () => {
    render(<SelectSearchBar value="TJAL" onChange={jest.fn()} />);

    const select = screen.getByLabelText("Filtrar por tribunal") as HTMLSelectElement;
    expect(select.value).toBe("TJAL");
  });

  it("should call onChange when user selects option", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<SelectSearchBar value="ALL" onChange={handleChange} />);

    const select = screen.getByLabelText("Filtrar por tribunal");
    await user.selectOptions(select, "TJCE");

    expect(handleChange).toHaveBeenCalledWith("TJCE");
  });

});

