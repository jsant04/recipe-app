export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strCategory?: string | null;
  strArea?: string | null;
}

export interface MealDetail extends MealSummary {
  strInstructions?: string | null;
  strYoutube?: string | null;
  strTags?: string | null;
  [key: string]: any;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

const API_BASE = "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function searchMeals(query: string) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return handleResponse<{ meals: MealSummary[] | null }>(res);
}

export async function getMealById(id: string) {
  const res = await fetch(`${API_BASE}/meal/${encodeURIComponent(id)}`);
  return handleResponse<{ meals: MealDetail[] | null }>(res);
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse<{ categories: Category[] | null }>(res);
}

export async function getMealsByCategory(category: string) {
  const res = await fetch(
    `${API_BASE}/filter?c=${encodeURIComponent(category)}`
  );
  return handleResponse<{ meals: MealSummary[] | null }>(res);
}

export async function getRandomMeal() {
  const res = await fetch(`${API_BASE}/random`);
  return handleResponse<{ meals: MealDetail[] | null }>(res);
}
