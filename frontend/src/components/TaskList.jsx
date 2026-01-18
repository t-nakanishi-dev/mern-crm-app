// src/components/TaskList.jsx

import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import api from "../utils/api"; // ← これを必ずインポート！

const TaskList = ({
  tasks,
  users,
  customers,
  sales,
  onDelete,
  currentUserUid,
  onTaskAction,
  onViewDetails,
  onTaskUpdated,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 編集ボタン押下時 → populate済みのデータを取得
  const handleEdit = async (task) => {
    try {
      // ★ここが重要★: baseURLが http://localhost:5000/api なので、パスは /tasks/:id でOK
      const response = await api.get(`/tasks/${task._id}`);
      const populatedTask = response.data.task; // { task, activities } の task 部分

      console.log("編集用populate済みタスク:", populatedTask);

      setSelectedTask(populatedTask);
      setIsFormOpen(true);
    } catch (error) {
      console.error("タスク詳細取得エラー:", error);
      alert("タスク詳細の取得に失敗しました。元のデータで編集します。");
      setSelectedTask(task);
      setIsFormOpen(true);
    }
  };

  // タスク更新処理（taskApi.js の updateTask を利用）
  const handleSubmit = async (formData) => {
    try {
      // src/utils/taskApi.js から import している前提
      await updateTask(selectedTask._id, formData);

      alert("タスクを更新しました");

      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error("タスク更新エラー:", error);
      alert("更新に失敗しました");
    } finally {
      setIsFormOpen(false);
      setSelectedTask(null);
    }
  };

  // 担当者名取得ヘルパー
  const getUserName = (userId) => {
    const user = users.find((u) => u.uid === userId);
    return user ? user.displayName : "不明な担当者";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => handleEdit(task)}
              onDelete={() => onDelete(task)}
              users={users}
              currentUserUid={currentUserUid}
              onTaskAction={onTaskAction}
              onViewDetails={() => onViewDetails(task)}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">タスクはありません。</p>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmit}
        task={selectedTask}
        users={users}
        customers={customers}
        sales={sales}
      />
    </>
  );
};

export default TaskList;
