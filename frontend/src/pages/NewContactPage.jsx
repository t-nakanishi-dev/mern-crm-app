// src/pages/NewContactPage.jsx

import ContactForm from "../components/ContactForm";
import { useNavigate } from "react-router-dom";

const NewContactPage = () => {
  const navigate = useNavigate();

  // フォーム送信成功時に一覧ページへ戻る
  const handleSuccess = () => {
    navigate("/contacts");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規問い合わせ登録</h1>
      <ContactForm onSuccess={handleSuccess} />
    </div>
  );
};

export default NewContactPage;
