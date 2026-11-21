import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Guest reviews live in Upstash Redis on Vercel and in .local/reviews/ during local work.
// Both stores expose: get, put, remove, approved, claim, release, count.

export function redisStore(url, token) {
  async function run(...commands) {
    const response = await fetch(url.replace(/\/$/, "") + "/pipeline", {
      method: "POST",
      signal: AbortSignal.timeout(8000),
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    if (!response.ok) throw new Error("Review store unavailable");
    const results = await response.json();
    if (!Array.isArray(results) || results.some((item) => item.error)) throw new Error("Review store rejected a command");
    return results.map((item) => item.result);
  }
  const key = (id) => "review:" + id;
  return {
    async get(id) {
      const [value] = await run(["GET", key(id)]);
      return value ? JSON.parse(value) : null;
    },
    // A ttl (seconds) lets unconfirmed reviews disappear on their own.
    async put(review, ttl) {
      const value = JSON.stringify(review);
      await run(
        ttl ? ["SET", key(review.id), value, "EX", ttl] : ["SET", key(review.id), value],
        [review.status === "approved" ? "SADD" : "SREM", "reviews:approved", review.id],
      );
    },
    async remove(id) {
      await run(["DEL", key(id)], ["SREM", "reviews:approved", id]);
    },
    async approved() {
      const [ids] = await run(["SMEMBERS", "reviews:approved"]);
      if (!ids.length) return [];
      const [values] = await run(["MGET", ...ids.map(key)]);
      return values.filter(Boolean).map((value) => JSON.parse(value)).filter((review) => review.status === "approved");
    },
    async claim(name, ttl) {
      const [result] = await run(["SET", "review-lock:" + name, "1", "NX", "EX", ttl]);
      return result === "OK";
    },
    async release(name) {
      await run(["DEL", "review-lock:" + name]);
    },
    async count(name, ttl) {
      const [total] = await run(["INCR", "review-rate:" + name], ["EXPIRE", "review-rate:" + name, ttl, "NX"]);
      return total;
    },
  };
}

export function fileStore(directory) {
  const file = (name) => join(directory, name + ".json");
  async function read(name) {
    try {
      const entry = JSON.parse(await readFile(file(name), "utf8"));
      if (entry.expires && entry.expires < Date.now()) return null;
      return entry;
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }
  async function write(name, value, ttl) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const entry = { value, ...(ttl ? { expires: Date.now() + ttl * 1000 } : {}) };
    await writeFile(file(name), JSON.stringify(entry, null, 2), { mode: 0o600 });
  }
  return {
    async get(id) {
      return (await read(id))?.value ?? null;
    },
    put: (review, ttl) => write(review.id, review, ttl),
    remove: (id) => rm(file(id), { force: true }),
    async approved() {
      let names = [];
      try {
        names = await readdir(directory);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      const ids = names.filter((name) => /^[a-f0-9]{32}\.json$/.test(name)).map((name) => name.slice(0, -5));
      const reviews = await Promise.all(ids.map((id) => this.get(id)));
      return reviews.filter((review) => review?.status === "approved");
    },
    async claim(name, ttl) {
      if (await read("lock-" + name)) return false;
      await write("lock-" + name, 1, ttl);
      return true;
    },
    release: (name) => rm(file("lock-" + name), { force: true }),
    async count(name, ttl) {
      const entry = await read("rate-" + name);
      const total = (entry?.value ?? 0) + 1;
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await writeFile(file("rate-" + name), JSON.stringify({ value: total, expires: entry?.expires ?? Date.now() + ttl * 1000 }), { mode: 0o600 });
      return total;
    },
  };
}

// The Upstash integration on Vercel provides KV_REST_API_*; a direct Upstash database uses UPSTASH_REDIS_REST_*.
export function configuredStore(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? redisStore(url, token) : null;
}

export const localReviews = ".local/reviews";
