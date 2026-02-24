import { forward } from "./_mealdb";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const q = (req.query.q as string) || "";
    const data = await forward("search.php", { s: q });
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("/api/search error", error?.message || error);
    return res
      .status(502)
      .json({ error: "Failed to fetch search results" });
  }
}
