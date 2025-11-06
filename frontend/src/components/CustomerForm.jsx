// src/components/CustomerForm.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService"; // 修正後のauthorizedRequestをインポート

const CustomerForm = ({ editingCustomer, onSuccess, onCancelEdit }) => {
  const { user } = useAuth(); // token は authorizedRequest に直接渡す必要がなくなったため、ここでは不要（使うなら残す）

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    status: "見込み",
    contactMemo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name || "",
        companyName: editingCustomer.companyName || "",
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        status: editingCustomer.status || "見込み",
        contactMemo: editingCustomer.contactMemo || "",
      });
    } else {
      setFormData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        status: "見込み",
        contactMemo: "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!user) {
      // token のチェックは authorizedRequest 内のインターセプターが担当
      setError("ログインしてください");
      setIsSubmitting(false);
      return;
    }

    if (!formData.name) {
      setError("顧客名は必須です。");
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      ...formData,
      assignedUserId: user.uid,
    };

    try {
      if (editingCustomer) {
        // ✅ 修正: token 引数を削除
        await authorizedRequest(
          "PUT",
          `/customers/${editingCustomer._id}`,
          dataToSend
        );
        setSuccess("顧客情報を更新しました！");
      } else {
        // ✅ 修正: token 引数を削除
        await authorizedRequest("POST", "/customers", dataToSend);
        setSuccess("新しい顧客を登録しました！");
      }

      setFormData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        status: "見込み",
        contactMemo: "",
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error("送信エラー:", err);
      const serverMessage =
        err.response?.data?.message || "送信に失敗しました。";
      setError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold">
        {editingCustomer ? "顧客情報の編集" : "顧客登録"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="顧客名 *"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="companyName"
        placeholder="会社名"
        value={formData.companyName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="メールアドレス"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="電話番号"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="見込み">見込み</option>
        <option value="提案中">提案中</option>
        <option value="契約済">契約済</option>
        <option value="失注">失注</option>
      </select>
      <textarea
        name="contactMemo"
        placeholder="メモ・対応履歴など"
        value={formData.contactMemo}
        onChange={handleChange}
        rows={4}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "送信中..." : editingCustomer ? "更新" : "登録"}
        </button>

        {editingCustomer && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                companyName: "",
                email: "",
                phone: "",
                status: "見込み",
                contactMemo: "",
              });
              if (onCancelEdit) onCancelEdit();
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;
