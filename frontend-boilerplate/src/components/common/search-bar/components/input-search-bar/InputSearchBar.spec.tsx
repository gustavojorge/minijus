import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputSearchBar } from "./InputSearchBar";

describe("<InputSearchBar />", () => {
  it("should call onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputSearchBar value="" onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    await user.type(input, "test");
    expect(handleChange).toHaveBeenCalledTimes(4);
    expect(handleChange).toHaveBeenLastCalledWith("t");
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<InputSearchBar value="" onChange={jest.fn()} disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toMatchSnapshot();
  });
});

