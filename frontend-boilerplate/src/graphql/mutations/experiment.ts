import { gql } from "@apollo/client";

export const REGISTER_LAST_INTERACTION = gql`
  mutation RegisterLastInteraction($lawsuitNumber: String!, $movementId: String!) {
    registerLastInteractionMutation(lawsuitNumber: $lawsuitNumber, movementId: $movementId) {
      status
      message
      movement {
        id
        date
        description
        lastInteractionDate
      }
    }
  }
`;

