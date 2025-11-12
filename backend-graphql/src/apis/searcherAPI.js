import createHTTPClient from './httpClient.js';


const BASE_URL = process.env.SEARCHER_API_BASE_URL || 'http://searcher-api:8000';
const TIMEOUT = Number(process.env.REQUEST_TIMEOUT_MS) || 10000;

class SearcherAPI {
  constructor(baseURL, timeout) {
    if (!baseURL) {
      throw new Error('SearcherAPI: missing baseURL');
    }
    try {
      this.client = createHTTPClient(baseURL, timeout);
    } catch (error) {
      console.error('Error creating SearcherAPI client:', error);
      throw error;
    }
  }

  /**
   * Search for lawsuits in the searcher API
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query (CNJ number or text)
   * @param {Object} params.filters - Optional filters
   * @param {string} params.filters.court - Court filter (TJAL, TJCE)
   * @param {Object} params.filters.date - Date filter
   * @param {string} params.filters.date.date - Date value (YYYY-MM-DD)
   * @param {string} params.filters.date.operator - Date operator ("<", "=", ">")
   * @param {number} params.limit - Maximum number of results
   * @param {number} params.offset - Offset for pagination
   * @returns {Promise} Response from searcher API
   */
  async searchLawsuits({ query, filters = {}, limit = 100, offset = 0 }) {
    const requestFilters = {};
    
    if (filters.court) {
      requestFilters.court = filters.court;
    }
    
    if (filters.date) {
      requestFilters.date = {
        date: filters.date.date,
        operator: filters.date.operator,
      };
    }

    const requestBody = {
      query,
      filters: requestFilters,
      limit,
      offset,
    };

    try {
      const response = await this.client.post('/search/', requestBody);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Searcher API error: ${error.response.status} - ${error.response.data?.detail || error.message}`
        );
      } else if (error.request) {
        throw new Error('Searcher API is not responding. Please check if the service is running.');
      } else {
        throw new Error(`Error calling Searcher API: ${error.message}`);
      }
    }
  }
}

export default new SearcherAPI(BASE_URL, TIMEOUT);

