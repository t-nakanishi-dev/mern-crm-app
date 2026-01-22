// src/components/Kanban/KanbanBoard.jsx
import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { authorizedRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const STATUSES = ["todo", "in_progress", "done"]; // タスクのstatusに合わせる

// Card コンポーネント
const Card = memo(function Card({ task, provided, snapshot }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white rounded-lg p-4 shadow-md transition-all duration-150 cursor-pointer ${
        snapshot.isDragging ? "shadow-lg scale-105" : ""
      }`}
    >
      <Link
        to={`/tasks/${task._id}`}
        className="block text-inherit no-underline"
      >
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {task.title}
        </h3>
        <p className="text-sm text-gray-600">
          担当: {task.assignedName || "未割り当て"}
        </p>
        {task.companyName && (
          <p className="text-sm text-gray-600">会社: {task.companyName}</p>
        )}
        {task.dueDate && (
          <p className="text-sm text-gray-500">
            期限: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </Link>
    </div>
  );
});

// Column コンポーネント
const Column = memo(function Column({ status, items }) {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-100 rounded-xl p-4 w-72 min-w-72 flex flex-col gap-3 h-fit max-h-[calc(100vh-100px)] overflow-y-auto transition-colors duration-200 ${
            snapshot.isDraggingOver ? "bg-gray-200" : ""
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2 pb-2 border-b-2 border-gray-200">
            {status === "todo"
              ? "未着手"
              : status === "in_progress"
                ? "進行中"
                : "完了"}
          </h2>

          {items && items.length > 0 ? (
            items.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <Card task={task} provided={provided} snapshot={snapshot} />
                )}
              </Draggable>
            ))
          ) : (
            <div className="text-gray-500 italic text-center p-4">
              タスクがありません
            </div>
          )}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

const KanbanBoard = () => {
  const { user, token, isAuthReady, user: currentUser } = useAuth();
  const [pipelines, setPipelines] = useState(() =>
    STATUSES.reduce((acc, s) => ({ ...acc, [s]: [] }), {}),
  );
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({}); // uid → displayName
  const [customersMap, setCustomersMap] = useState({}); // assignedUserId → companyName
  const didInitialLoadRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🔹 ユーザー情報取得
  const loadUsers = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await authorizedRequest("GET", "/users/basic");
      const map = {};
      res.users.forEach((u) => {
        map[u.uid] = u.displayName || u.email;
      });
      if (isMountedRef.current) setUsersMap(map);
      console.log("ユーザー一覧:", map);
    } catch (err) {
      console.error("ユーザー取得エラー:", err);
    }
  }, [user, token]);

  // 🔹 顧客情報取得（管理者用全件）
  const loadCustomers = useCallback(async () => {
    if (!user || !token) return;
    try {
      const res = await authorizedRequest("GET", "/customers/all");
      const map = {};
      res.customers.forEach((c) => {
        map[c.assignedUserId] = c.companyName || "";
      });
      if (isMountedRef.current) setCustomersMap(map);
      console.log("顧客一覧:", map);
    } catch (err) {
      console.error("顧客取得エラー:", err);
    }
  }, [user, token]);

  // 🔹 タスク取得
  const loadTasks = useCallback(async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const tasks = await authorizedRequest("GET", "/tasks");

      // タスクに assignedName と companyName を追加
      const tasksWithNames = tasks.map((task) => ({
        ...task,
        assignedName: usersMap[task.assignedTo] || "未割り当て",
        companyName: customersMap[task.assignedTo] || "",
      }));

      const newPipelines = STATUSES.reduce(
        (acc, s) => ({ ...acc, [s]: [] }),
        {},
      );
      tasksWithNames.forEach((task) => {
        const status = task.status || "todo";
        newPipelines[status].push(task);
      });
      if (isMountedRef.current) {
        setPipelines(newPipelines);
        setLoading(false);
      }
      console.log("取得タスク:", tasksWithNames);
    } catch (err) {
      console.error("タスク取得エラー:", err);
      if (isMountedRef.current) setLoading(false);
    }
  }, [user, token, usersMap, customersMap]);

  useEffect(() => {
    if (!isAuthReady || !user || !token) return;
    if (didInitialLoadRef.current) return;
    didInitialLoadRef.current = true;
    loadUsers();
    loadCustomers();
  }, [isAuthReady, user, token, loadUsers, loadCustomers]);

  useEffect(() => {
    if (
      Object.keys(usersMap).length === 0 ||
      Object.keys(customersMap).length === 0
    )
      return;
    loadTasks();
  }, [usersMap, customersMap, loadTasks]);

  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const sourceStatus = source.droppableId;
      const destStatus = destination.droppableId;

      setPipelines((prev) => {
        const fromList = [...(prev[sourceStatus] || [])];
        const toList = [...(prev[destStatus] || [])];
        const [moved] = fromList.splice(source.index, 1);
        if (!moved) return prev;
        toList.splice(destination.index, 0, moved);
        return { ...prev, [sourceStatus]: fromList, [destStatus]: toList };
      });

      try {
        await authorizedRequest("PUT", `/tasks/${draggableId}`, {
          status: destStatus,
        });
      } catch (err) {
        console.error("タスクステータス更新エラー:", err);
        loadTasks(); // エラー時のみ再取得
      }
    },
    [loadTasks],
  );

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">タスクボード</h1>
        <div className="flex gap-6 overflow-x-auto p-4">
          {STATUSES.map((s) => (
            <div key={s} className="w-72 min-w-72">
              <div className="bg-gray-200 h-8 rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">タスクボード</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto p-4">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              items={pipelines[status] || []}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
