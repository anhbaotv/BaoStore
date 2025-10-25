
import { App } from '../types.ts';
import { INITIAL_APPS } from '../constants.ts';

const DB_NAME = 'BaoStoreDB';
const DB_VERSION = 1;
const STORE_NAME = 'apps';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening DB', request.error);
      reject(false);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Pre-populate with initial apps
        INITIAL_APPS.forEach(app => {
            objectStore.add(app);
        });
      }
    };
  });
};

export const getApps = (): Promise<App[]> => {
  return new Promise((resolve) => {
    if (!db) {
        resolve([]);
        return;
    }
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
        console.error('Error fetching apps', request.error);
        resolve([]);
    }
  });
};

export const saveApp = (app: App): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
        reject('DB not initialized');
        return;
    }
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(app);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error saving app', request.error);
      reject(request.error);
    };
  });
};
