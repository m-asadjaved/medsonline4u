// app/api/imagekit/list/route.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_URL_ENDPOINT,
});

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    // ImageKit listFiles uses skip/limit
    const skip = page * limit;

    const res = await imagekit.listFiles({ limit, skip });
    // res typically contains: { total_count, items: [...] }
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("list files error", err);
    return new Response(JSON.stringify({ error: "Failed to list files" }), { status: 500 });
  }
}
