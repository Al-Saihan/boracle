import { openDB } from 'idb';

const DB_NAME = process.env.NEXT_PUBLIC_IDB_DB_NAME || 'boracle-db';
const DB_VERSION = Number(process.env.NEXT_PUBLIC_IDB_DB_VERSION) || 1;
const STORE_NAME = process.env.NEXT_PUBLIC_IDB_STORE_NAME || 'cache-store';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

/**
 * Stores data in IndexedDB with a time-to-live.
 * @param {string} key 
 * @param {any} data 
 * @param {number} ttl - Time to live in milliseconds
 */
export const setCache = async (key, data, ttl) => {
  try {
    const db = await initDB();
    const expiresAt = Date.now() + ttl;
    await db.put(STORE_NAME, { data, expiresAt }, key);
  } catch (err) {
    console.error('Error setting cache in IDB:', err);
  }
};

/**
 * Retrieves data from IndexedDB if it exists and hasn't expired.
 * @param {string} key 
 * @returns {any|null} The cached data or null if expired/missing
 */
export const getCache = async (key) => {
  try {
    const db = await initDB();
    const cached = await db.get(STORE_NAME, key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      await db.delete(STORE_NAME, key);
      return null;
    }
    
    return cached.data;
  } catch (err) {
    console.error('Error getting cache from IDB:', err);
    return null;
  }
};

/**
 * Specifically for stale-while-revalidate pattern.
 * Retrieves data from IndexedDB ignoring expiration, so UI can show stale data while fetching.
 * Returns null if data doesn't exist at all.
 */
export const getStaleCache = async (key) => {
  try {
    const db = await initDB();
    const cached = await db.get(STORE_NAME, key);
    return cached ? cached.data : null;
  } catch (err) {
    console.error('Error getting stale cache from IDB:', err);
    return null;
  }
};
