// src/utils/taskApi.js

import api from "./api";

/**
 * タスク一覧取得
 */
export const getTasks = async () => {
  try {
    console.log("📝 getTasks called");
    const response = await api.get("/tasks");
    console.log(`✅ getTasks response: ${response.data.length} tasks fetched`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの取得に失敗しました:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * タスク作成
 */
export const createTask = async (taskData) => {
  try {
    console.log("📝 createTask called with:", taskData);
    const response = await api.post("/tasks", taskData);
    console.log("✅ Task created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの作成に失敗しました:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * タスク更新
 */
export const updateTask = async (taskId, updateData) => {
  try {
    console.log(`📝 updateTask called for taskId: ${taskId}`, updateData);
    const response = await api.put(`/tasks/${taskId}`, updateData);
    console.log("✅ Task updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクの更新に失敗しました:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * タスク削除
 */
export const deleteTask = async (taskId) => {
  try {
    console.log(`📝 deleteTask called for taskId: ${taskId}`);
    await api.delete(`/tasks/${taskId}`);
    console.log(`✅ Task deleted: ${taskId}`);
  } catch (error) {
    console.error(
      "❌ タスクの削除に失敗しました:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * タスクのアクティビティ取得
 */
export const getTaskActivities = async (taskId) => {
  try {
    console.log(`📝 getTaskActivities called for taskId: ${taskId}`);
    const response = await api.get(`/activities/tasks/${taskId}`);
    console.log(
      `✅ ${response.data.length} activities fetched for taskId: ${taskId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ タスクのアクティビティ取得に失敗しました:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
