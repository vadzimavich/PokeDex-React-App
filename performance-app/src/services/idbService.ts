import { type Co2Data } from '../types/co2Data';

const DB_NAME = 'Co2DataDB';
const STORE_NAME = 'Co2DataStore';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const setCo2DataInDB = async (data: Co2Data): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put(data, 'co2Data');
  return new Promise((resolve) => {
    transaction.oncomplete = () => resolve();
  });
};

export const getCo2DataFromDB = async (): Promise<Co2Data | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get('co2Data');
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result as Co2Data | undefined);
  });
};
