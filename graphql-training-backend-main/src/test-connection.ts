import 'reflect-metadata';
import { AppDataSource } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase PostgreSQL database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);
    
    await AppDataSource.initialize();
    console.log('✅ Connected to Supabase database successfully!');
    
    await AppDataSource.destroy();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

testConnection();
