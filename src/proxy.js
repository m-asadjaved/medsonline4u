import { NextResponse } from 'next/server'
import { getUserIp } from '@/lib/ip'
import { rateLimiter } from '@/lib/limiter'

export async function proxy(request) {

  const userIp = await getUserIp()

  try {
    await rateLimiter.consume(userIp, 1)
  } catch {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'], // ✅ applies to ALL /api routes
}