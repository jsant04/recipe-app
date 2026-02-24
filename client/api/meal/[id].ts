import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forward } from "../_mealdb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const mealId = Array.isArray(id) ? id[0] : id;

    if (!mealId) {
      return res.status(400).json({ error: "Missing meal id" });
    }

    const data = await forward("lookup.php", { i: mealId });
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("/api/meal error", error?.message || error);
    return res
      .status(502)
      .json({ error: "Failed to fetch meal details" });
  }
}
