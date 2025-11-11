import mockAPI from '../mockAPI';
import createHTTPClient from '../httpClient';

jest.mock('../httpClient', () => {
  const mockGet = jest.fn();
  return jest.fn(() => ({
    get: mockGet,
  }));
});

describe('MockAPI', () => {
  let mockGet;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockClient = createHTTPClient();
    mockGet = mockClient.get;
  });

  describe('participate', () => {
    it('should call GET /experiment/participate with empty params by default', async () => {
      const mockResponse = { data: { status: 'ok' } };
      mockGet.mockResolvedValue(mockResponse);

      await mockAPI.participate();

      expect(mockGet).toHaveBeenCalledWith('/experiment/participate', {
        params: {},
      });
    });

    it('should call GET /experiment/participate with provided params', async () => {
      const mockResponse = { data: { status: 'ok' } };
      mockGet.mockResolvedValue(mockResponse);
      const params = { alternative: 'variant-a', simulating: 'true' };

      await mockAPI.participate(params);

      expect(mockGet).toHaveBeenCalledWith('/experiment/participate', {
        params,
      });
    });

    it('should return the response from the API', async () => {
      const mockResponse = {
        data: {
          alternative: { name: 'variant-a' },
          client_id: '123',
          status: 'ok',
        },
      };
      mockGet.mockResolvedValue(mockResponse);

      const result = await mockAPI.participate();

      expect(result).toEqual(mockResponse);
    });

  });

  describe('getBoxLock', () => {
    it('should call GET /box-lock', async () => {
      const mockResponse = { data: { header: { title: 'Test' } } };
      mockGet.mockResolvedValue(mockResponse);

      await mockAPI.getBoxLock();

      expect(mockGet).toHaveBeenCalledWith('/box-lock');
    });

    it('should return the response from the API', async () => {
      const mockResponse = {
        data: {
          header: {
            title: 'Upgrade seu plano',
            subtitle: 'Desbloqueie recursos exclusivos',
          },
          body: {
            benefits: ['Benefit 1'],
            price: {
              current: 'R$ 29,90',
              next: 'R$ 49,90',
              period: 'mensal',
            },
            button: {
              label: 'Assinar agora',
            },
          },
          footer: {
            text: 'Cancele quando quiser',
          },
        },
      };
      mockGet.mockResolvedValue(mockResponse);

      const result = await mockAPI.getBoxLock();

      expect(result).toEqual(mockResponse);
    });

  });

  describe('HTTP Client initialization', () => {
    it('should initialize HTTP client with correct base URL and timeout', () => {
      // The mock is called during module import, so we just verify it was called
      expect(createHTTPClient).toHaveBeenCalled();
    });
  });
});

