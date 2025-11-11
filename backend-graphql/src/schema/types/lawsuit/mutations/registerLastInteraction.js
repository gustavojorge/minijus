import { GraphQLNonNull, GraphQLString } from 'graphql';

import { RegisterLastInteractionResponseType } from '../typeDefs.js';
import lawsuitsMock from '../lawsuitsMock.js';

export const registerLastInteractionMutation = {
  type: RegisterLastInteractionResponseType,
  args: {
    lawsuitNumber: { type: new GraphQLNonNull(GraphQLString) },
    movementId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root, { lawsuitNumber, movementId }) => {
    const lawsuit = lawsuitsMock.find(
      (lawsuit) => lawsuit.number === lawsuitNumber
    );

    if (!lawsuit) {
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
    movement.lastInteractionDate = currentDate;

    return {
      status: 'success',
      message: 'Last interaction registered successfully',
      movement: {
        id: movement.id,
        date: movement.date,
        description: movement.description,
        lastInteractionDate: movement.lastInteractionDate,
      },
    };
  },
};

