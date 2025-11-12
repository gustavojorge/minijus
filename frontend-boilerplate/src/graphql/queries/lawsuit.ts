import { gql } from "@apollo/client";

export const SEARCH_LAWSUITS_QUERY = gql`
  query SearchLawsuits($court: String, $query: String) {
    searchLawsuitsQuery(court: $court, query: $query) {
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
    }
  }
`;

