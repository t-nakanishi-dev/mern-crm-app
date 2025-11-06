// src/components/Modal.jsx
import React from "react";

const Modal = ({ title, message, onConfirm, onCancel, isConfirmOnly }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div
          className={`flex ${
            isConfirmOnly ? "justify-center" : "justify-end space-x-2"
          }`}
        >
          {!isConfirmOnly && (
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              キャンセル
            </button>
          )}
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
