# Connecting to Supabase PostgreSQL

This guide explains how to connect your GraphQL API to Supabase's PostgreSQL database.

## Setup Steps

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com) and sign up
   - Create a new project

2. **Get Connection Details**
   - In your Supabase project dashboard, go to Settings > Database
   - Find the connection information including host, port, user, password, and database name
   - Also get your Supabase URL and anon key from the API settings

3. **Configure Environment Variables**
   - Update your `.env` file with the Supabase connection details:
   ```
   # Supabase Database Configuration
   DB_HOST=db.your-supabase-project-id.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-supabase-db-password
   DB_DATABASE=postgres
   SUPABASE_URL=https://your-supabase-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   ```

4. **Run Migrations**
   - Run the TypeORM migrations to set up your database schema:
   ```
   npm run migration:run
   ```

5. **Seed Database**
   - Populate your database with initial data:
   ```
   npm run seed
   ```

6. **Using Supabase Client**
   - For additional Supabase features like authentication, storage, or realtime:
   ```typescript
   import { supabase } from '../config/supabase';
   
   // Example: Use Supabase Auth
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password123'
   });
   ```

## Troubleshooting

- **Connection Issues**: Make sure your Supabase project's database password is correctly configured
- **SSL Errors**: The connection is configured to accept self-signed certificates with `rejectUnauthorized: false`
- **IP Restrictions**: Check if your Supabase project has IP restrictions enabled

## Database Management

- Use the Supabase dashboard to directly manage your database
- You can create tables, run SQL queries, and manage users from the Supabase interface
- For schema changes, use TypeORM migrations rather than manually altering the schema
