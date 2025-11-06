// components/DeleteButton.jsx

import api from "../utils/api";

const DeleteButton = ({ id }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${id}`);
      console.log("Deleted");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteButton;
