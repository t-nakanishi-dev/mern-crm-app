// pages/CreateCustomer.jsx

import { useState } from "react";
import api from "../utils/api";

const CreateCustomer = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customers", { name });
      console.log("Created:", res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Customer Name"
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateCustomer;
