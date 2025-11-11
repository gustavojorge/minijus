import { render, screen } from "@testing-library/react";

import { LawsuitHeader } from "./LawsuitHeader";

describe("<LawsuitHeader />", () => {
  it("should render lawsuit header with number, court and date", () => {
    const { container } = render(
      <LawsuitHeader
        number="5001682-88.2020.8.13.0672"
        court="TJAL"
        startDate="2020-01-15"
      />
    );

    expect(screen.getByText("Processo n. 5001682-88.2020.8.13.0672 do TJAL")).toBeInTheDocument();
    expect(screen.getByText(/Distribuído em/)).toBeInTheDocument();
    expect(screen.getByText(/Distribuído em \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should format date correctly", () => {
    render(
      <LawsuitHeader
        number="1234567-89.2021.8.06.0001"
        court="TJCE"
        startDate="2021-12-25"
      />
    );

    expect(screen.getByText(/Distribuído em \d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
  });
});

