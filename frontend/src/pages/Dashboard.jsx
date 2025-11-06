// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/authService";
import StatusPieChart from "../components/StatusPieChart";
import CustomerBarChart from "../components/CustomerBarChart";

const Dashboard = () => {
  const { user, isAuthReady } = useAuth();
  const [summary, setSummary] = useState(null);
  const [statusSummary, setStatusSummary] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [upcomingDeals, setUpcomingDeals] = useState([]); // ✅ 新しいステートを追加
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user || !isAuthReady) {
        setLoading(false);
        return;
      }

      try {
        const data = await authorizedRequest("GET", "/sales/summary");
        setSummary(data);
        setStatusSummary(data.statusSummary);
        setCustomerSales(data.customerSales);
        setUpcomingDeals(data.upcomingDeals); // ✅ 取得したデータをステートにセット
        setError(null);
      } catch (err) {
        console.error("サマリーデータの取得に失敗しました:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user, isAuthReady]);

  if (loading) {
    return <div className="text-center mt-8">読み込み中...</div>;
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }
  if (!summary) {
    return <div className="text-center mt-8">サマリーデータがありません。</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">総売上</h2>
          <p className="text-4xl font-bold text-blue-600">
            ¥{summary.totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">総案件数</h2>
          <p className="text-4xl font-bold text-green-600">
            {summary.totalDeals} 件
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            平均案件金額
          </h2>
          <p className="text-4xl font-bold text-purple-600">
            ¥{Math.round(summary.averageDealValue).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 案件ステータス円グラフ */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
          <div className="w-full h-full max-w-md">
            {statusSummary.length > 0 ? (
              <StatusPieChart data={statusSummary} />
            ) : (
              <p className="text-center text-gray-500">
                案件データがありません。
              </p>
            )}
          </div>
        </div>

        {/* 顧客別売上棒グラフ */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
          <div className="w-full h-full">
            {customerSales.length > 0 ? (
              <CustomerBarChart data={customerSales} />
            ) : (
              <p className="text-center text-gray-500">
                顧客別売上データがありません。
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ 期限が近い案件の表示部分を追加 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <span
            role="img"
            aria-label="calendar"
            className="mr-2 text-yellow-500"
          >
            ⚠️
          </span>
          期限が近い案件 (7日以内)
        </h2>
        {upcomingDeals.length > 0 ? (
          <ul className="space-y-2">
            {upcomingDeals.map((deal) => (
              <li key={deal._id} className="text-red-600">
                <span className="font-semibold">{deal.dealName}</span> (期限:{" "}
                {new Date(deal.dueDate).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">期限が近い案件はありません。</p>
        )}
      </div>

      {/* 案件ステータスごとの内訳表示部分 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          案件ステータスごとの内訳
        </h2>
        {statusSummary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusSummary.map((item) => (
              <div
                key={item.status}
                className="p-4 border border-gray-200 rounded-md"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  {item.status}
                </h3>
                <p className="text-gray-600">
                  案件数: <span className="font-semibold">{item.count}</span> 件
                </p>
                <p className="text-gray-600">
                  総金額:{" "}
                  <span className="font-semibold">
                    ¥{item.totalAmount.toLocaleString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            ステータス別の案件データがありません。
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
