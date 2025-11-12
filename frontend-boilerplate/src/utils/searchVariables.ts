import { stripMarkTags } from "@/utils/highlight";
import type { Filters } from "@/components/common/search-bar/components";

export function getSearchVariables(
  query: string,
  filters?: Filters
): { query?: string; filters?: any } {
  const variables: { query?: string; filters?: any } = {};

  if (query) {
    const cleanQuery = stripMarkTags(query);
    variables.query = cleanQuery;
  }

  // Build filters object
  const filtersObj: any = {};
  let hasFilters = false;

  // Add court filter if provided
  if (filters?.court && filters.court !== "ALL") {
    filtersObj.court = filters.court;
    hasFilters = true;
  }

  // Add date filter if provided
  if (filters?.date) {
    filtersObj.date = {
      date: filters.date.date,
      operator: filters.date.operator,
    };
    hasFilters = true;
  }

  if (hasFilters) {
    variables.filters = filtersObj;
  }

  return variables;
}

