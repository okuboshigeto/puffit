import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/utils/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()

    console.log("Registration attempt:", { email, name }) // デバッグ用ログ

    if (!email || !name || !password) {
      console.log("Missing required fields") // デバッグ用ログ
      return NextResponse.json(
        { error: "メールアドレス、名前、パスワードは必須です" },
        { status: 400 }
      )
    }

    // 本登録済みチェック
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      )
    }

    // 仮登録済みチェック
    const existingPending = await prisma.pendingUser.findUnique({ where: { email } })
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後

    if (existingPending) {
      await prisma.pendingUser.update({
        where: { email },
        data: { verificationToken, verificationTokenExpires }
      })
      await sendVerificationEmail(email, verificationToken)
      return NextResponse.json({
        message: "すでに仮登録されています。新しい認証メールを送信しましたので、メールボックスをご確認ください。"
      })
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // 新規仮登録
    await prisma.pendingUser.create({
      data: { email, name, hashedPassword, verificationToken, verificationTokenExpires }
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