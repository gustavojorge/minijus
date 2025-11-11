import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { GraphQLString } from 'graphql';

const loadSchemaFields = async (typesDir) => {
  let aggregatedTypes = {};
  let aggregatedQueries = {};
  let aggregatedMutations = {};

  const typeFolders = fs.readdirSync(typesDir).filter((folder) => {
    const folderPath = path.join(typesDir, folder);
    return fs.statSync(folderPath).isDirectory();
  });

  for (const typeFolder of typeFolders) {
    const typeIndexPath = path.join(typesDir, typeFolder, 'index.js');

    if (fs.existsSync(typeIndexPath)) {
      try {
        // Convert file path to URL for dynamic import
        const fileUrl = `file://${path.resolve(typeIndexPath)}`;
        const typeModule = await import(fileUrl);

        if (typeModule?.default?.typeDefs && Object.keys(typeModule.default.typeDefs).length > 0) {
          aggregatedTypes = { ...aggregatedTypes, ...typeModule.default.typeDefs };
        }

        if (typeModule?.default?.queries && Object.keys(typeModule.default.queries).length > 0) {
          aggregatedQueries = { ...aggregatedQueries, ...typeModule.default.queries };
        }

        if (typeModule?.default?.mutations && Object.keys(typeModule.default.mutations).length > 0) {
          aggregatedMutations = { ...aggregatedMutations, ...typeModule.default.mutations };
        }
      } catch (error) {
        console.error(`Erro ao carregar o type "${typeFolder}":`, error);
      }
    }
  }

  return { aggregatedTypes, aggregatedQueries, aggregatedMutations };
};

const addDefaultField = (fields, defaultMessage) => {
  if (Object.keys(fields).length === 0) {
    return {
      _empty: {
        type: GraphQLString,
        resolve: () => defaultMessage,
      },
    };
  }
  return fields;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typesDirectory = path.join(__dirname, 'types');

// Load schema fields asynchronously
let schemaData = null;

const loadSchema = async () => {
  if (schemaData) {
    return schemaData;
  }

  const { aggregatedTypes, aggregatedQueries, aggregatedMutations } =
    await loadSchemaFields(typesDirectory);

  const types = Object.values(aggregatedTypes);
  const queries = addDefaultField(aggregatedQueries, 'No queries available');
  const mutations = addDefaultField(aggregatedMutations, 'No mutations available');

  schemaData = { types, queries, mutations };
  return schemaData;
};

// Export a promise that resolves to the schema data
export const schemaPromise = loadSchema();

// For backward compatibility, export async getters
export const getTypes = async () => {
  const data = await schemaPromise;
  return data.types;
};

export const getQueries = async () => {
  const data = await schemaPromise;
  return data.queries;
};

export const getMutations = async () => {
  const data = await schemaPromise;
  return data.mutations;
};
