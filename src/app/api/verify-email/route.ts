import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      // トークンがない場合はエラー画面へ
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=missing_token`)
    }

    // 保留中のユーザーを検索
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { verificationToken: token }
    })

    if (!pendingUser) {
      // 無効なトークン
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=invalid_or_expired`)
    }

    if (pendingUser.verificationTokenExpires < new Date()) {
      // 期限切れの場合は保留中のユーザーを削除
      await prisma.pendingUser.delete({ where: { id: pendingUser.id } })
      return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=invalid_or_expired`)
    }

    // 本登録（Userテーブルへ移動）
    await prisma.user.create({
      data: {
        email: pendingUser.email,
        name: pendingUser.name,
        hashedPassword: pendingUser.hashedPassword,
        status: 'active',
      }
    })

    // 保留中ユーザーを削除
    await prisma.pendingUser.delete({ where: { id: pendingUser.id } })

    // 認証成功画面へリダイレクト
    return NextResponse.redirect(`${baseUrl}/auth/verify-success`)
  } catch (error) {
    console.error("Error verifying email:", error)
    // 予期せぬエラー時もエラー画面へ
    return NextResponse.redirect(`${baseUrl}/auth/verify-email?error=server`)
  }
} 