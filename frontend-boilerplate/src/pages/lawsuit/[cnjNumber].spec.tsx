import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";

import LawsuitDetailPage from "./[cnjNumber]";
import { SEARCH_LAWSUITS_QUERY } from "@/graphql/queries/lawsuit";
import { GET_EXPERIMENT_DATA } from "@/graphql/queries/experiment";
import { GET_NEXT_PLAN_MODAL } from "@/graphql/queries/experiment";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../hooks/useExperiment", () => ({
  useExperiment: () => ({
    shouldBlockLastMovement: false,
    loading: false,
  }),
}));

jest.mock("../../hooks/useNextPlanModal", () => ({
  useNextPlanModal: () => ({
    modalData: null,
    loading: false,
  }),
}));

jest.mock("../../components", () => ({
  Header: () => <div data-testid="header">Header</div>,
  SearchBar: ({ onSearch }: any) => (
    <div data-testid="search-bar">
      <button onClick={() => onSearch("1234567", { court: "TJAL" })}>Search</button>
    </div>
  ),
  MovementSession: ({ movements, shouldBlockLastMovement, onBlockedMovementClick }: any) => (
    <div data-testid="movement-session">
      {movements.map((m: any) => (
        <div key={m.id}>
          {m.description}
          {shouldBlockLastMovement && (
            <button onClick={() => onBlockedMovementClick?.(m.id)}>Blocked</button>
          )}
        </div>
      ))}
    </div>
  ),
  PartySession: ({ parties }: any) => (
    <div data-testid="party-session">
      {parties.map((p: any, i: number) => (
        <div key={i}>{p.name}</div>
      ))}
    </div>
  ),
  DetailSession: ({ lawsuit }: any) => (
    <div data-testid="detail-session">{lawsuit.court}</div>
  ),
  LawsuitHeader: ({ number, court }: any) => (
    <div data-testid="lawsuit-header">
      {number} - {court}
    </div>
  ),
  OfferModal: () => <div data-testid="offer-modal">Modal</div>,
}));

const mockLawsuit = {
  id: "1",
  number: "5001682-88.2020.8.13.0672",
  parties: [
    { name: "João Silva", role: "Autor" },
    { name: "Maria Santos", role: "Réu" },
  ],
  court: "TJAL",
  startDate: "2020-01-15",
  movements: [
    { id: "mov1", date: "2020-01-15", description: "Distribuição" },
    { id: "mov2", date: "2020-02-20", description: "Citação" },
  ],
};

const mocks = [
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: { query: "5001682-88.2020.8.13.0672" },
    },
    result: {
      data: {
        searchLawsuitsQuery: [mockLawsuit],
      },
    },
  },
  {
    request: {
      query: GET_EXPERIMENT_DATA,
      variables: { alternative: undefined, simulating: undefined },
    },
    result: {
      data: {
        experimentDataQuery: {
          alternative: { name: "control" },
          client_id: "123",
          experiment: { name: "litigants-experiment" },
          experiment_group: { name: "justarter" },
          participating: false,
          simulating: false,
          status: "ok",
        },
      },
    },
  },
  {
    request: {
      query: GET_NEXT_PLAN_MODAL,
    },
    result: {
      data: {
        nextPlanModalQuery: null,
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: SEARCH_LAWSUITS_QUERY,
      variables: { query: "5001682-88.2020.8.13.0672" },
    },
    error: new Error("Network error"),
  },
];

describe("LawsuitDetail Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { cnjNumber: "5001682-88.2020.8.13.0672" },
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it("should render loading state", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LawsuitDetailPage />
      </MockedProvider>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("should render lawsuit details when data is loaded", async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LawsuitDetailPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("lawsuit-header")).toBeInTheDocument();
    });

    expect(screen.getByTestId("movement-session")).toBeInTheDocument();
    expect(screen.getByTestId("party-session")).toBeInTheDocument();
    expect(screen.getByTestId("detail-session")).toBeInTheDocument();
    expect(screen.getByText("Distribuição")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render error state when query fails", async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <LawsuitDetailPage />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Processo não encontrado")).toBeInTheDocument();
    });

    expect(screen.getByText("O processo solicitado não foi encontrado.")).toBeInTheDocument();
  });

  it("should navigate to search results when search is performed", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LawsuitDetailPage />
      </MockedProvider>
    );

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

