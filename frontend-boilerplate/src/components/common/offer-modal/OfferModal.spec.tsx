import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";

import { OfferModal } from "./OfferModal";
import { REGISTER_LAST_INTERACTION } from "@/graphql/mutations/experiment";
import { NextPlanModalData } from "@/types";

jest.mock("./components", () => ({
  HeaderSession: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="header-session">
      <button onClick={onClose}>Close</button>
    </div>
  ),
  BenefitsListSession: ({ benefits }: { benefits: string[] }) => (
    <ul data-testid="benefits-list">
      {benefits.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  ),
  PriceSession: ({ current, next, period }: any) => (
    <div data-testid="price-session">
      {current} / {next} / {period}
    </div>
  ),
  FooterSession: ({ text }: { text: string }) => (
    <div data-testid="footer-session">{text}</div>
  ),
}));

const mockModalData: NextPlanModalData = {
  header: {
    title: "Test Title",
    subtitle: "Test Subtitle",
  },
  body: {
    benefits: ["Benefit 1", "Benefit 2"],
    price: {
      current: "R$ 29,90",
      next: "R$ 49,90",
      period: "por mês",
    },
    button: {
      label: "Assinar",
    },
  },
  footer: {
    text: "Footer text",
  },
};

const mocks = [
  {
    request: {
      query: REGISTER_LAST_INTERACTION,
      variables: {
        lawsuitNumber: "1234567",
        movementId: "mov1",
      },
    },
    result: {
      data: {
        registerLastInteractionMutation: {
          status: "ok",
          message: "Interaction registered",
        },
      },
    },
  },
];

describe("<OfferModal />", () => {
  it("should not render when modalData is not provided", () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OfferModal
          open={true}
          onOpenChange={jest.fn()}
          modalData={null as any}
          lawsuitNumber="1234567"
          movementId="mov1"
        />
      </MockedProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render modal content when open", async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OfferModal
          open={true}
          onOpenChange={jest.fn()}
          modalData={mockModalData}
          lawsuitNumber="1234567"
          movementId="mov1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("benefits-list")).toBeInTheDocument();
    expect(screen.getByText("Assinar")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should call onOpenChange when subscribe button is clicked", async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OfferModal
          open={true}
          onOpenChange={handleOpenChange}
          modalData={mockModalData}
          lawsuitNumber="1234567"
          movementId="mov1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Assinar")).toBeInTheDocument();
    });

    const subscribeButton = screen.getByText("Assinar");
    await user.click(subscribeButton);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("should call onOpenChange when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OfferModal
          open={true}
          onOpenChange={handleOpenChange}
          modalData={mockModalData}
          lawsuitNumber="1234567"
          movementId="mov1"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Close")).toBeInTheDocument();
    });

    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalled();
    });
  });
});

