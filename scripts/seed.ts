// Usage: npm run db:seed   (creates data/shop.db and loads the catalog)
import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import { migrate } from "../src/lib/db.ts";
import { BRANDS, CATEGORIES, CATEGORY_KEYS, PRODUCTS } from "../src/data/catalog.ts";

mkdirSync("data", { recursive: true });
const db = new DatabaseSync("data/shop.db");
migrate(db);
db.exec(readFileSync("db/schema.sql", "utf8"));

db.exec("BEGIN");
const cat = db.prepare("INSERT OR REPLACE INTO categories (key,label,color) VALUES (?,?,?)");
for (const k of CATEGORY_KEYS) cat.run(k, CATEGORIES[k].label, CATEGORIES[k].color);

const brand = db.prepare("INSERT OR REPLACE INTO brands (id,name,category,tagline,rating,reviews,image) VALUES (?,?,?,?,?,?,?)");
for (const b of BRANDS) brand.run(b.id, b.name, b.cat, b.tagline, +b.rating, b.reviews, b.image ?? null);

const prod = db.prepare("INSERT OR REPLACE INTO products (id,brand_id,category,type,name,price,compare_at,rating,reviews,descr,is_new,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
for (const p of PRODUCTS) prod.run(p.id, p.brand, p.cat, p.type, p.name, p.price, p.compareAt ?? null, p.rating, p.reviews, p.desc, p.isNew ? 1 : 0, p.image ?? null);
db.exec("COMMIT");

const n = (t: string) => (db.prepare(`SELECT COUNT(*) c FROM ${t}`).get() as { c: number }).c;
console.log(`seeded data/shop.db: ${n("categories")} categories, ${n("brands")} brands, ${n("products")} products`);
