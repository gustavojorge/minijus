import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schemaPromise from './schema/index.js';

const startServer = async () => {
  // Wait for schema to be loaded
  const schema = await schemaPromise;

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Servidor rodando em ${url}`);
};

startServer();
