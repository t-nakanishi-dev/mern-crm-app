// pages/EditCustomer.jsx

import { useState } from "react";
import api from "../utils/api";

const EditCustomer = ({ id, currentName }) => {
  const [name, setName] = useState(currentName);

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/customers/${id}`, { name });
      console.log("Updated:", res.data);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleUpdate}>Update</button>
    </>
  );
};

export default EditCustomer;
