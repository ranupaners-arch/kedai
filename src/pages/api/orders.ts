import type { APIRoute } from "astro";
import { createOrder, listOrders } from "../../lib/orders";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Demo only: orders are looked up by email with no authentication. Add real auth before using this for anything real.
export const GET: APIRoute = ({ url }) => {
  const email = (url.searchParams.get("email") ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "email is required" }, 400);
  return json({ orders: listOrders(email) });
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const { order, error } = createOrder(body as Parameters<typeof createOrder>[0]);
  return error ? json({ error }, 422) : json({ order }, 201);
};
