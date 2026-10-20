import { mkdirSync } from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";

type Row = Record<string, unknown>;

export interface Queryable {
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>;
}

interface Database extends Queryable {
  transaction<T>(work: (tx: Queryable) => Promise<T>): Promise<T>;
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Connect a Postgres database in Vercel (Storage → Neon).");
    this.name = "DatabaseNotConfiguredError";
  }
}

// Production needs DATABASE_URL; local development falls back to an embedded database.
export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== "production";
}

async function connect(): Promise<Database> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { default: postgres } = await import("postgres");
    // `prepare: false` keeps it compatible with Neon's pooled (pgbouncer) connections
    const sql = postgres(url, { max: 5, idle_timeout: 20, prepare: false });
    // postgres.js returns an Array subclass with extra metadata; copy to a plain array
    const wrap = (client: { unsafe: typeof sql.unsafe }): Queryable => ({
      query: async <T,>(text: string, params: unknown[] = []) =>
        Array.from(await client.unsafe(text, params as never[])) as T[],
    });
    return {
      ...wrap(sql),
      transaction: async <T,>(work: (tx: Queryable) => Promise<T>) =>
        (await sql.begin((tx) => work(wrap(tx)))) as T,
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new DatabaseNotConfiguredError();
  }

  // Local development: real Postgres compiled to WebAssembly, stored in .data/
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = path.join(process.cwd(), ".data", "pglite");
  // PGlite only creates the last folder, so make sure .data/ exists on a fresh clone
  mkdirSync(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
  const wrap = (client: Pick<typeof db, "query">): Queryable => ({
    query: async <T,>(text: string, params: unknown[] = []) => (await client.query<T>(text, params)).rows,
  });
  return {
    ...wrap(db),
    transaction: <T,>(work: (tx: Queryable) => Promise<T>) => db.transaction((tx) => work(wrap(tx))),
  };
}

async function migrate(db: Database) {
  // The advisory lock stops two server instances creating tables at the same time
  await db.transaction(async (tx) => {
    await tx.query("SELECT pg_advisory_xact_lock(724153)");
    for (const statement of SCHEMA) {
      await tx.query(statement);
    }
  });
}

// One connection (and one schema check) per server process, reused across requests
const globalForDb = globalThis as unknown as { nenThuongDb?: Promise<Database> };

export function getDb(): Promise<Database> {
  if (!globalForDb.nenThuongDb) {
    const pending = connect().then(async (db) => {
      await migrate(db);
      return db;
    });
    // Let the next request retry if connecting failed
    pending.catch(() => {
      if (globalForDb.nenThuongDb === pending) globalForDb.nenThuongDb = undefined;
    });
    globalForDb.nenThuongDb = pending;
  }
  return globalForDb.nenThuongDb;
}

export async function query<T = Row>(text: string, params?: unknown[]): Promise<T[]> {
  return (await getDb()).query<T>(text, params);
}

export async function transaction<T>(work: (tx: Queryable) => Promise<T>): Promise<T> {
  return (await getDb()).transaction(work);
}
