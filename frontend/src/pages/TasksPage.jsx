// src/pages/TasksPage.jsx

import React, { useState, useEffect } from "react";
import { authorizedRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskDetails from "../components/TaskDetails";
import CustomModal from "../components/CustomModal";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0); // ✅ アクティビティ更新用キー

  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { isAuthReady, user: currentUser } = useAuth();

  const fetchInitialData = async () => {
    console.log("📝 TasksPage fetchInitialData 開始");
    try {
      const [fetchedUsers, fetchedTasks, fetchedCustomers, fetchedSales] =
        await Promise.all([
          authorizedRequest("get", "/users/basic"),
          authorizedRequest("get", "/tasks"),
          authorizedRequest("get", "/customers"),
          authorizedRequest("get", "/sales"),
        ]);

      console.log("✅ fetchInitialData 結果:", {
        fetchedUsers,
        fetchedTasks,
        fetchedCustomers,
        fetchedSales,
      });

      setUsers(fetchedUsers.users);
      setTasks(fetchedTasks);
      setCustomers(fetchedCustomers);
      setSales(fetchedSales);
    } catch (err) {
      console.error("❌ fetchInitialData エラー:", err);
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthReady) {
      console.log("📝 isAuthReady true -> fetchInitialData");
      fetchInitialData();
    }
  }, [isAuthReady]);

  const handleOpenFormModal = (task = null) => {
    console.log("📝 handleOpenFormModal task:", task);
    setSelectedTask(task);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    console.log("📝 handleCloseFormModal");
    setSelectedTask(null);
    setIsFormModalOpen(false);
  };

  const handleSaveTask = async (taskData) => {
    console.log("📝 handleSaveTask taskData:", taskData);
    try {
      if (selectedTask) {
        console.log("📝 Updating existing task:", selectedTask._id);
        await authorizedRequest("put", `/tasks/${selectedTask._id}`, taskData);
      } else {
        console.log("📝 Creating new task");
        await authorizedRequest("post", "/tasks", taskData);
      }
      await fetchInitialData();
      handleCloseFormModal();
      setTasksRefreshKey((prevKey) => prevKey + 1);
      console.log("✅ Task saved, tasksRefreshKey:", tasksRefreshKey + 1);
    } catch (err) {
      console.error("❌ handleSaveTask エラー:", err);
    }
  };

  const handleViewDetails = (task) => {
    console.log("📝 handleViewDetails task:", task);
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    console.log("📝 handleCloseDetailsModal");
    setSelectedTask(null);
    setIsDetailsModalOpen(false);
  };

  const handleOpenDeleteConfirm = (task) => {
    console.log("📝 handleOpenDeleteConfirm task:", task);
    setSelectedTask(task);
    setIsConfirmModalOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    console.log("📝 handleCloseDeleteConfirm");
    setSelectedTask(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteTask = async () => {
    try {
      if (selectedTask) {
        console.log("📝 handleDeleteTask task:", selectedTask._id);
        await authorizedRequest("delete", `/tasks/${selectedTask._id}`);
        await fetchInitialData();
        handleCloseDeleteConfirm();
      }
    } catch (err) {
      console.error("❌ handleDeleteTask エラー:", err);
    }
  };

  if (loading || !isAuthReady)
    return <p className="text-center mt-20">データを読み込み中...</p>;

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">タスク一覧</h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleOpenFormModal()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新規タスク追加
        </button>
      </div>
      <TaskList
        tasks={tasks}
        users={users}
        customers={customers}
        sales={sales}
        currentUserUid={currentUser?.uid}
        onEdit={handleOpenFormModal}
        onDelete={handleOpenDeleteConfirm}
        onViewDetails={handleViewDetails}
      />

      {/* タスクフォームモーダル */}
      <TaskForm
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSaveTask}
        task={selectedTask}
        users={users}
        customers={customers}
        sales={sales}
      />

      {/* タスク詳細モーダル */}
      <CustomModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      >
        <TaskDetails
          task={selectedTask}
          users={users}
          customers={customers}
          sales={sales}
          onClose={handleCloseDetailsModal}
          refreshKey={tasksRefreshKey}
        />
      </CustomModal>

      {/* 削除確認モーダル */}
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">タスク削除の確認</h2>
          <p className="mb-6">
            タスク「{selectedTask?.title}」を本当に削除しますか？
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCloseDeleteConfirm}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              キャンセル
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default TasksPage;
