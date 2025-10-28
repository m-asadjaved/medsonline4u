// app/api/products/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql";

export async function GET(req, { params }) {
  try {
    const { page, category } = await params;

    if (page < 1) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const pool = getPool();
    const limit = 9;
    const offset = (page - 1) * limit;

    const baseQuery = `
      SELECT 
        p.*,
        MIN(v.variation_mrp) AS min_price,
        MAX(v.variation_mrp) AS max_price,
        c.name AS category
      FROM products p
      LEFT JOIN product_variations v ON v.product_id = p.id
      LEFT JOIN categories c ON c.id = p.category_id
      ${category ? "WHERE p.category_id = ?" : ""}
      GROUP BY p.id
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(baseQuery, category ? [category, limit, offset] : [limit, offset]);

    const [totalRows] = await pool.query(
      `SELECT COUNT(id) AS total_products FROM products ${category ? "WHERE category_id = ?" : ""}`,
      category ? [category] : []
    );

    return NextResponse.json({
      products: rows,
      totalRows: totalRows[0].total_products,
      page,
      category,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
