import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

// 認証が必要なパスを指定
export const config = {
  matcher: [
    "/shisha/:path*",
    "/tobacco/:path*",
    "/profile/:path*",
    "/api/shisha/:path*",
    "/api/tobacco/:path*",
  ]
} 