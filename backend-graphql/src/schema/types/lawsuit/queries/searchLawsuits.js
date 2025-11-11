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
 * Maps activities to movements and related_people to parties
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
    startDate: lawsuit.date || lawsuit.startDate, // Use date from searcher as startDate
    movements: movements,
    // Additional fields
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
  },
  resolve: async (root, { court, number }) => {
    // Validate CNJ if provided
    if (number && !isValidCNJ(number)) {
      throw new Error('Erro de formatação: CNJ inválido.');
    }

    // Build query for searcher API
    // If number is provided, use it as the query (searcher will detect CNJ pattern)
    // If only court filter is provided, use '*' to match all documents (filtered by court)
    // Note: The searcher requires a query string, so we use '*' as a wildcard
    const query = number || '*';

    // Build filters
    const filters = {};
    if (court) {
      filters.court = court.toUpperCase();
    }

    try {
      // Call searcher API
      const response = await searcherAPI.searchLawsuits({
        query,
        filters,
        limit: 100, // Get up to 100 results
        offset: 0,
      });

      // Transform searcher response to GraphQL format
      const lawsuits = (response.lawsuits || []).map(transformLawsuit);

      return lawsuits;
    } catch (error) {
      // If searcher API fails, throw a user-friendly error
      throw new Error(`Erro ao buscar processos: ${error.message}`);
    }
  },
};

