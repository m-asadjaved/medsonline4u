// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET() {

  // ✅ Try Redis cache first
//   const cachedData = await redis.json.get("orders");

//   if (cachedData) {
//     return NextResponse.json(cachedData);
//   }

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT 
      o.id,
      o.total_value,
      o.status,
      o.created_at,
      u.name,
      u.city,
      u.country,
      s.method_name as shipping_method,
      p.method_name as payment_method
   FROM orders o
   LEFT JOIN users u ON u.id = o.user_id
   LEFT JOIN shipping_methods s ON s.id = o.shipping_method
   LEFT JOIN payment_methods p ON p.id = o.payment_method
   GROUP BY o.id
   ORDER BY o.id DESC
   LIMIT 100`
  );

//   await redis.json.set("orders", "$", { orders: rows });

  return NextResponse.json({ orders: rows });
}
