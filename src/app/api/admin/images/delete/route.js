// app/api/imagekit/delete/route.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_URL_ENDPOINT,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileId } = body;
    if (!fileId) return new Response(JSON.stringify({ error: "fileId required" }), { status: 400 });

    const res = await imagekit.deleteFile(fileId); // returns result
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("delete file error", err);
    return new Response(JSON.stringify({ error: "Failed to delete file" }), { status: 500 });
  }
}
