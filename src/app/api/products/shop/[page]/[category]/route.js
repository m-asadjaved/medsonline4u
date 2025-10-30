// app/api/products/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql";
import { redis } from "@/lib/redis";

export async function GET(req, { params }) {
  try {
    const { page, category } = await params;

    if (page < 1 || !category) {
      return NextResponse.json({ error: "Invalid page number or category" }, { status: 400 });
    }

    // ✅ Try Redis cache first
    const cachedCategory = await redis.json.get("category:" + category + ":page:" + page);

    if (cachedCategory) {
      return NextResponse.json(cachedCategory);
    }

    const pool = getPool();
    const limit = 9;
    const offset = (page - 1) * limit;

    const baseQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.image_url,
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

    await redis.json.set("category:" + category + ":page:" + page, "$", {
      products: rows,
      totalRows: totalRows[0].total_products,
      page,
      category,
    });

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
