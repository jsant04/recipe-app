import { openDB, IDBPDatabase } from "idb";
import type { MealDetail } from "../../lib/api";

const DB_NAME = "recipes-pwa";
const DB_VERSION = 1;
const STORE_NAME = "favorites";

interface FavoriteMeal extends MealDetail {
  // Ensure idMeal is string key
  idMeal: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "idMeal" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveFavorite(meal: FavoriteMeal) {
  const db = await getDb();
  await db.put(STORE_NAME, meal);
}

export async function removeFavorite(idMeal: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, idMeal);
}

export async function getFavorite(idMeal: string) {
  const db = await getDb();
  return (await db.get(STORE_NAME, idMeal)) as FavoriteMeal | undefined;
}

export async function getAllFavorites() {
  const db = await getDb();
  return (await db.getAll(STORE_NAME)) as FavoriteMeal[];
}
