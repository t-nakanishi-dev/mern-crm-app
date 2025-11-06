# CRM App (MERN Stack)

顧客管理 (CRM) を目的とした Web アプリケーションです。  
顧客・案件・タスク・活動履歴・通知を一元管理できるように設計されています。

---

## 📸 スクリーンショット

> 以下はアプリの画面イメージです。適宜、`/screenshots` フォルダに画像を保存し、パスを変更してください。

### 顧客一覧ページ

![顧客一覧](./screenshots/customers.png)

### 顧客詳細ページ

![顧客詳細](./screenshots/customer-detail.png)

### 通知ドロップダウン

![通知](./screenshots/notifications.png)

---

## 🚀 主な機能

- 🔐 **認証機能**
  - JWT ベースのログイン / ログアウト
  - 管理者と一般ユーザーの権限分け
- 👥 **顧客管理**
  - 顧客リストの表示・検索
  - 顧客詳細ページで案件・タスク・履歴を統合表示
- 📊 **案件 / タスク管理**
  - 顧客に紐づく案件とタスクを一覧管理
  - Kanban ボードで進捗管理
- 🔔 **通知機能**
  - Navbar から未読通知を確認可能
  - ドロップダウンでリアルタイム更新
- 📈 **ダッシュボード**
  - 売上や進捗をチャートで可視化

---

## 🛠 使用技術

- **フロントエンド**: React, Vite, Tailwind CSS, React Router
- **状態管理 / 認証**: Context API, Firebase (認証・通知), JWT
- **UI / ライブラリ**: FontAwesome, Chart.js, react-toastify, @hello-pangea/dnd
- **バックエンド**: Node.js, Express, MongoDB (別リポジトリ)
- **デプロイ**: Vercel / Render など想定

---

## ⚙️ セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/your-username/mern-crm-app.git
cd mern-crm-app

# フロントエンドをセットアップ
cd frontend
npm install

# 開発サーバーを起動
npm run dev
バックエンドについては別リポジトリで管理しています。
.env ファイルには以下のような変数を設定してください：

env
Copy code
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=xxxxxxxx
📂 ディレクトリ構成 (フロントエンド)
plaintext
Copy code
src/
├── components/        # 再利用可能なUIコンポーネント
│   ├── Navbar.jsx
│   ├── NotificationList.jsx
│   └── ...
├── pages/             # 各ページ
│   ├── CustomerPage.jsx
│   ├── CustomerDetailPage.jsx
│   └── ...
├── context/           # 認証 / 通知などのContext
├── services/          # API呼び出し関連
└── App.jsx
👨‍💻 開発者向けメモ
ESLint + Prettier によりコードスタイルを統一

Tailwind でレスポンシブ対応済み

将来的に PWA 対応も検討可能

📜 ライセンス
このプロジェクトは MIT ライセンスの下で公開されています。

yaml
Copy code

---
```
