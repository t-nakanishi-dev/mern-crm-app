// src/constants/statusConfig.js

// タスクステータス
export const TASK_STATUS = {
  todo: {
    label: "未着手",
    color: "bg-red-500",
  },
  in_progress: {
    label: "進行中",
    color: "bg-yellow-500",
  },
  done: {
    label: "完了",
    color: "bg-green-500",
  },
};

// 案件ステータス
export const SALES_STATUS = {
  見込み: {
    label: "見込み",
    color: "bg-gray-500",
  },
  提案中: {
    label: "提案中",
    color: "bg-blue-500",
  },
  交渉中: {
    label: "交渉中",
    color: "bg-yellow-500",
  },
  契約済: {
    label: "契約済",
    color: "bg-green-600",
  },
  失注: {
    label: "失注",
    color: "bg-red-500",
  },
};
