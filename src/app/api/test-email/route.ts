import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/utils/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      )
    }

    // テスト用のトークン
    const testToken = "test-token-" + Date.now()

    // テストメールの送信
    await sendVerificationEmail(email, testToken)

    return NextResponse.json({
      message: "テストメールを送信しました",
      email,
      token: testToken
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      { error: "テストメールの送信に失敗しました" },
      { status: 500 }
    )
  }
} 