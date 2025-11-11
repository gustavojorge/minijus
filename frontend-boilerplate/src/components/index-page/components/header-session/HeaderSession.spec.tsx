import { render, screen } from "@testing-library/react";

import { HeaderSession } from "./HeaderSession";

describe("<HeaderSession />", () => {
  it("should render title and description", () => {
    const { container } = render(<HeaderSession />);

    expect(screen.getByText("Consulta processual")).toBeInTheDocument();
    expect(screen.getByText("Consultar processos por CNJ e tribunal")).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

});

