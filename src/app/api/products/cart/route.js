import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql";

export async function POST(req) {
  const { items } = await req.json();
  // items = [{ id, quantity, variationId }]

  if (!items || items.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  const pool = getPool();

  // Normalize variation_id (handle both camelCase and snake_case)
  const normalizedItems = items.map((i) => ({
    ...i,
    variation_id: i.variation_id ?? i.variationId ?? null,
  }));

  const productIds = normalizedItems.map((i) => i.id);
  const variationIds = normalizedItems
    .map((i) => i.variation_id)
    .filter((id) => id != null);

  // --- Fetch products ---
  const productPlaceholders = productIds.map(() => "?").join(",");
  const [products] = await pool.query(
    `SELECT id, name, slug, image_url, price FROM products WHERE id IN (${productPlaceholders})`,
    productIds
  );

  // --- Fetch variations ---
  let variations = [];
  if (variationIds.length > 0) {
    const variationPlaceholders = variationIds.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT id, product_id, variation_name, variation_mrp 
       FROM product_variations 
       WHERE id IN (${variationPlaceholders})`,
      variationIds
    );
    variations = rows;
  }

  // --- Build cart data ---
  const cartData = normalizedItems.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const variation = item.variation_id
      ? variations.find((v) => v.id === item.variation_id)
      : null;

    const price = variation?.variation_mrp ?? product?.price ?? 0;

    return {
      id: product?.id,
      name: product?.name,
      slug: product?.slug,
      image: product?.image_url,
      description: product?.short_description,
      quantity: item.quantity || 1,
      variation: variation
        ? {
            id: variation.id,
            name: variation.variation_name,
            price: variation.variation_mrp,
          }
        : null,
      price,
      total: price * (item.quantity || 1),
    };
  });

  return NextResponse.json(cartData);
}
