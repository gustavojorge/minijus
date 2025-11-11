import { searchLawsuitsQuery } from './searchLawsuits';
import lawsuitsMock from '../lawsuitsMock';

describe('searchLawsuitsQuery', () => {
  describe('CNJ validation', () => {
    it('should throw error for invalid CNJ with letters', async () => {
      await expect(
        searchLawsuitsQuery.resolve(null, { number: '5001682-88.2020.8.13.0672a' })
      ).rejects.toThrow('Erro de formatação: CNJ inválido.');
    });

    it('should throw error for CNJ with less than 20 digits', async () => {
      await expect(
        searchLawsuitsQuery.resolve(null, { number: '123' })
      ).rejects.toThrow('Erro de formatação: CNJ inválido.');
    });

    it('should throw error for CNJ with more than 20 digits', async () => {
      await expect(
        searchLawsuitsQuery.resolve(null, { number: '500168288202081306721' })
      ).rejects.toThrow('Erro de formatação: CNJ inválido.');
    });

    it('should accept valid CNJ with mask', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '5001682-88.2020.8.13.0672' 
      });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should accept valid CNJ without mask', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '50016828820208130672' 
      });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Search by CNJ number', () => {
    it('should find lawsuit by CNJ with mask', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '5001682-88.2020.8.13.0672' 
      });
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
    });

    it('should find lawsuit by CNJ without mask', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '50016828820208130672' 
      });
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
    });

    it('should return empty array for non-existent CNJ', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '9999999-99.9999.9.99.9999' 
      });
      
      expect(result).toEqual([]);
    });
  });

  describe('Search by court', () => {
    it('should filter lawsuits by TJAL', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { court: 'TJAL' });
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(lawsuit => {
        expect(lawsuit.court).toBe('TJAL');
      });
    });

    it('should filter lawsuits by TJCE', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { court: 'TJCE' });
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(lawsuit => {
        expect(lawsuit.court).toBe('TJCE');
      });
    });

    it('should be case insensitive for court filter', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { court: 'tjal' });
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(lawsuit => {
        expect(lawsuit.court).toBe('TJAL');
      });
    });
  });

  describe('Combined search', () => {
    it('should filter by both CNJ and court', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '5001682-88.2020.8.13.0672',
        court: 'TJAL'
      });
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].number).toBe('5001682-88.2020.8.13.0672');
      expect(result[0].court).toBe('TJAL');
    });

    it('should return empty array when CNJ and court do not match', async () => {
      const result = await searchLawsuitsQuery.resolve(null, { 
        number: '5001682-88.2020.8.13.0672',
        court: 'TJCE'
      });
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('No filters', () => {
    it('should return all lawsuits when no filters are provided', async () => {
      const result = await searchLawsuitsQuery.resolve(null, {});
      
      expect(result.length).toBe(lawsuitsMock.length);
    });
  });
});

