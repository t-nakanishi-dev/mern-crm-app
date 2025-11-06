// src/utils/activityApi.js
import api from "./api";

// 顧客に紐づくアクティビティ取得
export const getCustomerActivities = async (customerId) => {
  try {
    const response = await api.get(`/activities/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(
      `顧客ID ${customerId} のアクティビティ取得に失敗しました:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// 案件に紐づくアクティビティ取得
export const getSalesActivities = async (saleId) => {
  try {
    const response = await api.get(`/activities/sales/${saleId}`);
    return response.data;
  } catch (error) {
    console.error(
      `案件ID ${saleId} のアクティビティ取得に失敗しました:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
