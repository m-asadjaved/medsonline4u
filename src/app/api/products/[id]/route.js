// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql'; // adjust path
import { redis } from '@/lib/redis';

export async function GET(req, { params }) {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const product = await redis.json.get(`product:${id}`);

    if(product){
      console.log('from redis')
        return NextResponse.json(product);
    }else{
      const pool = getPool();
      const [rows] = await pool.query('SELECT p.*, (SELECT name from categories c where c.id = p.category_id) as category_name FROM products p WHERE id = ?', [id]);
      const [variations] = await pool.query('SELECT * FROM product_variations WHERE product_id = ?', [id]);
    
      if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      await redis.json.set(`product:${id}`, '$', {...rows[0], variations});
      console.log('from db')
      return NextResponse.json({...rows[0], variations});
    }
  
  }