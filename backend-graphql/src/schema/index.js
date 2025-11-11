import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { getTypes, getQueries, getMutations } from './loader.js';

let schema = null;

const createSchema = async () => {
  if (schema) {
    return schema;
  }

  const types = await getTypes();
  const queries = await getQueries();
  const mutations = await getMutations();

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...queries,
    }),
  });

  const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...mutations,
    }),
  });

  schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
    types,
  });

  return schema;
};

// Export a promise that resolves to the schema
export default createSchema();
