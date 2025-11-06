// src/utils/salesApi.js

import api from "./api";

export const getSales = async () => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    console.error(
      "案件データの取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};
