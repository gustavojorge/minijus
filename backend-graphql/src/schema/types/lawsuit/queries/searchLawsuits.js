import { GraphQLList, GraphQLString } from 'graphql';

import { LawsuitType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';
import { transformLawsuit } from '../utils/transformers.js';
import { isValidCNJ } from '../utils/validations.js';

export const searchLawsuitsQuery = {
  type: new GraphQLList(LawsuitType),
  args: {
    court: { type: GraphQLString }, 
    number: { type: GraphQLString },
    query: { type: GraphQLString }, // Generic query (CNJ, phrase, or text)
  },
  resolve: async (root, { court, number, query: queryParam }) => {
    let searchQuery = queryParam || number || '';

    // Build filters
    const filters = {};
    if (court) {
      filters.court = court.toUpperCase();
    }

    // If no query and no filters, return empty results
    if (!searchQuery && !filters.court) {
      return [];
    }

    // If using 'number' parameter, validate CNJ format
    if (number && !queryParam) {
      if (!isValidCNJ(number)) {
        throw new Error('Erro de formatação: CNJ inválido.');
      }
    }

    try {
      // Call searcher API with the query (can be empty string if only filters are present)
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

