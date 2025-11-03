import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql"; // adjust path if needed
import { purgeCache } from '@/lib/redis';

export async function DELETE(req, { params }) {
  const pool = getPool();
  let conn;

  try {
    const { id } = await params;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Delete variations first (FK consistency)
    await conn.execute("DELETE FROM product_variations WHERE product_id = ?", [id]);

    // Delete product
    const [delRes] = await conn.execute("DELETE FROM products WHERE id = ?", [id]);

    if (delRes.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await conn.commit();
    purgeCache();

    return NextResponse.json({ ok: true, message: "Product deleted" }, { status: 200 });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("DELETE /api/admin/products/:id error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
