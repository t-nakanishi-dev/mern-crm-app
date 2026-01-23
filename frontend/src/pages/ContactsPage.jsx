// src/pages/ContactsPage.jsx

import { useState, useEffect } from "react";
import { authorizedRequest } from "../services/authService";
import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";

const ContactsPage = () => {
  const [editingContact, setEditingContact] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showNewForm, setShowNewForm] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authorizedRequest("get", "/users/basic");
        const usersData = res.users || [];
        setUsers(usersData);
        console.log("✅ Users取得成功:", usersData);
      } catch (err) {
        console.error("❌ Users取得失敗:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSuccess = () => {
    setEditingContact(null);
    setShowNewForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setEditingContact(null);
    setShowNewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">問い合わせ管理</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowNewForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          新規問い合わせ登録
        </button>
      </div>

      {(editingContact || showNewForm) && (
        <ContactForm
          contact={editingContact}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          users={users} 
        />
      )}

      <div>
        <ContactList
          onEdit={setEditingContact}
          refreshTrigger={refreshTrigger}
          users={users} // ✅ 配列をそのまま渡す
        />
      </div>
    </div>
  );
};

export default ContactsPage;
