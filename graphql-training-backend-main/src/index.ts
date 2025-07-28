import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { initializeDatabase } from './config/database';
import cors from 'cors';
import dotenv from 'dotenv';

// Import resolvers
import { CategoryResolver } from './resolvers/CategoryResolver';
import { ProductResolver } from './resolvers/ProductResolver';
import { UserResolver } from './resolvers/UserResolver';
import { CartResolver } from './resolvers/CartResolver';

dotenv.config();

async function bootstrap() {
  try {
    // Initialize database connection
    console.log('Connecting to Supabase PostgreSQL database...');
    await initializeDatabase();
    console.log('Supabase database connection established successfully.');
    
    // Create Express application
    const app = express();
  
  // Configure middleware
  app.use(cors());
  app.use(express.json());

  // Build GraphQL schema
  const schema = await buildSchema({
    resolvers: [
      CategoryResolver,
      ProductResolver,
      UserResolver,
      CartResolver
    ],
    validate: false,
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  
  // Apply middleware to Express application
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
  } catch (error) {
    console.error('Error during server bootstrap:', error);
    process.exit(1);
  }
}

// Run the server
bootstrap();
