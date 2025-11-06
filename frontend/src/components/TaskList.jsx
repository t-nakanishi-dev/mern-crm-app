// src/components/TaskList.jsx

import React from "react";
import TaskCard from "./TaskCard";

const TaskList = ({
  tasks,
  users,
  customers,
  sales,
  onEdit,
  onDelete,
  currentUserUid,
  onTaskAction,
  onViewDetails,
}) => {
  // 担当者名を取得するヘルパー関数
  const getUserName = (userId) => {
    const user = users.find((u) => u.uid === userId);
    return user ? user.displayName : "不明な担当者";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            assignedToName={getUserName(task.assignedTo)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
            users={users}
            customers={customers}
            sales={sales}
            currentUserUid={currentUserUid}
            onTaskAction={onTaskAction}
            onViewDetails={() => onViewDetails(task)}
          />
        ))
      ) : (
        <p className="text-gray-500 italic">タスクはありません。</p>
      )}
    </div>
  );
};

export default TaskList;
