import { registerLastInteractionMutation } from './registerLastInteraction';
import lawsuitsMock from '../lawsuitsMock';

describe('registerLastInteractionMutation', () => {
  beforeEach(() => {
    // Reset movements to remove any lastInteractionDate that might have been set
    lawsuitsMock.forEach(lawsuit => {
      lawsuit.movements.forEach(movement => {
        delete movement.lastInteractionDate;
      });
    });
  });

  describe('Success cases', () => {
    it('should register last interaction successfully', async () => {
      const lawsuitNumber = '5001682-88.2020.8.13.0672';
      const movementId = 'mov1';

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(result.status).toBe('success');
      expect(result.message).toBe('Last interaction registered successfully');
      expect(result.movement).toBeDefined();
      expect(result.movement.id).toBe(movementId);
      expect(result.movement.lastInteractionDate).toBeDefined();
      expect(result.movement.lastInteractionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should update lastInteractionDate on the movement object', async () => {
      const lawsuitNumber = '5001682-88.2020.8.13.0672';
      const movementId = 'mov1';

      const lawsuit = lawsuitsMock.find(l => l.number === lawsuitNumber);
      const movement = lawsuit.movements.find(m => m.id === movementId);

      expect(movement.lastInteractionDate).toBeUndefined();

      await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(movement.lastInteractionDate).toBeDefined();
      expect(movement.lastInteractionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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

      const result = await registerLastInteractionMutation.resolve(null, {
        lawsuitNumber,
        movementId,
      });

      expect(result.status).toBe('error');
      expect(result.message).toContain('not found');
      expect(result.message).toContain(movementId);
      expect(result.movement).toBeNull();
    });
  });
});

