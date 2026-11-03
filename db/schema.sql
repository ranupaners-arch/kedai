PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  key     TEXT PRIMARY KEY,
  label   TEXT NOT NULL,
  color   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(key),
  tagline  TEXT NOT NULL,
  rating   REAL NOT NULL,
  reviews  INTEGER NOT NULL,
  image    TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id       TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  category TEXT NOT NULL REFERENCES categories(key),
  type     TEXT NOT NULL,
  name     TEXT NOT NULL,
  price    INTEGER NOT NULL CHECK (price >= 0),   -- cents
  compare_at INTEGER,                              -- original price (cents) when on sale; display only
  rating   REAL NOT NULL,
  reviews  INTEGER NOT NULL,
  descr    TEXT NOT NULL,
  is_new   INTEGER NOT NULL DEFAULT 0,
  image    TEXT                                    -- e.g. /images/foo.jpg (your own / licensed photo)
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, type);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand_id);

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  street      TEXT NOT NULL,
  city        TEXT NOT NULL,
  zip         TEXT NOT NULL,
  promo       TEXT,
  subtotal    INTEGER NOT NULL,
  discount    INTEGER NOT NULL,
  shipping    INTEGER NOT NULL,
  tax         INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  created_at  INTEGER NOT NULL                     -- epoch ms
);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  option     TEXT,
  qty        INTEGER NOT NULL CHECK (qty BETWEEN 1 AND 99),
  unit_price INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id, option)
);
