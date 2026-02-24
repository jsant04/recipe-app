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

// In production we can safely call TheMealDB directly since the demo key "1" is public.
// This avoids needing a custom backend on Vercel for now.
const API_BASE = "https://www.themealdb.com/api/json/v1/1";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function searchMeals(query: string) {
  const res = await fetch(
    `${API_BASE}/search.php?s=${encodeURIComponent(query)}`
  );
  return handleResponse<{ meals: MealSummary[] | null }>(res);
}

export async function getMealById(id: string) {
  const res = await fetch(
    `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`
  );
  return handleResponse<{ meals: MealDetail[] | null }>(res);
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories.php`);
  return handleResponse<{ categories: Category[] | null }>(res);
}

export async function getMealsByCategory(category: string) {
  const res = await fetch(
    `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`
  );
  return handleResponse<{ meals: MealSummary[] | null }>(res);
}

export async function getRandomMeal() {
  const res = await fetch(`${API_BASE}/random.php`);
  return handleResponse<{ meals: MealDetail[] | null }>(res);
}
