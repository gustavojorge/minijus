import { GraphQLNonNull, GraphQLString } from 'graphql';

import { RegisterLastInteractionResponseType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';

/**
 * Transform searcher API response to GraphQL format 
 */
const transformLawsuit = (lawsuit) => {
  // Generate IDs for movements (activities) if not present
  const movements = (lawsuit.activities || []).map((activity, index) => ({
    id: activity.id || `mov${index + 1}`,
    date: activity.date,
    description: activity.description,
    lastInteractionDate: activity.lastInteractionDate || null,
  }));

  return {
    id: lawsuit.id,
    number: lawsuit.number,
    parties: lawsuit.related_people || [],
    court: lawsuit.court,
    startDate: lawsuit.date || lawsuit.startDate,
    movements: movements,
    nature: lawsuit.nature,
    kind: lawsuit.kind,
    subject: lawsuit.subject,
    judge: lawsuit.judge,
    value: lawsuit.value,
    lawyers: lawsuit.lawyers || [],
  };
};

export const registerLastInteractionMutation = {
  type: RegisterLastInteractionResponseType,
  args: {
    lawsuitNumber: { type: new GraphQLNonNull(GraphQLString) },
    movementId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root, { lawsuitNumber, movementId }) => {
    try {
      // Search for the lawsuit by CNJ number using searcher API
      const response = await searcherAPI.searchLawsuits({
        query: lawsuitNumber, 
        filters: {},
        limit: 1,
        offset: 0,
      });

      const lawsuits = (response.lawsuits || []).map(transformLawsuit);
      const lawsuit = lawsuits.find((l) => l.number === lawsuitNumber);

      if (!lawsuit || lawsuits.length === 0) {
        return {
          status: 'error',
          message: `Lawsuit with number ${lawsuitNumber} not found`,
          movement: null,
        };
      }

      // Search for the movement by ID
      const movement = lawsuit.movements.find(
        (mov) => mov.id === movementId
      );

      if (!movement) {
        return {
          status: 'error',
          message: `Movement with ID ${movementId} not found in lawsuit ${lawsuitNumber}`,
          movement: null,
        };
      }

      // Update the last interaction date
      const currentDate = new Date().toISOString().split('T')[0];
      const updatedMovement = {
        ...movement,
        lastInteractionDate: currentDate,
      };

      return {
        status: 'success',
        message: 'Last interaction registered successfully',
        movement: {
          id: updatedMovement.id,
          date: updatedMovement.date,
          description: updatedMovement.description,
          lastInteractionDate: updatedMovement.lastInteractionDate,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error searching for lawsuit: ${error.message}`,
        movement: null,
      };
    }
  },
};

