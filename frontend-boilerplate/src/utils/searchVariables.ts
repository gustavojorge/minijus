import { stripMarkTags } from "@/utils/highlight";

export function getSearchVariables(
  query: string,
  court?: string
): { query?: string; court?: string; number?: string } {
  const variables: { query?: string; court?: string; number?: string } = {};

  if (query) {
    const cleanQuery = stripMarkTags(query);
    variables.query = cleanQuery;
    variables.number = cleanQuery;
  }

  if (court && court !== "ALL") {
    variables.court = court;
  }

  return variables;
}

