import createHTTPClient from '../httpClient';

describe('createHTTPClient', () => {
  it('should create an axios instance', () => {
    const baseURL = 'http://localhost:3000';
    const timeout = 5000;
    const client = createHTTPClient(baseURL, timeout);
    expect(client.defaults.baseURL).toBe(baseURL);
    expect(client.defaults.timeout).toBe(timeout);
    expect(client.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should throw an error if baseURL is missing', () => {
    expect(() => createHTTPClient()).toThrow('missing baseURL');
  });
});
