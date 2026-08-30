import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dating-app";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

// In dev, Next.js hot-reloads modules, so we cache the client on the
// global object to avoid opening a new connection on every request.
let cachedClientPromise = global._mongoClientPromise;

if (!cachedClientPromise) {
  const client = new MongoClient(uri);
  cachedClientPromise = client.connect();
  global._mongoClientPromise = cachedClientPromise;
}

export async function getDb() {
  const client = await cachedClientPromise;
  return client.db(dbName);
}
