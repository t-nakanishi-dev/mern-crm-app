// src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar"; // ✅ Navbarをインポート

function App() {
  return (
    <>
      <Navbar /> {/* ✅ Navbarをここでレンダリング */}
      <AppRoutes />
    </>
  );
}

export default App;
