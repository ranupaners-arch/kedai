import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

let db: DatabaseSync | undefined;

/** Adds columns introduced after a database file was first created. */
export function migrate(d: DatabaseSync) {
  const cols = (d.prepare("PRAGMA table_info(products)").all() as { name: string }[]).map((c) => c.name);
  if (cols.length && !cols.includes("compare_at")) d.exec("ALTER TABLE products ADD COLUMN compare_at INTEGER");
}

/** Lazily opens the SQLite file (server-side only). Run `npm run db:seed` first. */
export function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(process.env.SHOP_DB ?? "data/shop.db");
    db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
    migrate(db);
    db.exec(readFileSync("db/schema.sql", "utf8"));
  }
  return db;
}
