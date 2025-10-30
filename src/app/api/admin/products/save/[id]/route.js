// app/api/products/[id]/route.js
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime so fs is allowed

// helper: ensure upload dir exists
function ensureUploadDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// helper: convert Web ReadableStream to Node Readable and pipe to dest
async function saveFileFromWebFile(webFile, destPath) {
  // webFile.stream() returns a WHATWG ReadableStream
  // convert to Node readable and pipe to fs
  const nodeReadable = Readable.fromWeb(webFile.stream());
  await pipeline(nodeReadable, fs.createWriteStream(destPath));
}

export async function PUT(req, { params }) {
  // example: update product by id
  const { id } = params;
  const contentType = (req.headers.get("content-type") || "").toLowerCase();

  try {
    let product = null;
    const savedFiles = [];

    if (contentType.includes("application/json")) {
      // simple JSON body
      const body = await req.json();
      product = {
        ...body,
        id,
        price: Number(body.price || 0),
        mrp: Number(body.mrp || 0),
        stock: Number(body.stock || 0),
      };
      // TODO: update DB here
    } else if (contentType.includes("multipart/form-data")) {
      // multipart: use Web FormData API This is from admin section
      const form = await req.formData();

      const payload = form.get("payload") || form.get("product") || null;
      if (!payload) {
        return NextResponse.json({ error: "Missing payload field" }, { status: 400 });
      }

      try {
        product = JSON.parse(String(payload));
      } catch (e) {
        return NextResponse.json({ error: "Invalid JSON in payload" }, { status: 400 });
      }

      // files can be appended as 'images' (multiple) or single
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      ensureUploadDir(uploadDir);

      // form.getAll will return File objects for files appended as the same name
      const fileEntries = form.getAll("images");
      for (const f of fileEntries) {
        if (f && typeof f.stream === "function") {
          // f is a Web File (has .name, .stream(), .size, .type)
          const safeName = f.name ? f.name.replace(/\s+/g, "-") : `file-${Date.now()}`;
          const filename = `${Date.now()}-${safeName}`;
          const destPath = path.join(uploadDir, filename);

          await saveFileFromWebFile(f, destPath);

          savedFiles.push(`/uploads/${filename}`);
        } else if (typeof f === "string") {
          // If you appended remote URLs or strings
          savedFiles.push(f);
        }
      }

      // attach saved file URLs to product.images
      product.images = product.images || [];
      product.images.push(...savedFiles);

      // TODO: persist product update to DB
    } else {
      // fallback: attempt to parse as json
      try {
        const body = await req.json();
        product = { ...body, id };
      } catch (e) {
        return NextResponse.json({ error: "Unsupported content-type" }, { status: 415 });
      }
    }

    // Simulate DB update and return updated product
    const updated = { ...product, id, updatedAt: new Date().toISOString() };
    return NextResponse.json({ ok: true, product: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
