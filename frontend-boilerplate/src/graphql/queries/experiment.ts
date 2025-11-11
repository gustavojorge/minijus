import { gql } from "@apollo/client";

export const GET_EXPERIMENT_DATA = gql`
  query GetExperimentData($alternative: String, $simulating: Boolean) {
    experimentDataQuery(alternative: $alternative, simulating: $simulating) {
      alternative {
        name
      }
      client_id
      experiment {
        name
      }
      experiment_group {
        name
      }
      participating
      simulating
      status
    }
  }
`;

export const GET_NEXT_PLAN_MODAL = gql`
  query GetNextPlanModal {
    nextPlanModalQuery {
      header {
        title
        subtitle
      }
      body {
        benefits
        price {
          current
          next
          period
        }
        button {
          label
        }
      }
      footer {
        text
      }
    }
  }
`;

