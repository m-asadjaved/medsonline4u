// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from "@/lib/redis";

export async function GET() {

  // ✅ Try Redis cache first
  const cachedCategories = await redis.json.get("categories");

  if (cachedCategories) {
    return NextResponse.json(cachedCategories);
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM categories ORDER BY id DESC limit 6`
  );

  await redis.json.set("categories", "$", { categories: rows });
  await redis.expire("categories", process.env.REDIS_TTL);

  return NextResponse.json({ categories: rows });
}
