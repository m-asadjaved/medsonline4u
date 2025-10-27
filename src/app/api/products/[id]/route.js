// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/mysql'; // adjust path

export async function GET(req, { params }) {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  }