import { experimentDataQuery } from './experimentData';
import mockAPI from '../../../../apis/mockAPI';

jest.mock('../../../../apis/mockAPI', () => ({
  participate: jest.fn(),
}));

describe('experimentDataQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should return experiment data successfully', async () => {
      const mockData = {
        alternative: { name: 'variant-a' },
        client_id: '123',
        experiment: { name: 'litigants-experiment' },
        experiment_group: { name: 'justarter' },
        participating: true,
        simulating: false,
        status: 'ok',
      };

      mockAPI.participate.mockResolvedValue({ data: mockData });

      const result = await experimentDataQuery.resolve(null, {});

      expect(result).toEqual({
        alternative: { name: 'variant-a' },
        client_id: '123',
        experiment: { name: 'litigants-experiment' },
        experiment_group: { name: 'justarter' },
        participating: true,
        simulating: false,
        status: 'ok',
      });
    });

    it('should pass alternative parameter when provided', async () => {
      const mockData = {
        alternative: { name: 'control' },
        client_id: '456',
        experiment: { name: 'litigants-experiment' },
        experiment_group: { name: 'justarter' },
        participating: false,
        simulating: false,
        status: 'ok',
      };

      mockAPI.participate.mockResolvedValue({ data: mockData });

      await experimentDataQuery.resolve(null, { alternative: 'control' });

      expect(mockAPI.participate).toHaveBeenCalledWith({ alternative: 'control' });
    });

    it('should pass simulating parameter when provided', async () => {
      const mockData = {
        alternative: { name: 'variant-a' },
        client_id: '789',
        experiment: { name: 'litigants-experiment' },
        experiment_group: { name: 'justarter' },
        participating: true,
        simulating: true,
        status: 'ok',
      };

      mockAPI.participate.mockResolvedValue({ data: mockData });

      await experimentDataQuery.resolve(null, { simulating: true });

      expect(mockAPI.participate).toHaveBeenCalledWith({ simulating: 'true' });
    });

    it('should pass both alternative and simulating parameters', async () => {
      const mockData = {
        alternative: { name: 'variant-a' },
        client_id: '101',
        experiment: { name: 'litigants-experiment' },
        experiment_group: { name: 'justarter' },
        participating: true,
        simulating: true,
        status: 'ok',
      };

      mockAPI.participate.mockResolvedValue({ data: mockData });

      await experimentDataQuery.resolve(null, {
        alternative: 'variant-a',
        simulating: true,
      });

      expect(mockAPI.participate).toHaveBeenCalledWith({
        alternative: 'variant-a',
        simulating: 'true',
      });
    });
  });

  describe('Error cases', () => {
    it('should throw error when API call fails', async () => {
      const errorMessage = 'Network error';
      mockAPI.participate.mockRejectedValue(new Error(errorMessage));

      await expect(
        experimentDataQuery.resolve(null, {})
      ).rejects.toThrow(`Failed to fetch experiment data: ${errorMessage}`);
    });

  });
});

