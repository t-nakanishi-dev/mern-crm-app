// src/components/TaskCard.jsx

import React from "react";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  customers,
  sales,
  currentUserUid,
  onTaskAction,
  onViewDetails,
  assignedToName, // 追加済み
}) => {
  const customerName =
    customers.find((c) => String(c._id) === String(task.customer))?.name ||
    "顧客なし";

  const saleName =
    sales.find((s) => s._id === task.sales)?.dealName || "案件なし";

  const isAssignedToCurrentUser =
    String(task.assignedTo) === String(currentUserUid);

  const statusText = {
    todo: "未着手",
    in_progress: "進行中",
    done: "完了",
  };

  const statusColors = {
    todo: "bg-red-500",
    in_progress: "bg-yellow-500",
    done: "bg-green-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between h-full transform transition-transform duration-200 hover:scale-105">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 break-words pr-2">
            {task.title}
          </h3>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full text-white whitespace-nowrap ${
              statusColors[task.status]
            }`}
          >
            {statusText[task.status]}
          </span>
        </div>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
          {task.description}
        </p>

        <div className="space-y-2 text-gray-700 text-sm">
          <div className="flex items-center">
            <span>担当者: {assignedToName || "不明"}</span>
          </div>
          <div className="flex items-center">
            <span>
              期限:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("ja-JP")
                : "期限なし"}
            </span>
          </div>
          <div className="flex items-center">
            <span>顧客: {customerName}</span>
          </div>
          <div className="flex items-center">
            <span>案件: {saleName}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end items-center">
        <button
          onClick={() => onViewDetails(task)}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors py-2 px-3 rounded-full text-sm font-medium flex items-center gap-1"
        >
          詳細
        </button>

        {isAssignedToCurrentUser && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors py-2 px-3 rounded-full text-sm font-medium flex items-center gap-1"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(task)}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors py-2 px-3 rounded-full text-sm font-medium flex items-center gap-1"
            >
              削除
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
