// Database configuration for MongoDB/PostgreSQL
// Install: npm install mongodb / npm install pg

// MongoDB Example
export const dbConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cartrade',
    options: {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
    }
  },
  
  // PostgreSQL Example
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'cartrade',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20, // connection pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },

  // Redis for caching and rate limiting
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
    maxRetriesPerRequest: 3,
  }
};

// Connection singleton pattern
let cachedDb: any = null;

export async function connectDB() {
  if (cachedDb) return cachedDb;
  
  // Implement your DB connection here
  // cachedDb = await MongoClient.connect(dbConfig.mongodb.uri, dbConfig.mongodb.options);
  
  return cachedDb;
}
