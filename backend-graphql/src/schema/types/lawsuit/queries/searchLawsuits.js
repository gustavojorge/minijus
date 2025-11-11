import { GraphQLList, GraphQLString } from 'graphql';

import { LawsuitType } from '../typeDefs.js';
import searcherAPI from '../../../../apis/searcherAPI.js';

const normalizeCNJ = (cnjNumber) => {
  if (!cnjNumber) return '';
  return cnjNumber.replace(/[^0-9]/g, '');
};

const isValidCNJ = (cnjNumber) => {
  if (!cnjNumber) return false;
  
  if (/[a-zA-Z]/.test(cnjNumber)) {
    return false;
  }
  
  const normalized = normalizeCNJ(cnjNumber);
  return /^\d{20}$/.test(normalized);
};


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
    date: lawsuit.date,
    judge: lawsuit.judge,
    value: lawsuit.value,
    lawyers: lawsuit.lawyers || [],
  };
};

export const searchLawsuitsQuery = {
  type: new GraphQLList(LawsuitType),
  args: {
    court: { type: GraphQLString }, 
    number: { type: GraphQLString },
    query: { type: GraphQLString }, // Generic query (CNJ, phrase, or text)
  },
  resolve: async (root, { court, number, query: queryParam }) => {
    let searchQuery = queryParam || number;

    // If no query is provided but court filter is, we need a query
    // Use '*' as a placeholder - the searcher will treat it as text search
    // Note: This is not ideal, but the searcher requires a query string
    // In a future improvement, the searcher should support match_all for filter-only searches
    if (!searchQuery && court) {
      searchQuery = '*';
    }

    // If still no query, return empty results
    if (!searchQuery) {
      return [];
    }

    // If using legacy 'number' parameter, validate CNJ format
    if (number && !queryParam) {
      if (!isValidCNJ(number)) {
        throw new Error('Erro de formatação: CNJ inválido.');
      }
    }

    // Build filters
    const filters = {};
    if (court) {
      filters.court = court.toUpperCase();
    }

    try {
      // Call searcher API with the generic query
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

