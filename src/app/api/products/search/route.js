// app/api/search/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const raw = (searchParams.get('q') || '').trim();

    if (!raw) {
      // return an empty array for empty query (client expects array)
      return NextResponse.json([]);
    }

    const q = raw.toLowerCase();

    const pool = getPool();

    // Use LOWER(name) so search is case-insensitive
    const [rows] = await pool.query(
      'SELECT id, name FROM products WHERE LOWER(name) LIKE ? LIMIT 5',
      ['%' + q + '%']
    );

    // rows is an array; return 200 with array (empty if none)
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}