import { Router } from "express";
import axios from "axios";

const router = Router();

const MEALDB_API_BASE =
  process.env.MEALDB_API_BASE || "https://www.themealdb.com/api/json/v1";
const MEALDB_API_KEY = process.env.MEALDB_API_KEY || "1";

// Simple in-memory cache for categories (TTL in ms)
const CATEGORY_TTL_MS = 10 * 60 * 1000; // 10 minutes
let categoriesCache: { data: unknown | null; expiresAt: number } = {
  data: null,
  expiresAt: 0,
};

async function forward<T>(
  path: string,
  params?: Record<string, string | number | undefined>
) {
  const url = `${MEALDB_API_BASE}/${MEALDB_API_KEY}/${path}`;
  const response = await axios.get<T>(url, {
    params,
    timeout: 8000,
  });
  return response.data;
}

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string) || "";
    const data = await forward("search.php", { s: q });
    res.json(data);
  } catch (error: any) {
    console.error("/api/search error", error.message || error);
    res.status(502).json({ error: "Failed to fetch search results" });
  }
});

router.get("/meal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await forward("lookup.php", { i: id });
    res.json(data);
  } catch (error: any) {
    console.error("/api/meal error", error.message || error);
    res.status(502).json({ error: "Failed to fetch meal details" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const now = Date.now();
    if (categoriesCache.data && categoriesCache.expiresAt > now) {
      res.setHeader("Cache-Control", "public, max-age=600");
      return res.json(categoriesCache.data);
    }

    const data = await forward("categories.php");
    categoriesCache = {
      data,
      expiresAt: now + CATEGORY_TTL_MS,
    };

    res.setHeader("Cache-Control", "public, max-age=600");
    res.json(data);
  } catch (error: any) {
    console.error("/api/categories error", error.message || error);
    res.status(502).json({ error: "Failed to fetch categories" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const category = (req.query.c as string) || "";
    const data = await forward("filter.php", { c: category });
    res.json(data);
  } catch (error: any) {
    console.error("/api/filter error", error.message || error);
    res.status(502).json({ error: "Failed to fetch filtered meals" });
  }
});

router.get("/random", async (_req, res) => {
  try {
    const data = await forward("random.php");
    res.json(data);
  } catch (error: any) {
    console.error("/api/random error", error.message || error);
    res.status(502).json({ error: "Failed to fetch random meal" });
  }
});

export default router;
