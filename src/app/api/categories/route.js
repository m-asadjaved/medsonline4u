// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM categories ORDER BY id DESC limit 6`
  );

  return NextResponse.json({ categories: rows });
}
