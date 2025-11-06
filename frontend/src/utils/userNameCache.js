// src/utils/userNameCache.js
import axios from "axios";

/**
 * UID からユーザー名を取得し、キャッシュする簡易関数
 */

const cache = {}; // { uid: displayName }

export const fetchUserName = async (uid, token) => {
  if (!uid) return "不明";

  // キャッシュにあれば即返す
  if (cache[uid]) return cache[uid];

  try {
    const response = await axios.get(`http://localhost:5000/api/users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const displayName = response.data?.displayName || "不明";

    // キャッシュに保存
    cache[uid] = displayName;

    return displayName;
  } catch (err) {
    console.error("ユーザー名取得エラー:", err);
    return "不明";
  }
};
