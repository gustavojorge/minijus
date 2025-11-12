import { GraphQLList, GraphQLString } from 'graphql';

import { LawsuitType, FiltersInputType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';
import { transformLawsuit } from '../utils/transformers.js';

export const searchLawsuitsQuery = {
  type: new GraphQLList(LawsuitType),
  args: {
    query: { type: GraphQLString }, // Generic query (CNJ, phrase, or text) - searcher identifies the type
    filters: { type: FiltersInputType }, // Filters (court and/or date)
  },
  resolve: async (root, { query: queryParam, filters: filtersParam }) => {
    const searchQuery = queryParam || '';

    // Build filters object
    const filters = {};
    
    // Add court filter if provided
    if (filtersParam?.court) {
      filters.court = filtersParam.court.toUpperCase();
    }

    // Add date filter if provided
    if (filtersParam?.date) {
      filters.date = {
        date: filtersParam.date.date,
        operator: filtersParam.date.operator,
      };
    }

    // If no query and no filters, return empty results
    const hasFilters = filters.court || filters.date;
    if (!searchQuery && !hasFilters) {
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

