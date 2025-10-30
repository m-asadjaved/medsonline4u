// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from "@/lib/redis";

export async function GET(req, { params }) {
  const { page } = await params;

  if (!page) return NextResponse.json({ error: 'Invalid page' }, { status: 400 });

  // ✅ Try Redis cache first
  const cachedPage = await redis.json.get("page:" + page);

  if (cachedPage) {
    return NextResponse.json(cachedPage);
  }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
      p.slug,
      p.short_description,
      p.image_url,
      MIN(v.variation_mrp) AS min_price,
      MAX(v.variation_mrp) AS max_price,
      c.name AS category
    FROM products p
    LEFT JOIN product_variations v ON v.product_id = p.id
    LEFT JOIN categories c ON c.id = p.category_id
    GROUP BY p.id
    ORDER BY id DESC limit 9 offset ${(page - 1) * 9}`
  );

  const [totalRows] = await pool.query(
    `SELECT count(id) as total_products FROM products`
  );

  await redis.json.set("page:" + page, "$", { 
    products: rows, 
    totalRows: totalRows[0].total_products 
  });

  return NextResponse.json({ products: rows, totalRows: totalRows[0].total_products });
}
