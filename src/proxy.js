import { NextResponse } from "next/server";
import { getUserIp } from "@/lib/ip";
import { rateLimiter } from "@/lib/limiter";
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

export async function proxy(request) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") ) {
		const token = request.cookies.get("token");
		try {

			if (!token){
				return NextResponse.rewrite(new URL('/login', request.url))
			}

			const user = jwtDecode(token.value);
			const secretString = process.env.JWT_SECRET;
			if (!secretString) throw new Error("Missing JWT_SECRET");

			const secretUint8 = new TextEncoder().encode(secretString); // a string
			await jwtVerify(token.value, secretUint8); // throws if invalid or expired

			if(user.role === 'admin'){
				return NextResponse.next()
			}

			return NextResponse.json({error: 'Unauthorized'}, {status: 401})

		} catch (e) {

			if(e.code === 'ERR_JWT_EXPIRED'){
				return NextResponse.rewrite(new URL('/login', request.url))
			}

			return NextResponse.json({error: e.message}, {status: 401})

		}
	}

	if (pathname.startsWith("/api")) {
		const userIp = await getUserIp();

		try {
			await rateLimiter.consume(userIp, 1);
		} catch {
			return NextResponse.json(
				{ message: "Too many requests" },
				{ status: 429 }
			);
		}

		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/api/:path*", "/admin/:path*", "/admin"], // ✅ applies to ALL /api routes
};
