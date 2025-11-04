// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET(req, { params }) {

    const { id } = await params;

    // ✅ Try Redis cache first
    //   const cachedData = await redis.json.get("orders");

    //   if (cachedData) {
    //     return NextResponse.json(cachedData);
    //   }

    const pool = getPool();
    const [rows] = await pool.query(
        `SELECT 
            o.*,
            u.name,
            u.email,
            u.phone,
            u.address,
            u.city,
            u.country,
            s.method_name as shipping_method,
            p.method_name as payment_method
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        LEFT JOIN shipping_methods s ON s.id = o.shipping_method
        LEFT JOIN payment_methods p ON p.id = o.payment_method
        WHERE o.id = ?
        GROUP BY o.id
        ORDER BY o.id DESC
        LIMIT 1`, [id]
    );

    const [products] = await pool.query(
        `SELECT 
            op.*,
            p.*
        FROM order_products op
        LEFT JOIN products p ON p.id = op.product_id
        WHERE op.order_id = ?
        GROUP BY op.id
        ORDER BY op.id DESC`, [rows[0].id]
    );

    //   await redis.json.set("orders", "$", { orders: rows });

    return NextResponse.json({ order: rows, products: products});
}
