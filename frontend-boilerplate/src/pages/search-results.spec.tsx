import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";

import SearchResultsPage from "./search-results";
import { SEARCH_LAWSUITS_QUERY } from "@/graphql/queries/lawsuit";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../components", () => ({
  Header: () => <div data-testid="header">Header</div>,
  BackButton: () => <button data-testid="back-button">Voltar</button>,
  ErrorSection: ({ message }: any) => (
    <div data-testid="error-section">{message || "Erro ao carregar resultados. Por favor, tente novamente."}</div>
  ),
  NotFoundSection: () => <div data-testid="not-found-section">Not Found</div>,
  LawsuitsSearchSession: ({ lawsuits }: any) => (
    <div data-testid="lawsuits-session">
      {lawsuits.map((l: any) => (
        <div key={l.id}>{l.number}</div>
      ))}
    </div>
  ),
}));

const mockLawsuits = [
  {
    id: "1",
    number: "5001682-88.2020.8.13.0672",
    parties: [{ name: "João Silva", role: "Autor" }],
    court: "TJAL",
    startDate: "2020-01-15",
    movements: [],
  },
];

const mocks = [
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: { query: "1234567" },
    },
    result: {
      data: {
        searchLawsuitsQuery: mockLawsuits,
      },
    },
  },
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: { query: "", filters: { court: "TJAL" } },
    },
    result: {
      data: {
        searchLawsuitsQuery: mockLawsuits,
      },
    },
  },
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: {},
    },
    result: {
      data: {
        searchLawsuitsQuery: [],
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: { query: "1234567" },
    },
    error: new Error("Network error"),
  },
];

describe("SearchResults Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
    });
  });

  it("should render loading state initially", () => {
    render(
      <MockedProvider mocks={mocks}>
        <SearchResultsPage />
      </MockedProvider>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("should render search results when data is loaded", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { q: "1234567" },
    });

    const { container } = render(
      <MockedProvider mocks={mocks}>
        <SearchResultsPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("lawsuits-session")).toBeInTheDocument();
    });

    expect(screen.getByText("5001682-88.2020.8.13.0672")).toBeInTheDocument();
    expect(screen.queryByTestId("error-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("not-found-section")).not.toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render error section when query fails", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { q: "1234567" },
    });

    render(
      <MockedProvider mocks={errorMocks}>
        <SearchResultsPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-section")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("lawsuits-session")).not.toBeInTheDocument();
  });

  it("should render not found section when no results", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { q: "1234567" },
    });

    const emptyMocks = [
      {
        request: {
          query: SEARCH_LAWSUITS_QUERY,
          variables: { query: "1234567" },
        },
        result: {
          data: {
            searchLawsuitsQuery: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks}>
        <SearchResultsPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("not-found-section")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("lawsuits-session")).not.toBeInTheDocument();
  });

});

