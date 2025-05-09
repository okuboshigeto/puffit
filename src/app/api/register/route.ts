import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/utils/email"
import crypto from "crypto"

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

    // メールアドレスの重複チェック（Userテーブル）
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック（PendingUserテーブル）
    const existingPending = await prisma.pendingUser.findUnique({
      where: { email }
    })
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後

    if (existingPending) {
      // トークンと有効期限を更新
      await prisma.pendingUser.update({
        where: { email },
        data: {
          verificationToken,
          verificationTokenExpires,
          // 必要なら他の情報も更新
        }
      })

      // 新しい認証メールを送信
      await sendVerificationEmail(email, verificationToken)

      return NextResponse.json({
        message: "再度認証メールを送信しました。メールをご確認ください。"
      })
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // 新規仮登録
    const pendingUser = await prisma.pendingUser.create({
      data: {
        email,
        name,
        hashedPassword,
        verificationToken,
        verificationTokenExpires,
      }
    })

    // 認証メール送信
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      message: "ご登録ありがとうございます。メールボックスを確認し、認証リンクをクリックしてください。"
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { 
        error: "ユーザー登録に失敗しました",
        details: error instanceof Error ? error.message : "不明なエラー"
      },
      { status: 500 }
    )
  }
} 