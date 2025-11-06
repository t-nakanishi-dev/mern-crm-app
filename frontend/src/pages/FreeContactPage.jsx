// src/pages/FreeContactPage.jsx

import ContactForm from "../components/ContactForm";
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal"; // カスタムモーダルをインポート
import { useState } from "react";

const FreeContactPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSuccess = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    navigate("/"); // 成功後にトップページへ遷移
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
      <p className="mb-4">ご質問やご相談など、お気軽にお問い合わせください。</p>
      <ContactForm onSuccess={handleSuccess} isPublic={true} />
      <CustomModal isOpen={modalOpen} onClose={closeModal}>
        <div className="p-4 text-center">
          <p className="text-lg font-semibold">
            お問い合わせありがとうございます。
          </p>
          <p className="mt-2">内容を確認後、担当者よりご連絡いたします。</p>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default FreeContactPage;
