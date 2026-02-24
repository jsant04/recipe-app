export const config = { runtime: "nodejs18.x" };

import { forward, getCategoriesCache, setCategoriesCache } from "./_mealdb";

export default async function handler(_req: any, res: any) {
  if (_req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const now = Date.now();
    const cache = getCategoriesCache();

    if (cache.data && cache.expiresAt > now) {
      res.setHeader("Cache-Control", "public, max-age=600");
      return res.status(200).json(cache.data);
    }

    const data = await forward("categories.php");
    setCategoriesCache(data);

    res.setHeader("Cache-Control", "public, max-age=600");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("/api/categories error", error?.message || error);
    return res
      .status(502)
      .json({ error: "Failed to fetch categories" });
  }
}
