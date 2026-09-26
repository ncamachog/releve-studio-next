import { promises as fs } from "fs";
import path from "path";

/**
 * Persistencia simple (una lista JSON por colección).
 *  - Producción: Upstash Redis por REST (`KV_REST_API_URL` + `KV_REST_API_TOKEN`,
 *    o `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`).
 *  - Desarrollo sin Redis: archivo `.data/<colección>.json`.
 */
const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const dataDir = path.join(process.cwd(), ".data");

async function redis(cmd: (string | number)[]): Promise<unknown> {
  const r = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return ((await r.json()) as { result: unknown }).result;
}

export async function readList<T>(name: string): Promise<T[]> {
  if (URL_ && TOKEN) {
    const raw = (await redis(["GET", `releve:${name}`])) as string | null;
    return raw ? (JSON.parse(raw) as T[]) : [];
  }
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, `${name}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

export async function writeList<T>(name: string, list: T[]): Promise<void> {
  if (URL_ && TOKEN) {
    await redis(["SET", `releve:${name}`, JSON.stringify(list)]);
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, `${name}.json`), JSON.stringify(list, null, 2));
}

export const usingRedis = Boolean(URL_ && TOKEN);
