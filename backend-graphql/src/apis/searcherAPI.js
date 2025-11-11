import createHTTPClient from './httpClient.js';

// Use environment variable or default to Docker service name
// For local development, use http://localhost:8100
// For Docker, use http://searcher-api:8000
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
   * @param {number} params.limit - Maximum number of results
   * @param {number} params.offset - Offset for pagination
   * @returns {Promise} Response from searcher API
   */
  async searchLawsuits({ query, filters = {}, limit = 100, offset = 0 }) {
    const requestBody = {
      query,
      filters: filters.court ? { court: filters.court } : {},
      limit,
      offset,
    };

    try {
      const response = await this.client.post('/search/', requestBody);
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          `Searcher API error: ${error.response.status} - ${error.response.data?.detail || error.message}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Searcher API is not responding. Please check if the service is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error calling Searcher API: ${error.message}`);
      }
    }
  }
}

export default new SearcherAPI(BASE_URL, TIMEOUT);

