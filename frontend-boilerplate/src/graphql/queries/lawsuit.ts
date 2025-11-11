import { gql } from "@apollo/client";

export const GET_LAWSUIT_BY_NUMBER_QUERY = gql`
  query GetLawsuitByNumber($number: String!) {
    searchLawsuitsQuery(number: $number) {
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
      date
      judge
      value
      lawyers {
        name
      }
    }
  }
`;

export const SEARCH_LAWSUITS_QUERY = gql`
  query SearchLawsuits($court: String, $query: String, $number: String) {
    searchLawsuitsQuery(court: $court, query: $query, number: $number) {
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
      date
      judge
      value
      lawyers {
        name
      }
    }
  }
`;

