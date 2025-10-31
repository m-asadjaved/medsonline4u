// app/api/admin/upload/route.js
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      // optionally: expire: 30 * 60
    });

    return new Response(JSON.stringify({
      token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("upload auth error", err);
    return new Response(JSON.stringify({ error: "Upload auth failed" }), { status: 500 });
  }
}
