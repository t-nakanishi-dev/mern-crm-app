// src/utils/taskApi.js

import api from "./api";

const tasksApi = api.create({
  baseURL: `${api.defaults.baseURL}/tasks`,
});

export const getTasks = async () => {
  try {
    console.log("📝 getTasks called");
    const response = await api.get("/tasks");
    console.log(`✅ getTasks response: ${response.data.length} tasks fetched`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    console.log("📝 createTask called with:", taskData);
    const response = await tasksApi.post("/", taskData);
    console.log("✅ Task created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの作成に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTask = async (taskId, updateData) => {
  try {
    console.log(`📝 updateTask called for taskId: ${taskId}`, updateData);
    const response = await tasksApi.put(`/${taskId}`, updateData);
    console.log("✅ Task updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの更新に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    console.log(`📝 deleteTask called for taskId: ${taskId}`);
    await tasksApi.delete(`/${taskId}`);
    console.log(`✅ Task deleted: ${taskId}`);
  } catch (error) {
    console.error(
      "❌ タスクの削除に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getTaskActivities = async (taskId) => {
  try {
    console.log(`📝 getTaskActivities called for taskId: ${taskId}`);
    const response = await api.get(`/activities/tasks/${taskId}`);
    console.log(
      `✅ ${response.data.length} activities fetched for taskId: ${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクのアクティビティ取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};
