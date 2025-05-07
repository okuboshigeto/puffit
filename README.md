# Puffit

Puffitは、Next.js、TypeScript、Prisma、NextAuth.jsを使用したモダンなWebアプリケーションです。

## 🚀 技術スタック

- **フロントエンド**
  - Next.js 14.1.0
  - React 18.3.1
  - TypeScript
  - Tailwind CSS
  - React Icons

- **バックエンド**
  - Next.js API Routes
  - Prisma (ORM)
  - NextAuth.js (認証)
  - bcryptjs (パスワードハッシュ化)

## 📦 セットアップ方法

1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd puffit
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、以下の環境変数を設定してください：
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV=production
STORAGE_DATABASE_URL="your-prisma-key"
```

4. データベースのセットアップ
```bash
npx prisma generate
npx prisma db push
```

5. 開発サーバーの起動
```bash
npm run dev
```

## 🛠️ 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動（http://localhost:3000）
- `npm run build` - プロダクションビルドを作成
- `npm run start` - プロダクションモードでサーバーを起動
- `npm run lint` - コードのリントを実行

## 📁 プロジェクト構造

```
puffit/
├── prisma/          # データベーススキーマとマイグレーション
├── public/          # 静的ファイル
├── src/
│   ├── app/        # Next.js 13+ App Router
│   ├── components/ # Reactコンポーネント
│   ├── lib/        # ユーティリティ関数
│   └── types/      # TypeScript型定義
├── .env            # 環境変数
└── package.json    # プロジェクト設定
```

## 🔒 認証

このプロジェクトはNextAuth.jsを使用して認証を実装しています。以下の機能が含まれています：

- メールアドレス/パスワード認証
- セッション管理
- 保護されたルート

## 🎨 スタイリング

Tailwind CSSを使用してスタイリングを行っています。カスタムユーティリティクラスやコンポーネントは`src/styles`ディレクトリに配置されています。

## 📝 ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 👥 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📧 サポート

問題や質問がある場合は、Issueを作成してください。
