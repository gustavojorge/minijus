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
      }
    }
  }
`;

export const SEARCH_LAWSUITS_QUERY = gql`
  query SearchLawsuits($court: String, $number: String) {
    searchLawsuitsQuery(court: $court, number: $number) {
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
      }
    }
  }
`;

