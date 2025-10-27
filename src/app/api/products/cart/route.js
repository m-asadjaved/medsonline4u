// app/api/products/cart/route.js
import { NextResponse } from "next/server";
import { getPool } from '@/lib/mysql'; // adjust path

export async function POST(req) {
  const { items } = await req.json(); // [{ id, quantity }]
  if (!items || items.length === 0)
    return NextResponse.json([], { status: 200 });

  const pool = getPool();

  const ids = items.map((i) => i.id);
  const placeholders = ids.map(() => "?").join(",");
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE id IN (${placeholders})`,
    ids
  );

  const cartData = rows.map((product) => {
    const qty = items.find((i) => i.id === product.id)?.quantity || 1;
    return { ...product, quantity: qty };
  });

  return NextResponse.json(cartData);
}
