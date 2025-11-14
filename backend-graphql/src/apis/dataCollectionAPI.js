import createHTTPClient from './httpClient.js';

const BASE_URL = process.env.DATA_COLLECTION_API_BASE_URL || 'http://data_collection-api:8000';
const TIMEOUT = Number(process.env.REQUEST_TIMEOUT_MS) || 10000;

class DataCollectionAPI {
  constructor(baseURL, timeout) {
    if (!baseURL) {
      throw new Error('DataCollectionAPI: missing baseURL');
    }
    try {
      this.client = createHTTPClient(baseURL, timeout);
    } catch (error) {
      console.error('Error creating DataCollectionAPI client:', error);
      throw error;
    }
  }

  /**
   * Request collection of a lawsuit by CNJ number
   * @param {string} cnj - CNJ number to collect
   * @returns {Promise} Response from data collection API
   */
  async requestCollection(cnj) {
    try {
      const response = await this.client.get('/lawsuit', {
        params: {
          lawsuit_number: cnj,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Data Collection API error: ${error.response.status} - ${error.response.data?.detail || error.message}`
        );
      } else if (error.request) {
        throw new Error('Data Collection API is not responding. Please check if the service is running.');
      } else {
        throw new Error(`Error calling Data Collection API: ${error.message}`);
      }
    }
  }
}

export default new DataCollectionAPI(BASE_URL, TIMEOUT);

