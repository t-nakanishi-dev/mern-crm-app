// src/utils/mergeUserData.js
import axios from "axios";

/**
 * FirebaseユーザーとMongoDBユーザー情報を統合する関数
 * @param {object} firebaseUser - Firebaseのユーザーオブジェクト
 * @returns {object|null}
 */
export const fetchAndMergeUserData = async (firebaseUser) => {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await axios.get("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const mongoUser = response.data.user;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      ...mongoUser,
    };
  } catch (error) {
    console.error("ユーザー統合データの取得に失敗:", error);
    return null;
  }
};
