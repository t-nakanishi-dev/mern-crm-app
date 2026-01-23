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
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { isAuthReady, user: currentUser } = useAuth();

  const fetchInitialData = async () => {
    try {
      const [fetchedUsers, fetchedTasks, fetchedCustomers, fetchedSales] =
        await Promise.all([
          authorizedRequest("get", "/users/basic"),
          authorizedRequest("get", "/tasks"),
          authorizedRequest("get", "/customers"),
          authorizedRequest("get", "/sales"),
        ]);

      setUsers(fetchedUsers.users);
      setTasks(fetchedTasks);
      setCustomers(fetchedCustomers);
      setSales(fetchedSales);
    } catch (err) {
      console.error(err);
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthReady) fetchInitialData();
  }, [isAuthReady]);

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    );
    setTasksRefreshKey((prev) => prev + 1);
  };

  const handleOpenFormModal = (task = null) => {
    setSelectedTask(task);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setSelectedTask(null);
    setIsFormModalOpen(false);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        const updated = await authorizedRequest(
          "put",
          `/tasks/${selectedTask._id}`,
          taskData,
        );
        handleTaskUpdated(updated);
      } else {
        const created = await authorizedRequest("post", "/tasks", taskData);
        setTasks((prev) => [...prev, created]);
      }
      handleCloseFormModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      await authorizedRequest("delete", `/tasks/${selectedTask._id}`);
      setTasks((prev) => prev.filter((task) => task._id !== selectedTask._id));
      setIsConfirmModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
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
          className="px-6 py-2 bg-blue-600 text-white rounded"
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
        onDelete={(task) => {
          setSelectedTask(task);
          setIsConfirmModalOpen(true);
        }}
        onViewDetails={handleViewDetails}
        onTaskUpdated={handleTaskUpdated}
      />

      <TaskForm
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSaveTask}
        task={selectedTask}
        users={users}
        customers={customers}
        sales={sales}
      />

      <CustomModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <TaskDetails
          task={selectedTask}
          users={users}
          customers={customers}
          sales={sales}
          refreshKey={tasksRefreshKey}
        />
      </CustomModal>

      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <div className="p-6">
          <p className="mb-4">
            タスク「{selectedTask?.title}」を削除しますか？
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              キャンセル
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 bg-red-600 text-white rounded"
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
