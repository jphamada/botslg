import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('auth_session')
  const { pathname } = request.nextUrl

  // 1. Skip middleware for static assets, public files, and API routes that MUST be public
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // 2. Define routes that do NOT need authentication
  const isPublicRoute = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/embed') || 
    pathname.startsWith('/api/chat');

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 3. Redirect to login if no session is present
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Already authenticated or not protected
  return NextResponse.next()
}

// Ensure middleware runs for all routes but can be optimized with matchers
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
