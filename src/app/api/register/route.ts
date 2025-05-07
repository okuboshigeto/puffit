import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    console.log("Registration attempt:", { email, name }) // デバッグ用ログ

    if (!email || !name || !password) {
      console.log("Missing required fields") // デバッグ用ログ
      return NextResponse.json(
        { error: "メールアドレス、名前、パスワードは必須です" },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      console.log("Email already exists:", email) // デバッグ用ログ
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    })

    console.log("User created successfully:", user.id) // デバッグ用ログ

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Error registering user:", error)
    // より詳細なエラー情報を返す
    return NextResponse.json(
      { 
        error: "ユーザー登録に失敗しました",
        details: error instanceof Error ? error.message : "不明なエラー"
      },
      { status: 500 }
    )
  }
} 