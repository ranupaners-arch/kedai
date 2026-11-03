import type { APIRoute } from "astro";
import { getDb } from "../../lib/db";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const cat = url.searchParams.get("cat");
  const type = url.searchParams.get("type");
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? 50) || 50));

  const where: string[] = [];
  const args: (string | number)[] = [];
  if (cat) { where.push("p.category = ?"); args.push(cat); }
  if (type) { where.push("p.type = ?"); args.push(type); }
  for (const t of q.split(/\s+/).filter(Boolean)) {
    where.push("(lower(p.name) LIKE ? OR lower(b.name) LIKE ? OR lower(p.type) LIKE ?)");
    args.push(`%${t}%`, `%${t}%`, `%${t}%`);
  }
  const sql = `SELECT p.id, p.name, p.price, p.compare_at AS compareAt, p.rating, p.reviews, p.category, p.type, p.is_new AS isNew, p.image, b.id AS brandId, b.name AS brand
               FROM products p JOIN brands b ON b.id = p.brand_id
               ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY p.rowid LIMIT ?`;
  const rows = getDb().prepare(sql).all(...args, limit);
  return new Response(JSON.stringify({ count: rows.length, products: rows }), { headers: { "content-type": "application/json" } });
};
