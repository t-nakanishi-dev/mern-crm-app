// src/components/CustomModal.jsx

import React from "react";
import { createPortal } from "react-dom";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick} // ここにイベントリスナーを追加
    >
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-0">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;
