// src/components/TaskForm.jsx
import React, { useState, useEffect } from "react";
import CustomModal from "./CustomModal";

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  users,
  customers,
  sales,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [customer, setCustomer] = useState("");
  const [salesId, setSalesId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [status, setStatus] = useState("todo");

  // フォーム初期化
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setCustomer("");
    setSalesId("");
    setDueDate("");
    setStatus("todo");
    setFilteredSales([]);
  };

  /**
   * 🔹 編集時：task をフォームに反映
   * populate / 非populate 両対応
   */
  useEffect(() => {
    if (!task) {
      resetForm();
      return;
    }

    const customerId =
      task.customer && typeof task.customer === "object"
        ? task.customer._id
        : task.customer || "";

    const salesIdFromTask =
      task.sales && typeof task.sales === "object"
        ? task.sales._id
        : task.sales || "";

    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "todo");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setAssignedTo(task.assignedToUser?.uid || task.assignedTo || "");
    setCustomer(customerId);
    setSalesId(salesIdFromTask);
  }, [task]);

  /**
   * 🔹 顧客選択時：案件をフィルタリング
   * 編集時は salesId を消さない
   */
  useEffect(() => {
    if (!customer || !Array.isArray(sales)) {
      setFilteredSales([]);
      if (!task) setSalesId("");
      return;
    }

    const relatedSales = sales.filter(
      (s) => String(s.customerId) === String(customer)
    );

    setFilteredSales(relatedSales);

    // 編集時：現在の salesId が有効なら維持
    if (
      salesId &&
      relatedSales.some((s) => String(s._id) === String(salesId))
    ) {
      return;
    }

    // 新規作成時のみリセット
    if (!task) {
      setSalesId("");
    }
  }, [customer, sales]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      assignedTo,
      customer,
      sales: salesId || null,
      dueDate,
      status,
    };

    console.log("📝 TaskForm handleSubmit:", formData);

    onSubmit(formData);
    resetForm();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {task ? "タスクを編集" : "新規タスク作成"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <textarea
            placeholder="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="todo">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="done">完了</option>
          </select>

          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">顧客を選択</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName || c.name}
              </option>
            ))}
          </select>

          <select
            value={salesId}
            onChange={(e) => setSalesId(e.target.value)}
            className="border p-2 w-full"
            disabled={!customer}
          >
            <option value="">案件を選択（任意）</option>
            {filteredSales.map((s) => (
              <option key={s._id} value={s._id}>
                {s.dealName}
              </option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">担当者を選択</option>
            {users?.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.displayName || user.email || "不明"}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 w-full"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default TaskForm;
