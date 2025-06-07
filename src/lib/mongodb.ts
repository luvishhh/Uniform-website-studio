
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
// The database name can often be inferred from the connection string if it includes one
// e.g., mongodb+srv://...mongodb.net/yourDatabaseName?...
// Or you can explicitly set it. If your connection string doesn't specify a database,
// the driver might connect to a default 'test' db or one specified by the user credentials.
// For UniShop, we'll allow specifying it or default to 'unishop'.
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'unishop';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// In development mode, use a global variable so that the MongoClient
// instance is preserved across module reloads caused by HMR (Hot Module Replacement).
// In production, it's usually better to manage connections per request or use a connection pool.
// However, for serverless functions (like Next.js API routes or Server Components),
// caching the client like this is a common pattern to reuse connections across invocations.

interface CachedMongoConnection {
  client: MongoClient | null;
  db: Db | null;
}

// Extend the NodeJS.Global interface to include mongo
declare global {
  // eslint-disable-next-line no-var
  var mongo: {
    conn: CachedMongoConnection | null;
    promise: Promise<CachedMongoConnection> | null;
  };
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Db> {
  if (cached.conn) {
    return cached.conn.db;
  }

  if (!cached.promise) {
    const opts = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    };

    cached.promise = MongoClient.connect(MONGODB_URI!, opts).then(async (client) => {
      const db = client.db(MONGODB_DB_NAME);
      console.log(`Successfully connected to MongoDB database: ${db.databaseName}`);
      return {
        client: client,
        db: db,
      };
    }).catch(error => {
      console.error("Failed to connect to MongoDB", error);
      cached.promise = null; // Reset promise on error so next attempt can try again
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise if connection failed
    throw e;
  }
  
  return cached.conn!.db;
}
