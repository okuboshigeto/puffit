import nodemailer from 'nodemailer';

// メール送信用のトランスポーターを作成
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// メール認証用のメールを送信
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

  const mailOptions = {
    from: {
      name: 'Puffit',
      address: process.env.SMTP_FROM!
    },
    to: email,
    subject: 'Puffit - メールアドレスの確認',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">メールアドレスの確認</h1>
        <p>Puffitへのご登録ありがとうございます。</p>
        <p>以下のリンクをクリックして、メールアドレスの確認を完了してください：</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #4CAF50; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 4px;">
          メールアドレスを確認する
        </a>
        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
          このリンクは24時間有効です。<br>
          もしこのメールに心当たりがない場合は、無視してください。
        </p>
      </div>
    `,
  };

  try {
    // 環境変数の確認
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    });

    // メール送信
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info);
    return info;
  } catch (error: any) {
    console.error('Error sending verification email:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    throw new Error(`メールの送信に失敗しました: ${error.message}`);
  }
}

// パスワードリセット用のメールを送信
export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'パスワードのリセット',
    html: `
      <h1>パスワードのリセット</h1>
      <p>以下のリンクをクリックして、パスワードのリセットを行ってください：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>このリンクは1時間有効です。</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}; 