import { GraphQLList, GraphQLString } from 'graphql';

import { LawsuitType, FiltersInputType, SearchResultType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';
import dataCollectionAPI from '../../../../apis/dataCollectionAPI.js';
import { transformLawsuit } from '../utils/transformers.js';
import { isValidCNJ } from '../utils/validations.js';

export const searchLawsuitsQuery = {
  type: new GraphQLList(SearchResultType),
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

      // If no results found and query is a CNJ, request collection
      if (lawsuits.length === 0 && isValidCNJ(searchQuery)) {
        try {
          const collectionResponse = await dataCollectionAPI.requestCollection(searchQuery);
          
          // If collection is queued, return queued response
          if (collectionResponse.status === 'queued') {
            return [{
              __typename: 'CollectionQueued',
              status: collectionResponse.status,
              taskId: collectionResponse.task_id,
              cnj: collectionResponse.cnj,
              message: collectionResponse.message || 'Data not in cache. Collection queued. Please check again later.',
            }];
          }
          
          // If data is already available (cache hit), it means it was just collected
          // but not yet indexed. Return empty array - user should retry after indexing
          if (Array.isArray(collectionResponse) && collectionResponse.length > 0) {
            // Data is in cache but not indexed yet - return empty, user should retry
            return [];
          }
        } catch (collectionError) {
          // If collection API fails, just return empty results
          console.error('Error requesting collection:', collectionError);
        }
      }

      // Return lawsuits with __typename for union type
      return lawsuits.map(lawsuit => ({
        ...lawsuit,
        __typename: 'Lawsuit',
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar processos: ${error.message}`);
    }
  },
};

