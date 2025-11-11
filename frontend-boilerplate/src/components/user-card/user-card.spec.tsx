import { render, screen } from "@testing-library/react";

import { UserCard } from "./user-card";

describe("<UserCard />", () => {
  const exampleUser = {
    name: "John Doe",
    email: "john.doe@email.com",
    age: 30,
  };

  it("should render user card", () => {
    render(<UserCard user={exampleUser} />);

    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("john.doe@email.com")).toBeInTheDocument();

    expect(screen.getByText("Idade:")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });
});
