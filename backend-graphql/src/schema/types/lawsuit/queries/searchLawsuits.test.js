import { searchLawsuitsQuery } from './searchLawsuits';
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

describe('searchLawsuitsQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Search by query (CNJ)', () => {
    it('should find lawsuit by CNJ with mask', async () => {
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [mockLawsuit],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '5001682-88.2020.8.13.0672' 
      });
      
      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: '5001682-88.2020.8.13.0672',
        filters: {},
        limit: 100,
        offset: 0,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
    });

    it('should find lawsuit by CNJ without mask', async () => {
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [mockLawsuit],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '50016828820208130672' 
      });
      
      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: '50016828820208130672',
        filters: {},
        limit: 100,
        offset: 0,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
    });

    it('should return empty array for non-existent CNJ', async () => {
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '9999999-99.9999.9.99.9999' 
      });
      
      expect(result).toEqual([]);
    });
  });

  describe('Search by court filter only', () => {
    it('should filter lawsuits by TJAL when only court filter is provided', async () => {
      const tjalLawsuit = { ...mockLawsuit, court: 'TJAL' };
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [tjalLawsuit],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '',
        court: 'TJAL' 
      });
      
      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: '',
        filters: { court: 'TJAL' },
        limit: 100,
        offset: 0,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].court).toBe('TJAL');
    });

    it('should be case insensitive for court filter', async () => {
      const tjalLawsuit = { ...mockLawsuit, court: 'TJAL' };
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [tjalLawsuit],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '',
        court: 'tjal' 
      });
      
      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: '',
        filters: { court: 'TJAL' },
        limit: 100,
        offset: 0,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].court).toBe('TJAL');
    });
  });

  describe('Combined search', () => {
    it('should filter by both query and court', async () => {
      (searcherAPI.searchLawsuits as jest.Mock).mockResolvedValue({
        lawsuits: [mockLawsuit],
      });

      const result = await searchLawsuitsQuery.resolve(null, { 
        query: '5001682-88.2020.8.13.0672',
        court: 'TJAL'
      });
      
      expect(searcherAPI.searchLawsuits).toHaveBeenCalledWith({
        query: '5001682-88.2020.8.13.0672',
        filters: { court: 'TJAL' },
        limit: 100,
        offset: 0,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
      expect(result[0].court).toBe('TJAL');
    });
  });

  describe('No query and no filters', () => {
    it('should return empty array when no query and no filters are provided', async () => {
      const result = await searchLawsuitsQuery.resolve(null, {});
      
      expect(searcherAPI.searchLawsuits).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw error when searcher API fails', async () => {
      (searcherAPI.searchLawsuits as jest.Mock).mockRejectedValue(
        new Error('Searcher API error')
      );

      await expect(
        searchLawsuitsQuery.resolve(null, { query: 'test' })
      ).rejects.toThrow('Erro ao buscar processos: Searcher API error');
    });
  });
});

