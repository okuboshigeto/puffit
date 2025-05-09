import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// 動的ルートとして設定
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // request.urlが完全なURLであることを確認
    if (!request.url) {
      throw new Error('Request URL is undefined');
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      const redirectUrl = new URL('/auth/verify-email', baseUrl);
      redirectUrl.searchParams.set('error', 'missing_token');
      return NextResponse.redirect(redirectUrl);
    }

    const pendingUser = await prisma.pendingUser.findUnique({ where: { verificationToken: token } });
    if (!pendingUser) {
      const redirectUrl = new URL('/auth/verify-email', baseUrl);
      redirectUrl.searchParams.set('error', 'invalid_or_expired');
      return NextResponse.redirect(redirectUrl);
    }

    if (pendingUser.verificationTokenExpires < new Date()) {
      await prisma.pendingUser.delete({ where: { id: pendingUser.id } });
      const redirectUrl = new URL('/auth/verify-email', baseUrl);
      redirectUrl.searchParams.set('error', 'invalid_or_expired');
      return NextResponse.redirect(redirectUrl);
    }

    await prisma.user.create({
      data: {
        email: pendingUser.email,
        name: pendingUser.name,
        hashedPassword: pendingUser.hashedPassword,
        status: 'active',
      }
    });
    await prisma.pendingUser.delete({ where: { id: pendingUser.id } });

    const successUrl = new URL('/auth/verify-success', baseUrl);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Error in verify-email route:', error);
    const errorUrl = new URL('/auth/verify-email', baseUrl);
    errorUrl.searchParams.set('error', 'server');
    return NextResponse.redirect(errorUrl);
  }
}