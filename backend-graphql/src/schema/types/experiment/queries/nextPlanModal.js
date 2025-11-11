import { NextPlanModalType } from '../typeDefs.js';
import mockAPI from '../../../../apis/mockAPI.js';

export const nextPlanModalQuery = {
  type: NextPlanModalType,
  resolve: async () => {
    try {
      const { data } = await mockAPI.getBoxLock();

      // Matching GraphQL schema with the response
      return {
        header: {
          title: data.header.title,
          subtitle: data.header.subtitle,
        },
        body: {
          benefits: data.body.benefits,
          price: {
            current: data.body.price.current,
            next: data.body.price.next,
            period: data.body.price.period,
          },
          button: {
            label: data.body.button.label,
          },
        },
        footer: {
          text: data.footer.text,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch modal data: ${error.message}`);
    }
  },
};

