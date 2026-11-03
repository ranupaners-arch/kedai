import { getDb } from "./db";

export interface OrderDTO {
  id: string;
  date: number;
  email: string;
  address: { name: string; street: string; city: string; zip: string };
  items: { id: string; opt?: string; qty: number; price: number }[];
  totals: { subtotal: number; discount: number; shipping: number; tax: number; total: number; promo: string | null };
}

interface OrderRow { id: string; email: string; name: string; street: string; city: string; zip: string; promo: string | null; subtotal: number; discount: number; shipping: number; tax: number; total: number; created_at: number }
interface ItemRow { product_id: string; option: string | null; qty: number; unit_price: number }

const toDTO = (o: OrderRow, items: ItemRow[]): OrderDTO => ({
  id: o.id, date: o.created_at, email: o.email,
  address: { name: o.name, street: o.street, city: o.city, zip: o.zip },
  items: items.map((i) => ({ id: i.product_id, opt: i.option ?? undefined, qty: i.qty, price: i.unit_price })),
  totals: { subtotal: o.subtotal, discount: o.discount, shipping: o.shipping, tax: o.tax, total: o.total, promo: o.promo },
});

export function listOrders(email: string): OrderDTO[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC").all(email.toLowerCase()) as unknown as OrderRow[];
  const items = db.prepare("SELECT product_id, option, qty, unit_price FROM order_items WHERE order_id = ?");
  return rows.map((o) => toDTO(o, items.all(o.id) as unknown as ItemRow[]));
}

export interface NewOrder {
  email: string; name: string; street: string; city: string; zip: string; promo?: string | null;
  items: { id: string; opt?: string; qty: number }[];
}

/** Validates input and recomputes every price/total from the database — client numbers are never trusted. */
export function createOrder(input: NewOrder): { order?: OrderDTO; error?: string } {
  const clean = (s: unknown, max = 200) => String(s ?? "").trim().slice(0, max);
  const email = clean(input.email).toLowerCase();
  const address = { name: clean(input.name), street: clean(input.street), city: clean(input.city), zip: clean(input.zip, 20) };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (Object.values(address).some((v) => !v)) return { error: "Please fill in all fields." };
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) return { error: "Your cart is empty." };

  const db = getDb();
  const find = db.prepare("SELECT id, price FROM products WHERE id = ?");
  const merged = new Map<string, { id: string; opt: string; qty: number; price: number }>();
  for (const it of input.items) {
    const qty = Math.floor(Number(it.qty));
    const p = find.get(String(it.id)) as { id: string; price: number } | undefined;
    if (!p || !(qty >= 1 && qty <= 99)) return { error: "An item in your cart is no longer available." };
    const opt = clean(it.opt, 40);
    const k = p.id + "|" + opt;
    const prev = merged.get(k);
    merged.set(k, { id: p.id, opt, qty: Math.min(99, (prev?.qty ?? 0) + qty), price: p.price });
  }
  const lines = [...merged.values()];

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const promo = clean(input.promo, 20).toUpperCase();
  const discount = promo === "SHOP10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discount >= 7500 ? 0 : 600;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  const id = "SHP-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0");
  const created = Date.now();
  db.exec("BEGIN");
  try {
    db.prepare("INSERT INTO orders (id,email,name,street,city,zip,promo,subtotal,discount,shipping,tax,total,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .run(id, email, address.name, address.street, address.city, address.zip, discount ? promo : null, subtotal, discount, shipping, tax, total, created);
    const ins = db.prepare("INSERT INTO order_items (order_id,product_id,option,qty,unit_price) VALUES (?,?,?,?,?)");
    for (const l of lines) ins.run(id, l.id, l.opt, l.qty, l.price);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  return {
    order: {
      id, date: created, email, address,
      items: lines.map((l) => ({ id: l.id, opt: l.opt || undefined, qty: l.qty, price: l.price })),
      totals: { subtotal, discount, shipping, tax, total, promo: discount ? promo : null },
    },
  };
}
