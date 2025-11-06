// src/components/TaskDetails.jsx

import React from "react";
import ActivityTimeline from "./ActivityTimeline";

// ✅ 追加: refreshKeyプロップを受け取る
const TaskDetails = ({
  task,
  users,
  customers,
  sales,
  onClose,
  refreshKey,
}) => {
  if (!task) return null;

  const assignedUser = users.find((u) => u.uid === task.assignedTo);
  const customer = customers.find((c) => c._id === task.customer);
  const sale = sales.find((s) => s._id === task.sales);

  const getStatusText = (status) => {
    switch (status) {
      case "todo":
        return "未着手";
      case "in_progress":
        return "進行中";
      case "done":
        return "完了";
      default:
        return status;
    }
  };

  const formatDueDate = (date) => {
    if (!date) return "未定";
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-semibold">説明:</span>
          <p className="whitespace-pre-line">{task.description}</p>
        </div>
        <div>
          <span className="font-semibold">ステータス:</span>{" "}
          {getStatusText(task.status)}
        </div>
        <div>
          <span className="font-semibold">担当者:</span>{" "}
          {assignedUser?.displayName || "未割り当て"}
        </div>
        <div>
          <span className="font-semibold">期日:</span>{" "}
          {formatDueDate(task.dueDate)}
        </div>
        <div>
          <span className="font-semibold">顧客:</span>{" "}
          {customer?.companyName || customer?.name || "未指定"}
        </div>
        <div>
          <span className="font-semibold">案件:</span>{" "}
          {sale?.dealName || "未指定"}
        </div>
      </div>

      <div className="mt-8">
        <ActivityTimeline
          type="task"
          targetId={task._id}
          // ✅ 修正: task._id ではなく、新しいrefreshKeyを渡す
          refreshKey={refreshKey}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
