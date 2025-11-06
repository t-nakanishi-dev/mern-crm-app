// src/components/ContactForm.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { fetchAndMergeUserData } from "../utils/mergeUserData";

const ContactForm = ({
  contact,
  onSuccess,
  onCancel,
  customerId,
  isPublic = false,
  users = [],
}) => {
  const { user: firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    content: "",
    responseStatus: "未対応",
    memo: "",
    customerId: customerId || "",
    assignedUserId: "",
  });
  const [error, setError] = useState(null);
  const [isNew, setIsNew] = useState(true);

  // Firebase + MongoDBユーザー統合
  useEffect(() => {
    const fetchUser = async () => {
      if (firebaseUser) {
        const merged = await fetchAndMergeUserData(firebaseUser);
        setUser(merged);
      }
    };
    fetchUser();
  }, [firebaseUser]);

  // contact または customerId に応じてフォーム初期化
  useEffect(() => {
    if (contact) {
      setFormData({
        customerName: contact.customerName || "",
        contactName: contact.contactName || "",
        contactEmail: contact.contactEmail || "",
        contactPhone: contact.contactPhone || "",
        content: contact.content || "",
        responseStatus: contact.responseStatus || "未対応",
        memo: contact.memo || "",
        customerId: contact.customerId || "",
        assignedUserId: contact.assignedUserId || "",
      });
      setIsNew(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        content: "",
        responseStatus: "未対応",
        memo: "",
        customerId: customerId || "",
        assignedUserId: "",
      }));
      setIsNew(true);
    }
  }, [contact, customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPublic && !user) {
      setError("ログインしてください。");
      return;
    }

    const assignedUserId = isPublic
      ? null
      : formData.assignedUserId || user?.uid;

    try {
      if (isNew) {
        await authorizedRequest(
          isPublic ? "POST" : "POST",
          isPublic ? "/contacts/public" : "/contacts",
          { ...formData, assignedUserId }
        );
      } else {
        await authorizedRequest("PUT", `/contacts/${contact._id}`, formData);
      }
      setError(null);
      if (onSuccess) onSuccess();
      else if (!isPublic) navigate("/contacts");
    } catch (err) {
      console.error("フォーム送信失敗:", err);
      setError(err.response?.data?.error || "処理に失敗しました。");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h3 className="text-lg font-bold mb-4">
        {isPublic
          ? "お問い合わせフォーム"
          : isNew
          ? "新規問い合わせ登録"
          : "問い合わせ編集"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* 会社名 */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="customerName"
          >
            会社名
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* 氏名 */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contactName"
          >
            {isPublic ? "氏名" : "お名前"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* メール */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contactEmail"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* 電話 */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contactPhone"
          >
            電話番号
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* 内容 */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        {/* 担当者割り当て (adminのみ) */}
        {user?.role === "admin" && !isPublic && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="assignedUserId"
            >
              担当者割り当て
            </label>
            <select
              id="assignedUserId"
              name="assignedUserId"
              value={formData.assignedUserId || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">未割り当て</option>
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.displayName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 対応状況 */}
        {user && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="responseStatus"
            >
              対応状況
            </label>
            <select
              id="responseStatus"
              name="responseStatus"
              value={formData.responseStatus}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="未対応">未対応</option>
              <option value="対応中">対応中</option>
              <option value="対応済み">対応済み</option>
            </select>
          </div>
        )}

        {/* メモ */}
        {user && (
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="memo"
            >
              メモ
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
        )}

        {/* ボタン */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isPublic ? "送信" : isNew ? "登録" : "更新"}
          </button>
          {(onCancel || !isNew) && (
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                else navigate("/contacts");
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
