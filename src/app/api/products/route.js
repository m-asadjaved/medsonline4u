// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET() {

  // ✅ Try Redis cache first
  const cachedData = await redis.json.get("featuredProducts");

  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
      p.slug,
      p.image_url,
      p.short_description,
      MIN(v.variation_mrp) AS min_price,
      MAX(v.variation_mrp) AS max_price
   FROM products p
   LEFT JOIN product_variations v ON v.product_id = p.id
   GROUP BY p.id
   ORDER BY p.id DESC
   LIMIT 6`
  );

  await redis.json.set("featuredProducts", "$", { products: rows });
  await redis.expire("featuredProducts", process.env.REDIS_TTL);

  return NextResponse.json({ products: rows });
}
