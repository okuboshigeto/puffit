import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    // ユーザーに関連するデータを削除
    await prisma.$transaction([
      // シーシャのレビューを削除
      prisma.shishaReview.deleteMany({
        where: { userId: session.user.id }
      }),
      // ユーザーを削除
      prisma.user.delete({
        where: { id: session.user.id }
      })
    ])

    return NextResponse.json({
      message: "アカウントを削除しました"
    })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "アカウントの削除に失敗しました" },
      { status: 500 }
    )
  }
} 