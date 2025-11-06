// src/pages/EditContactForm.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import { authorizedRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const EditContactForm = () => {
  const { id } = useParams(); // 問い合わせID
  const { token } = useAuth();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await authorizedRequest(
          "GET",
          `/api/contacts/${id}`,
          token
        );
        setContact(res);
      } catch (err) {
        console.error("取得失敗:", err);
        setError("問い合わせデータの取得に失敗しました");
      }
    };

    fetchContact();
  }, [id, token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!contact) return <p>読み込み中...</p>;

  return (
    <ContactForm
      customerId={contact.customerId}
      editingContact={contact}
      onSuccess={() => navigate("/contacts")}
    />
  );
};

export default EditContactForm;
