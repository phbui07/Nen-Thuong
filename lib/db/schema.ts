// Every statement is idempotent and runs on startup, so the database sets
// itself up. Add new columns with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS categories (
    id text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS sizes (
    id text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    value text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    price integer NOT NULL CHECK (price >= 0),
    category_id text REFERENCES categories(id) ON DELETE SET NULL,
    size_id text REFERENCES sizes(id) ON DELETE SET NULL,
    origin text NOT NULL DEFAULT '',
    is_featured boolean NOT NULL DEFAULT false,
    is_archived boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS product_images (
    product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    position integer NOT NULL,
    url text NOT NULL,
    PRIMARY KEY (product_id, position)
  )`,
  `CREATE TABLE IF NOT EXISTS images (
    id text PRIMARY KEY,
    content_type text NOT NULL,
    data bytea NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY,
    code text NOT NULL UNIQUE,
    user_id text NOT NULL,
    customer_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL DEFAULT '',
    address text NOT NULL,
    note text NOT NULL DEFAULT '',
    payment_method text NOT NULL,
    is_paid boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'Processing',
    total integer NOT NULL,
    stripe_session_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS order_items (
    order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    position integer NOT NULL,
    product_id text REFERENCES products(id) ON DELETE SET NULL,
    name text NOT NULL,
    price integer NOT NULL,
    qty integer NOT NULL CHECK (qty > 0),
    image_url text NOT NULL DEFAULT '',
    PRIMARY KEY (order_id, position)
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL
  )`,
];
