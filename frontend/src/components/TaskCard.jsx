// src/components/TaskCard.jsx

import React from "react";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  currentUserUid,
  onViewDetails,
}) => {
  // =============================
  // 表示用データ（populate前提）
  // =============================

  const customerName = task.customer
    ? task.customer.companyName || task.customer.name || "不明な顧客"
    : "顧客なし";

  const saleName = task.sales ? task.sales.dealName : "案件なし";

  const assignedToName = task.assignedToUser
    ? task.assignedToUser.displayName
    : "不明な担当者";

  // =============================
  // 権限制御
  // =============================

  // 自分に割り当てられたタスクかどうか
  const isAssignedToCurrentUser =
    String(task.assignedTo) === String(currentUserUid);

  // 自分が作成したタスクかどうか
  const isCreatedByCurrentUser =
    String(task.createdBy) === String(currentUserUid);

  // =============================
  // 表示用マッピング
  // =============================

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

  // =============================
  // JSX
  // =============================

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between h-full transform transition-transform duration-200 hover:scale-105">
      {/* 上部 */}
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
          <div>
            <span>作成者: {task.createdByUser?.displayName || "不明"}</span>
          </div>

          <div>
            <span>担当者: {assignedToName}</span>
          </div>
          <div>
            <span>
              期限:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("ja-JP")
                : "期限なし"}
            </span>
          </div>
          <div>
            <span>顧客: {customerName}</span>
          </div>
          <div>
            <span>案件: {saleName}</span>
          </div>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 justify-end items-center">
        <button
          onClick={() => onViewDetails(task)}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors py-2 px-3 rounded-full text-sm font-medium"
        >
          詳細
        </button>

        {/* 自分が作成したタスクのみ編集・削除可能 */}
        {isCreatedByCurrentUser && (
          <>
            <button
              onClick={() => onEdit(task)}
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors py-2 px-3 rounded-full text-sm font-medium"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(task)}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors py-2 px-3 rounded-full text-sm font-medium"
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
