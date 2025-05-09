import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=missing_token`);
    }

    const pendingUser = await prisma.pendingUser.findUnique({ where: { verificationToken: token } });
    if (!pendingUser) {
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=invalid_or_expired`);
    }
    if (pendingUser.verificationTokenExpires < new Date()) {
      await prisma.pendingUser.delete({ where: { id: pendingUser.id } });
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=invalid_or_expired`);
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

    return NextResponse.redirect(`${baseUrl}/auth/verify-success`);
  } catch (error) {
    return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=server`);
  }
}