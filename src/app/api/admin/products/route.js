// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET() {

  // ✅ Try Redis cache first
  const cachedData = await redis.json.get("adminProducts");

  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
      p.slug,
      p.images,
      LEFT(p.short_description, 50) AS short_description,
      MAX(v.variation_mrp) AS max_price,
      c.name AS category_name
   FROM products p
   LEFT JOIN product_variations v ON v.product_id = p.id
   LEFT JOIN categories c ON c.id = p.category_id
   GROUP BY p.id
   ORDER BY p.id DESC`
  );

  await redis.json.set("adminProducts", "$", { products: rows });

  return NextResponse.json({ products: rows });
}
