// src/components/TaskList.jsx

import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import api from "../utils/api";

const TaskList = ({
  tasks,
  users,
  customers,
  sales,
  onDelete,
  currentUserUid,
  onViewDetails,
  onTaskUpdated,
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = async (task) => {
    try {
      const response = await api.get(`/tasks/${task._id}`);
      setSelectedTask(response.data.task);
    } catch {
      setSelectedTask(task);
    } finally {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await api.put(`/tasks/${selectedTask._id}`, formData);
      onTaskUpdated(response.data);
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました");
    } finally {
      setIsFormOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => handleEdit(task)}
            onDelete={() => onDelete(task)}
            users={users}
            currentUserUid={currentUserUid}
            onViewDetails={() => onViewDetails(task)}
          />
        ))}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
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
