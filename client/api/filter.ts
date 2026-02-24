import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forward } from "./_mealdb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const category = (req.query.c as string) || "";
    const data = await forward("filter.php", { c: category });
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("/api/filter error", error?.message || error);
    return res
      .status(502)
      .json({ error: "Failed to fetch filtered meals" });
  }
}
