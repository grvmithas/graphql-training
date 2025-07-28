import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Use direct connection string from environment variable
const connectionString = process.env.DATABASE_URL;

console.log('Using database connection string (sensitive info redacted)');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: connectionString,
  ssl: {
    rejectUnauthorized: false // Required for connecting to Supabase from some environments
  },
  synchronize: true, // Enable auto synchronize for development to create tables
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../entities/**/*.{js,ts}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{js,ts}')],
  subscribers: []
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    return AppDataSource;
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};
