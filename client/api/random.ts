import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forward } from "./_mealdb";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await forward("random.php");
    res.setHeader("Cache-Control", "public, max-age=30");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("/api/random error", error?.message || error);
    return res.status(502).json({ error: "Failed to fetch random meal" });
  }
}
