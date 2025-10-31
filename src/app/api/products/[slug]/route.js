// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET(req, { params }) {
    const { slug } = await params;

    if (!slug) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });

    // const product = await redis.json.get(`product:${slug}`);

    // if(product){
    //   return NextResponse.json(product);
    // }

    const pool = getPool();
    const [rows] = await pool.query('SELECT p.*, (SELECT name from categories c where c.id = p.category_id) as category_name FROM products p WHERE p.slug = ?', [slug]);
    const [variations] = await pool.query('SELECT * FROM product_variations WHERE product_id = (select id from products where slug = ?)', [slug]);
  
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await redis.json.set(`product:${slug}`, '$', {...rows[0], variations});
    return NextResponse.json({...rows[0], variations});
  
  }