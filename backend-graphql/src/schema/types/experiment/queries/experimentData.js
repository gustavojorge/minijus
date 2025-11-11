import { GraphQLString, GraphQLBoolean } from 'graphql';

import { ExperimentDataType } from '../typeDefs.js';
import mockAPI from '../../../../apis/mockAPI.js';

export const experimentDataQuery = {
  type: ExperimentDataType,
  args: {
    alternative: { type: GraphQLString },
    simulating: { type: GraphQLBoolean },
  },
  resolve: async (root, { alternative, simulating }) => {
    const params = {};
    if (alternative) {
      params.alternative = alternative;
    }
    if (simulating !== undefined) {
      params.simulating = simulating.toString();
    }

    try {
      const { data } = await mockAPI.participate(params);

      // Matching GraphQL schema with the response
      return {
        alternative: {
          name: data.alternative.name,
        },
        client_id: data.client_id,
        experiment: {
          name: data.experiment.name,
        },
        experiment_group: {
          name: data.experiment_group.name,
        },
        participating: data.participating,
        simulating: data.simulating,
        status: data.status,
      };
    } catch (error) {
      throw new Error(`Failed to fetch experiment data: ${error.message}`);
    }
  },
};

