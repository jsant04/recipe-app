import axios from "axios";

const MEALDB_API_BASE =
  process.env.MEALDB_API_BASE || "https://www.themealdb.com/api/json/v1";
const MEALDB_API_KEY = process.env.MEALDB_API_KEY || "1";

// Simple in-memory cache for categories (per server instance)
const CATEGORY_TTL_MS = 10 * 60 * 1000; // 10 minutes
let categoriesCache: { data: unknown | null; expiresAt: number } = {
  data: null,
  expiresAt: 0,
};

export async function forward<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = `${MEALDB_API_BASE}/${MEALDB_API_KEY}/${path}`;
  const response = await axios.get<T>(url, {
    params,
    timeout: 8000,
  });
  return response.data;
}

export function getCategoriesCache() {
  return categoriesCache;
}

export function setCategoriesCache(data: unknown) {
  categoriesCache = {
    data,
    expiresAt: Date.now() + CATEGORY_TTL_MS,
  };
}
