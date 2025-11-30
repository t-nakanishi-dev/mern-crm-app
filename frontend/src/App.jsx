// src/App.jsx

// ✅ ルーティングの設定をまとめたコンポーネントをインポート
import AppRoutes from "./routes/AppRoutes";

// ✅ 全体で共通して利用するナビゲーションバーをインポート
import Navbar from "./components/Navbar";

/**
 * アプリケーションのルートコンポーネント
 * - 全ページ共通で表示される Navbar を最初に配置
 * - ルーティングによって各ページを切り替える
 */
function App() {
  return (
    <>
      {/* ✅ 全ページ共通のヘッダー（ナビゲーションバー） */}
      <Navbar />

      {/* ✅ ページごとのルーティングを管理するコンポーネント */}
      <AppRoutes />
    </>
  );
}

// ✅ 他ファイルから利用できるようにエクスポート
export default App;
