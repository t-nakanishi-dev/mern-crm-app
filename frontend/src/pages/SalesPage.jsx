// src/pages/SalesPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import SalesForm from "../components/SalesForm"; // SalesFormをインポート

const SalesPage = () => {
  const { user, token } = useAuth();
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null); // 編集中の案件データを保持
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [customers, setCustomers] = useState([]); // 顧客リストを保持

  // 顧客リストを取得する関数 (SalesFormでも使われるが、ここでは案件名表示のために必要)
  const fetchCustomers = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await authorizedRequest("GET", "/customers");
      if (Array.isArray(res)) {
        setCustomers(res);
      }
    } catch (err) {
      console.error("顧客リストの取得に失敗しました:", err);
    }
  }, [user, token]);

  // 案件リストを取得する関数
  const fetchSales = useCallback(async () => {
    if (!user || !token) {
      setSales([]);
      return;
    }
    try {
      const res = await authorizedRequest("GET", "/sales");
      if (Array.isArray(res)) {
        setSales(res);
      } else {
        console.error("APIレスポンスの形式が不正です:", res);
        setSales([]);
      }
    } catch (err) {
      console.error("案件取得失敗:", err);
      setModalConfig({
        title: "エラー",
        message: "案件情報の取得に失敗しました。",
        onConfirm: () => setShowModal(false),
        isConfirmOnly: true,
      });
      setShowModal(true);
      setSales([]);
    }
  }, [user, token]);

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, [fetchSales, fetchCustomers]);

  const handleEdit = (sale) => {
    setEditingSale(sale); // 編集中の案件をセット
  };

  const handleDelete = (id) => {
    setModalConfig({
      title: "削除確認",
      message: "本当に削除しますか？",
      onConfirm: () => {
        confirmDelete(id);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
      isConfirmOnly: false,
    });
    setShowModal(true);
  };

  const confirmDelete = async (id) => {
    if (!user || !token) {
      setModalConfig({
        title: "エラー",
        message: "ログインしてください",
        onConfirm: () => setShowModal(false),
        isConfirmOnly: true,
      });
      setShowModal(true);
      return;
    }
    try {
      await authorizedRequest("DELETE", `/sales/${id}`);
      fetchSales();
    } catch (err) {
      console.error("削除エラー:", err);
      setModalConfig({
        title: "エラー",
        message: "削除に失敗しました",
        onConfirm: () => setShowModal(false),
        isConfirmOnly: true,
      });
      setShowModal(true);
    }
  };

  // customerIdから顧客名を取得するヘルパー関数
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    return customer ? customer.companyName : "顧客情報なし";
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      {showModal && <Modal {...modalConfig} />}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">営業案件管理</h1>

      {/* SalesFormコンポーネントを配置 */}
      <div className="mb-8">
        <SalesForm
          editingSale={editingSale}
          onSuccess={() => {
            fetchSales(); // 成功したら案件リストを再取得
            setEditingSale(null); // 編集状態を解除
          }}
          onCancelEdit={() => setEditingSale(null)} // キャンセル時に編集状態を解除
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">案件一覧</h2>
        {Array.isArray(sales) && sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    案件金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期限日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:underline">
                      <Link to={`/sales/${sale._id}`}>{sale.dealName}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCustomerName(sale.customerId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ¥{sale.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.dueDate
                        ? new Date(sale.dueDate).toLocaleDateString()
                        : "未設定"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition-colors duration-200"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">案件データがありません。</p>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
