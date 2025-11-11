export function getSearchVariables(
  cnj: string,
  court?: string
): { number?: string; court?: string } {
  const variables: { number?: string; court?: string } = {};

  if (cnj) {
    variables.number = cnj;
  }

  if (court && court !== "ALL") {
    variables.court = court;
  }

  return variables;
}

