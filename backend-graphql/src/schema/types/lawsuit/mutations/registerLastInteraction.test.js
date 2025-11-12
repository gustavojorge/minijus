import { registerLastInteractionMutation } from './registerLastInteraction';
import searcherAPI from '../../../../apis/searcherAPI';

jest.mock('../../../../apis/searcherAPI', () => ({
  searchLawsuits: jest.fn(),
}));

const mockLawsuit = {
  id: '1',
  number: '5001682-88.2020.8.13.0672',
  court: 'TJAL',
  date: '2020-01-15',
  related_people: [
    { name: 'João Silva', role: 'Autor' },
    { name: 'Maria Santos', role: 'Réu' },
  ],
  activities: [
    { id: 'mov1', date: '2020-01-15', description: 'Distribuição' },
    { id: 'mov2', date: '2020-02-20', description: 'Citação' },
  ],
  nature: 'Cível',
  kind: 'Ação',
  subject: 'Indenização',
  judge: 'João da Silva',
  value: 10000.0,
  lawyers: [{ name: 'Dr. José' }],
};

describe('registerLastInteractionMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should register last interaction successfully', async () => {
      const lawsuitNumber = '5001682-88.2020.8.13.0672';
      const movementId = 'mov1';

      searcherAPI.searchLawsuits.mockResolvedValue({
        lawsuits: [mockLawsuit],
      });

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: lawsuitNumber,
        filters: {},
        limit: 1,
        offset: 0,
      });

      expect(result.status).toBe('success');
      expect(result.message).toBe('Last interaction registered successfully');
      expect(result.movement).toBeDefined();
      expect(result.movement.id).toBe(movementId);
      expect(result.movement.lastInteractionDate).toBeDefined();
      expect(result.movement.lastInteractionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return movement with correct structure', async () => {
      const lawsuitNumber = '5001682-88.2020.8.13.0672';
      const movementId = 'mov1';

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(result.movement).toHaveProperty('id');
      expect(result.movement).toHaveProperty('date');
      expect(result.movement).toHaveProperty('description');
      expect(result.movement).toHaveProperty('lastInteractionDate');
    });
  });

  describe('Error cases', () => {
    it('should return error when lawsuit does not exist', async () => {
      searcherAPI.searchLawsuits.mockResolvedValue({
        lawsuits: [],
      });

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber: '9999999-99.9999.9.99.9999',
        movementId: 'mov1',
      });

      expect(result.status).toBe('error');
      expect(result.message).toContain('not found');
      expect(result.movement).toBeNull();
    });

    it('should return error when movement does not exist', async () => {
      const lawsuitNumber = '5001682-88.2020.8.13.0672';
      const movementId = 'non-existent-movement';

      searcherAPI.searchLawsuits.mockResolvedValue({
        lawsuits: [mockLawsuit],
      });

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(result.status).toBe('error');
      expect(result.message).toContain('not found');
      expect(result.message).toContain(movementId);
      expect(result.movement).toBeNull();
    });

    it('should return error when searcher API fails', async () => {
      searcherAPI.searchLawsuits.mockRejectedValue(
        new Error('Searcher API error')
      );

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber: '5001682-88.2020.8.13.0672',
        movementId: 'mov1',
      });

      expect(result.status).toBe('error');
      expect(result.message).toContain('Error searching for lawsuit');
      expect(result.movement).toBeNull();
    });
  });
});

