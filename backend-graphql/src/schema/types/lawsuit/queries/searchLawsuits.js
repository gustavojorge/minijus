import { GraphQLList, GraphQLString } from 'graphql';

import { LawsuitType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';
import { transformLawsuit } from '../utils/transformers.js';

export const searchLawsuitsQuery = {
  type: new GraphQLList(LawsuitType),
  args: {
    court: { type: GraphQLString }, 
    query: { type: GraphQLString }, // Generic query (CNJ, phrase, or text) - searcher identifies the type
  },
  resolve: async (root, { court, query: queryParam }) => {
    const searchQuery = queryParam || '';

    // Build filters
    const filters = {};
    if (court) {
      filters.court = court.toUpperCase();
    }

    // If no query and no filters, return empty results
    if (!searchQuery && !filters.court) {
      return [];
    }

    try {
      // Call searcher API with the query (can be empty string if only filters are present)
      // The searcher will identify if it's a CNJ, phrase query, or text search
      const response = await searcherAPI.searchLawsuits({
        query: searchQuery,
        filters,
        limit: 100,
        offset: 0,
      });

      // Transform searcher response to GraphQL format
      const lawsuits = (response.lawsuits || []).map(transformLawsuit);

      return lawsuits;
    } catch (error) {
      throw new Error(`Erro ao buscar processos: ${error.message}`);
    }
  },
};

