// app/api/admin/products/save/[slug]/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql"; // adjust path if needed
import { purgeCache } from '@/lib/redis';
/**
 * PUT /api/admin/products/save/[slug]
 * Body: either { payload: { ...product } } or plain product object
 *
 * Behavior:
 * - Update products row
 * - Delete all product_variations for the product_id
 * - Insert provided variations (DB auto-generates variation id)
 * - Store `images` column as JSON (array)
 * - Return updated product and variations (images returned parsed)
 */
export async function PUT(req, { params }) {
  const pool = getPool();
  let conn;

  try {
    const body = await req.json();
    const data = body?.payload ?? body ?? {};

    // Attempt to find productId from payload.id or params.slug fallback
    let productId = data.id ? Number(data.id) : null;
    const routeSlug = params?.slug;

    // If no id provided, try to resolve by slug from DB
    if (!productId && routeSlug) {
      // get a short-lived connection to lookup id
      const tmpConn = await pool.getConnection();
      try {
        const [rows] = await tmpConn.execute("SELECT id FROM products WHERE slug = ? LIMIT 1", [routeSlug]);
        if (Array.isArray(rows) && rows.length > 0) {
          productId = Number(rows[0]?.id);
        }
      } finally {
        tmpConn.release();
      }
    }

    if (!productId) {
      return NextResponse.json({ error: "Missing product id and no slug match found" }, { status: 400 });
    }

    // Normalize images input (accept array of strings or objects). We'll store as JSON.
    let imagesArray = Array.isArray(data.images) ? data.images : [];
    // If someone passed stringified JSON, try parse
    if (!Array.isArray(imagesArray) && typeof data.images === "string") {
      try {
        imagesArray = JSON.parse(data.images);
      } catch (e) {
        imagesArray = [];
      }
    }
    if (!Array.isArray(imagesArray)) imagesArray = [];

    // Optional: coerce simple string entries into URL strings; keep objects as-is.
    const normalizedImagesForStorage = imagesArray.map((it) => {
      if (typeof it === "string") return it;
      if (it && typeof it === "object") {
        // ensure it has some url-like key if you prefer
        return it;
      }
      return null;
    }).filter(Boolean);

    const imagesJson = JSON.stringify(normalizedImagesForStorage);

    // Product update SQL (parameterized)
    const updateProductSql = `
      UPDATE products
      SET
        name = ?,
        slug = ?,
        short_description = ?,
        description = ?,
        price = ?,
        mrp = ?,
        sku = ?,
        status = ?,
        stock = ?,
        image_url = ?,
        images = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    const productParams = [
      data.name ?? null,
      data.slug ?? null,
      data.short_description ?? null,
      data.description ?? null,
      data.price !== undefined ? Number(data.price) : null,
      data.mrp !== undefined ? Number(data.mrp) : null,
      data.sku ?? "",
      data.status ?? null,
      data.stock !== undefined ? Number(data.stock) : 0,
      data.image_url ?? null,
      imagesJson,
      productId,
    ];

    // Acquire connection and start transaction
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Update product row
    const [updateRes] = await conn.execute(updateProductSql, productParams);

    // Replace categories: delete old ones
    await conn.execute("DELETE FROM product_categories WHERE product_id = ?", [productId]);
    
    // Insert categories (let DB generate id)
    let categoriesCount = 0;
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      const cols = ["product_id", "category_id"];
      const placeholders = [];
      const values = [];

      for (const c of data.categories) {
        // You can add more validation here if required
        placeholders.push("(?, ?)");
        values.push(
          productId,
          c,
        );
      }

      const insertSql = `INSERT INTO product_categories (${cols.join(", ")}) VALUES ${placeholders.join(", ")}`;
      const [insertRes] = await conn.execute(insertSql, values);
      categoriesCount = insertRes?.affectedRows ?? 0;
    }

    // Replace variations: delete old ones
    await conn.execute("DELETE FROM product_variations WHERE product_id = ?", [productId]);

    // Insert variations (let DB generate id)
    let insertedCount = 0;
    if (Array.isArray(data.variations) && data.variations.length > 0) {
      const cols = ["product_id", "variation_name", "variation_sku", "variation_price", "variation_mrp"];
      const placeholders = [];
      const values = [];

      for (const v of data.variations) {
        // guard: skip invalid entries
        const name = v?.variation_name ?? null;
        // You can add more validation here if required
        placeholders.push("(?, ?, ?, ?, ?)");
        values.push(
          productId,
          name,
          v?.variation_sku ?? "",
          v?.variation_price !== undefined ? Number(v.variation_price) : 0,
          v?.variation_mrp !== undefined ? Number(v.variation_mrp) : 0
        );
      }

      const insertSql = `INSERT INTO product_variations (${cols.join(", ")}) VALUES ${placeholders.join(", ")}`;
      const [insertRes] = await conn.execute(insertSql, values);
      insertedCount = insertRes?.affectedRows ?? 0;
    }

    // Commit transaction
    await conn.commit();

    // Fetch updated product and variations to return
    const [productRows] = await pool.execute("SELECT * FROM products WHERE id = ?", [productId]);
    const [varRows] = await pool.execute("SELECT * FROM product_variations WHERE product_id = ? ORDER BY id", [productId]);

    const prod = productRows?.[0] ?? null;

    // Parse images field so client receives array (DB may return string or JSON)
    if (prod) {
      try {
        if (typeof prod.images === "string") {
          prod.images = prod.images ? JSON.parse(prod.images) : [];
        } else if (!Array.isArray(prod.images)) {
          prod.images = prod.images ? prod.images : [];
        }
      } catch (e) {
        prod.images = [];
      }
    }

    purgeCache();
    return NextResponse.json({
      ok: true,
      productUpdated: !!updateRes?.affectedRows,
      variationsInserted: insertedCount,
      product: prod,
      variations: varRows ?? [],
    }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/admin/products/save/[slug] error:", err);
    if (conn) {
      try { await conn.rollback(); } catch (rbErr) { console.error("Rollback error:", rbErr); }
    }
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  } finally {
    if (conn) {
      try { conn.release(); } catch (releaseErr) { console.error("Connection release error:", releaseErr); }
    }
  }
}

export async function POST(req, { params }) {
  const pool = getPool();
  let conn;

  try {
    const body = await req.json();
    const data = body?.payload ?? body ?? {};

    // Normalize images input (accept array of strings or objects). We'll store as JSON.
    let imagesArray = Array.isArray(data.images) ? data.images : [];
    // If someone passed stringified JSON, try parse
    if (!Array.isArray(imagesArray) && typeof data.images === "string") {
      try {
        imagesArray = JSON.parse(data.images);
      } catch (e) {
        imagesArray = [];
      }
    }
    if (!Array.isArray(imagesArray)) imagesArray = [];

    // Optional: coerce simple string entries into URL strings; keep objects as-is.
    const normalizedImagesForStorage = imagesArray.map((it) => {
      if (typeof it === "string") return it;
      if (it && typeof it === "object") {
        // ensure it has some url-like key if you prefer
        return it;
      }
      return null;
    }).filter(Boolean);

    const imagesJson = JSON.stringify(normalizedImagesForStorage);

    // Product update SQL (parameterized)
    const insertProductSql = `
      INSERT INTO products (
        name,
        slug,
        short_description,
        description,
        price,
        mrp,
        sku,
        status,
        stock,
        images,
        created_at,
        updated_at
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
      );
    `;

    const productParams = [
      data.name ?? null,
      data.slug ?? null,
      data.short_description ?? null,
      data.description ?? null,
      data.price !== undefined ? Number(data.price) : null,
      data.mrp !== undefined ? Number(data.mrp) : null,
      data.sku ?? "",
      data.status ?? null,
      data.stock !== undefined ? Number(data.stock) : 0,
      imagesJson,
    ];

    // Acquire connection and start transaction
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Update product row
    const [updateRes] = await conn.execute(insertProductSql, productParams);
    const productId = updateRes?.insertId;
    
    // Insert categories (let DB generate id)
    let categoriesCount = 0;
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      const cols = ["product_id", "category_id"];
      const placeholders = [];
      const values = [];

      for (const c of data.categories) {
        // You can add more validation here if required
        placeholders.push("(?, ?)");
        values.push(
          productId,
          c,
        );
      }

      const insertSql = `INSERT INTO product_categories (${cols.join(", ")}) VALUES ${placeholders.join(", ")}`;
      const [insertRes] = await conn.execute(insertSql, values);
      categoriesCount = insertRes?.affectedRows ?? 0;
    }

    // Insert variations (let DB generate id)
    let insertedCount = 0;
    if (Array.isArray(data.variations) && data.variations.length > 0) {
      const cols = ["product_id", "variation_name", "variation_sku", "variation_price", "variation_mrp"];
      const placeholders = [];
      const values = [];

      for (const v of data.variations) {
        // guard: skip invalid entries
        const name = v?.variation_name ?? null;
        // You can add more validation here if required
        placeholders.push("(?, ?, ?, ?, ?)");
        values.push(
          productId,
          name,
          v?.variation_sku ?? "",
          v?.variation_price !== undefined ? Number(v.variation_price) : 0,
          v?.variation_mrp !== undefined ? Number(v.variation_mrp) : 0
        );
      }

      const insertSql = `INSERT INTO product_variations (${cols.join(", ")}) VALUES ${placeholders.join(", ")}`;
      const [insertRes] = await conn.execute(insertSql, values);
      insertedCount = insertRes?.affectedRows ?? 0;
    }

    // Commit transaction
    await conn.commit();

    // Fetch updated product and variations to return
    const [productRows] = await pool.execute("SELECT * FROM products WHERE id = ?", [productId]);
    const [varRows] = await pool.execute("SELECT * FROM product_variations WHERE product_id = ? ORDER BY id", [productId]);

    const prod = productRows?.[0] ?? null;

    // Parse images field so client receives array (DB may return string or JSON)
    if (prod) {
      try {
        if (typeof prod.images === "string") {
          prod.images = prod.images ? JSON.parse(prod.images) : [];
        } else if (!Array.isArray(prod.images)) {
          prod.images = prod.images ? prod.images : [];
        }
      } catch (e) {
        prod.images = [];
      }
    }

    purgeCache();
    return NextResponse.json({
      ok: true,
      productInserted: !!updateRes?.affectedRows,
      variationsInserted: insertedCount,
      product: prod,
      variations: varRows ?? [],
    }, { status: 200 });
  } catch (err) {
    console.error("POST /api/admin/products/save/ error:", err);
    if (conn) {
      try { await conn.rollback(); } catch (rbErr) { console.error("Rollback error:", rbErr); }
    }
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  } finally {
    if (conn) {
      try { conn.release(); } catch (releaseErr) { console.error("Connection release error:", releaseErr); }
    }
  }
}
