import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import IndexPage from "./index";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../components", () => ({
  Header: () => <div data-testid="header">Header</div>,
  SearchBar: ({ onSearch }: any) => (
    <div data-testid="search-bar">
      <button onClick={() => onSearch("1234567", { court: "TJAL" })}>Search</button>
    </div>
  ),
  FeaturesSection: () => <div data-testid="features-section">Features</div>,
  HeaderSession: () => <div data-testid="header-session">Header Session</div>,
}));

const mockPush = jest.fn();

describe("Index Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: {},
    });
    mockPush.mockClear();
  });

  it("should render page with all sections", async () => {
    const { container } = render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    expect(screen.getByTestId("header-session")).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("features-section")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should navigate to search results when search is performed", async () => {
    const user = userEvent.setup();
    render(<IndexPage />);

    await waitFor(() => {
      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    });

    const searchButton = screen.getByText("Search");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/search-results",
        query: { q: "1234567", court: "TJAL" },
      });
    });
  });
});

