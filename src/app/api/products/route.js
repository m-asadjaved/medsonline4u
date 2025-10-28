// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { getUserIp } from '@/lib/ip';
import { rateLimiter } from '@/lib/limiter';

export async function GET() {

  const userIp = await getUserIp();

  try {
    await rateLimiter.consume(userIp, 1);
  } catch {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 })
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
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


  return NextResponse.json({ products: rows });
}
