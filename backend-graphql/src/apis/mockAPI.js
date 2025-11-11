import createHTTPClient from './httpClient.js';

const BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'http://localhost:9777';
const TIMEOUT = Number(process.env.REQUEST_TIMEOUT_MS) || 5000;

class MockAPI {
  constructor(baseURL, timeout) {
    this.client = createHTTPClient(baseURL, timeout);
  }

  participate(params = {}) {
    return this.client.get('/experiment/participate', { params });
  }

  getBoxLock() {
    return this.client.get('/box-lock');
  }
}

export default new MockAPI(BASE_URL, TIMEOUT);
