// src/components/CustomerList.jsx

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";
import CustomerForm from "./CustomerForm";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const { user, token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const fetchCustomers = useCallback(async () => {
    if (!user || !token) {
      setError("ログインしてください。");
      setCustomers([]);
      return;
    }

    try {
      const res = await authorizedRequest("GET", "/customers", token);
      if (Array.isArray(res)) {
        setCustomers(res);
      } else {
        console.error("APIレスポンスの形式が不正です:", res);
        setCustomers([]);
      }
      setError(null);
    } catch (err) {
      console.error("顧客取得失敗:", err);
      setError("顧客情報の取得に失敗しました。");
    }
  }, [user, token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (customerId) => {
    if (!window.confirm("この顧客を削除してもよろしいですか？")) return;

    try {
      await authorizedRequest("DELETE", `/customers/${customerId}`, token);
      fetchCustomers();
    } catch (err) {
      console.error("削除失敗:", err);
      setError("顧客の削除に失敗しました。");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <CustomerForm
        editingCustomer={editingCustomer}
        onSuccess={() => {
          setEditingCustomer(null);
          fetchCustomers();
        }}
        onCancelEdit={() => setEditingCustomer(null)}
      />

      <h2 className="text-xl font-bold mb-4 mt-8">顧客一覧</h2>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">名前</th>
              <th className="border p-2">会社名</th>
              <th className="border p-2">ステータス</th>
              <th className="border p-2">メール</th>
              <th className="border p-2">電話</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) &&
              customers.map((c) => (
                <tr key={c._id}>
                  <td className="border p-2">
                    <Link
                      to={`/customers/${c._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="border p-2">{c.companyName}</td>
                  <td className="border p-2">{c.status}</td>
                  <td className="border p-2">{c.email}</td>
                  <td className="border p-2">{c.phone}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => setEditingCustomer(c)}
                      className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    >
                      削除
                    </button>
                    <Link
                      to={`/customers/${c._id}`}
                      className="inline-block px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
