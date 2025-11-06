// src/utils/customerApi.js

import api from "./api";

export const getCustomers = async () => {
  try {
    const response = await api.get("/customers");
    return response.data;
  } catch (error) {
    console.error(
      "顧客データの取得に失敗しました:",
      error.response?.data || error.message
    );
    throw error;
  }
};
