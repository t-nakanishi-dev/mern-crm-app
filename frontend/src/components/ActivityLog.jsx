// src/components/ActivityLog.jsx

import React, { useState, useEffect, useCallback } from "react";
import { authorizedRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const ActivityLog = () => {
  // アクティビティのステート管理
  // ここでは全アクティビティを保持します
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ページネーションのステート
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 1ページあたりの表示件数を設定

  // AuthContextからユーザー情報とトークンを取得
  const { user, token, isAdmin } = useAuth();

  /**
   * APIからアクティビティ履歴を非同期で取得する関数 (全件取得)
   */
  const fetchAllActivities = useCallback(async () => {
    if (!isAdmin || !token) {
      console.log(
        "アクティビティログ取得スキップ：管理者権限またはトークンがありません。"
      );
      setLoading(false);
      setError("管理者権限が必要です。");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // バックエンドがページネーションに対応していないことを想定し、全件取得
      const res = await authorizedRequest(
        "GET",
        `/activities/all`,
        null,
        token
      );

      // レスポンスが配列であることを確認
      if (Array.isArray(res)) {
        // updatedAtで降順ソート
        const sortedActivities = res.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setAllActivities(sortedActivities);
      } else {
        // 想定外のレスポンス形式
        console.error("APIレスポンスの形式が不正です:", res);
        setError("アクティビティのデータ形式に問題があります。");
      }
      setLoading(false);
    } catch (err) {
      console.error("アクティビティの取得エラー:", err);
      setError("アクティビティの取得に失敗しました。");
      setLoading(false);
    }
  }, [isAdmin, token]);

  // コンポーネントがマウントされた時、および認証状態が変化した時に実行
  useEffect(() => {
    if (isAdmin && token) {
      fetchAllActivities();
    }
  }, [fetchAllActivities, isAdmin, token]);

  // 現在のページに表示するアクティビティを計算
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = allActivities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(allActivities.length / itemsPerPage);

  // ページ変更ハンドラ
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * タイムスタンプをフォーマットするヘルパー関数
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString();
    }
    return "日付不明";
  };

  if (loading) {
    return (
      <div className="text-center mt-8 text-gray-600">
        全てのアクティビティ履歴を読み込み中...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-sans max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        アクティビティログ (全活動履歴)
      </h2>
      {currentActivities.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentActivities.map((activity, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <p className="text-xs text-gray-500">
                  {formatDate(activity.updatedAt)}
                </p>
                <p className="text-gray-800 font-medium">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">ユーザーID:</span>{" "}
                  {activity.userId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">対象モデル:</span>{" "}
                  {activity.targetModel} ({activity.targetId})
                </p>
              </div>
            ))}
          </div>
          {/* ページネーションコントロール */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            <span className="text-gray-700">
              ページ {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">アクティビティ履歴はありません。</p>
      )}
    </div>
  );
};

export default ActivityLog;
