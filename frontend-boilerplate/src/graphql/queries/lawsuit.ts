import { gql } from "@apollo/client";

export const SEARCH_LAWSUITS_QUERY = gql`
  query SearchLawsuits($query: String, $filters: FiltersInput) {
    searchLawsuitsQuery(query: $query, filters: $filters) {
      __typename
      id
      number
      parties {
        name
        role
      }
      court
      startDate
      movements {
        id
        date
        description
        lastInteractionDate
      }
      nature
      kind
      subject
      judge
      value
      lawyers {
        name
      }
      status
      taskId
      cnj
      message
    }
  }
`;

