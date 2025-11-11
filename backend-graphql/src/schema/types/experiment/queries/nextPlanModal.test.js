import { nextPlanModalQuery } from './nextPlanModal';
import mockAPI from '../../../../apis/mockAPI';

jest.mock('../../../../apis/mockAPI', () => ({
  getBoxLock: jest.fn(),
}));

describe('nextPlanModalQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success cases', () => {
    it('should return modal data successfully', async () => {
      const mockData = {
        header: {
          title: 'Upgrade seu plano',
          subtitle: 'Desbloqueie recursos exclusivos',
        },
        body: {
          benefits: [
            'Acesso ilimitado',
            'Suporte prioritário',
            'Recursos avançados',
          ],
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
      };

      mockAPI.getBoxLock.mockResolvedValue({ data: mockData });

      const result = await nextPlanModalQuery.resolve();

      expect(result).toEqual({
        header: {
          title: 'Upgrade seu plano',
          subtitle: 'Desbloqueie recursos exclusivos',
        },
        body: {
          benefits: [
            'Acesso ilimitado',
            'Suporte prioritário',
            'Recursos avançados',
          ],
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
      });
    });

    it('should return correct structure with all required fields', async () => {
      const mockData = {
        header: {
          title: 'Test Title',
          subtitle: 'Test Subtitle',
        },
        body: {
          benefits: ['Benefit 1', 'Benefit 2'],
          price: {
            current: 'R$ 10,00',
            next: 'R$ 20,00',
            period: 'monthly',
          },
          button: {
            label: 'Subscribe',
          },
        },
        footer: {
          text: 'Footer text',
        },
      };

      mockAPI.getBoxLock.mockResolvedValue({ data: mockData });

      const result = await nextPlanModalQuery.resolve();

      expect(result).toHaveProperty('header');
      expect(result).toHaveProperty('body');
      expect(result).toHaveProperty('footer');
      expect(result.header).toHaveProperty('title');
      expect(result.header).toHaveProperty('subtitle');
      expect(result.body).toHaveProperty('benefits');
      expect(result.body).toHaveProperty('price');
      expect(result.body).toHaveProperty('button');
      expect(result.body.price).toHaveProperty('current');
      expect(result.body.price).toHaveProperty('next');
      expect(result.body.price).toHaveProperty('period');
      expect(result.body.button).toHaveProperty('label');
      expect(result.footer).toHaveProperty('text');
    });
  });

  describe('Error cases', () => {
    it('should throw error when API call fails', async () => {
      const errorMessage = 'API unavailable';
      mockAPI.getBoxLock.mockRejectedValue(new Error(errorMessage));

      await expect(
        nextPlanModalQuery.resolve()
      ).rejects.toThrow(`Failed to fetch modal data: ${errorMessage}`);
    });

  });
});

