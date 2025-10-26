// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '../../_lib/mysql'; // adjust path

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM products ORDER BY id DESC`
  );

  return NextResponse.json({ products: rows });
}
