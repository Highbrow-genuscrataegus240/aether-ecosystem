// @ts-nocheck
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const databaseUrl = process.env.NEXT_PUBLIC_NEON_DATABASE_URL;

if (!databaseUrl) {
    console.warn('Neon database URL not found. Please add VITE_NEON_DATABASE_URL to .env.local');
}

// Create a safe SQL function that returns empty results when no DB URL is configured
const createSql = (): NeonQueryFunction<false, false> => {
    if (databaseUrl) {
        return neon(databaseUrl);
    }
    // Return a no-op function when no database URL is set
    console.warn('Running without database - all queries will return empty results');
    return (async () => []) as any;
};

export const sql = createSql();
