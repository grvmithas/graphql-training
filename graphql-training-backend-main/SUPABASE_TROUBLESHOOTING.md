# Supabase Connection Troubleshooting Guide

We're encountering issues connecting to your Supabase PostgreSQL database. Here are the possible issues and solutions:

## Possible Issues

1. **Incorrect Hostname**: The hostname `db.yvtmxlmscsafejsrkksu.supabase.co` could not be resolved, suggesting it might be incorrect or the Supabase project might not be fully provisioned yet.

2. **Connection String Format**: Special characters in your password (`AJ@supa2025#`) need proper URL encoding in connection strings.

3. **Incorrect Port**: The default PostgreSQL port is 5432, but Supabase might use a different port (like 6543 for direct database connections).

4. **SSL Requirements**: Supabase requires SSL connections.

5. **Network Restrictions**: Supabase might have IP restrictions enabled on your database.

## Steps to Fix

1. **Verify Project ID**:
   - Check your Supabase project dashboard to confirm the project ID (`yvtmxlmscsafejsrkksu`) is correct.

2. **Get Direct Connection String**:
   - In Supabase Dashboard, go to Project Settings → Database
   - Look for "Connection String" or "Connection Pooling" section
   - Copy the exact connection string provided by Supabase

3. **Update Your .env File**:
   ```
   DATABASE_URL=your_exact_connection_string_from_supabase
   ```

4. **Disable Connection Pooling**: 
   - Try using direct database connection credentials 
   - Check if there's a separate host for direct database access

5. **Check Database Status**:
   - Make sure your Supabase project is active and the database is running
   - Check if there are any maintenance notices

## Testing the Connection

Once you've updated your connection details, you can test the connection with:

```
npx ts-node src/direct-connection-test.ts
```

## Alternative Approach

If direct PostgreSQL connection continues to have issues, you can use the Supabase client for database operations:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Query data
const { data, error } = await supabase
  .from('products')
  .select('*');
```

This approach uses the REST API instead of a direct database connection, which might be more reliable.
