import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";
import Modal from "../components/Modal";
import CustomerForm from "../components/CustomerForm";
import ActivityTimeline from "../components/ActivityTimeline";
import StatusBadge from "../components/StatusBadge";
import { TASK_STATUS, SALES_STATUS } from "../constants/statusConfig";

const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [editingCustomer, setEditingCustomer] = useState(null);

  // 再取得トリガー
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCustomer = useCallback(async () => {
    if (!user || !token || !customerId) return;
    try {
      const res = await authorizedRequest("GET", `/customers/${customerId}`);
      setCustomer(res);
      setEditingCustomer(null);
    } catch (err) {
      console.error("顧客情報の取得に失敗しました:", err);
      setModalConfig({
        title: "エラー",
        message: "顧客情報の取得に失敗しました。",
        onConfirm: () => {
          setShowModal(false);
          navigate("/customers");
        },
        isConfirmOnly: true,
      });
      setShowModal(true);
    }
  }, [user, token, customerId, navigate]);

  const fetchSalesByCustomer = useCallback(async () => {
    if (!user || !token || !customerId) return;
    try {
      const res = await authorizedRequest(
        "GET",
        `/sales/customer/${customerId}`,
      );
      setSales(res);
    } catch (err) {
      console.error("案件リストの取得に失敗しました:", err);
      setSales([]);
    }
  }, [user, token, customerId]);

  const fetchTasksByCustomer = useCallback(async () => {
    if (!user || !token || !customerId) return;
    try {
      const res = await authorizedRequest(
        "GET",
        `/customers/${customerId}/tasks`,
      );
      setTasks(res);
    } catch (err) {
      console.error("タスクリストの取得に失敗しました:", err);
      setTasks([]);
    }
  }, [user, token, customerId]);

  const refreshAllData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchCustomer();
    fetchSalesByCustomer();
    fetchTasksByCustomer();
  }, [
    fetchCustomer,
    fetchSalesByCustomer,
    fetchTasksByCustomer,
    refreshTrigger,
  ]);

  const handleEditSuccess = () => {
    refreshAllData();
    setEditingCustomer(null);
  };

  const handleDelete = () => {
    setModalConfig({
      title: "顧客削除確認",
      message: "この顧客を削除してもよろしいですか？",
      onConfirm: async () => {
        try {
          await authorizedRequest("DELETE", `/customers/${customerId}`);
          setShowModal(false);
          navigate("/customers");
        } catch (err) {
          console.error("削除エラー:", err);
          setModalConfig({
            title: "エラー",
            message: "顧客の削除に失敗しました。",
            onConfirm: () => setShowModal(false),
            isConfirmOnly: true,
          });
          setShowModal(true);
        }
      },
      onCancel: () => setShowModal(false),
      isConfirmOnly: false,
    });
    setShowModal(true);
  };

  if (!customer) {
    return <div className="text-center mt-8">読み込み中...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {showModal && <Modal {...modalConfig} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          顧客詳細: {customer.companyName}
        </h1>
      </div>

      {/* 顧客情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">顧客情報</h2>

          <p className="mb-2">
            <strong>顧客名:</strong> {customer.name}
          </p>
          <p className="mb-2">
            <strong>会社名:</strong> {customer.companyName}
          </p>
          <p className="mb-2">
            <strong>メール:</strong> {customer.email}
          </p>
          <p className="mb-2">
            <strong>電話番号:</strong> {customer.phone}
          </p>
          <p className="mb-2">
            <strong>ステータス:</strong> {customer.status}
          </p>
          <p className="mb-4">
            <strong>メモ:</strong> {customer.contactMemo}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => setEditingCustomer(customer)}
              disabled={!!editingCustomer}
              className={`px-4 py-2 rounded ${
                editingCustomer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-white hover:bg-yellow-500"
              }`}
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </div>

        {editingCustomer && (
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <CustomerForm
              editingCustomer={editingCustomer}
              onSuccess={handleEditSuccess}
              onCancelEdit={() => setEditingCustomer(null)}
            />
          </div>
        )}
      </div>

      {/* 案件 & タスク */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 案件 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            関連案件一覧
          </h2>

          {sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      案件名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      メモ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4">{sale.dealName}</td>
                      <td className="px-6 py-4">
                        ¥{sale.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={sale.status}
                          config={SALES_STATUS}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{sale.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              この顧客に関連する案件はありません。
            </p>
          )}
        </div>

        {/* タスク */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            関連タスク一覧
          </h2>

          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      タスク名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      期日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium">
                      説明
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-6 py-4">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={task.status}
                          config={TASK_STATUS}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{task.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              この顧客に関連するタスクはありません。
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ActivityTimeline
          type="customer"
          targetId={customerId}
          refreshKey={refreshTrigger}
        />
      </div>

      <div className="mt-8">
        <Link to="/customers" className="text-blue-600 hover:underline">
          &larr; 顧客リストに戻る
        </Link>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
