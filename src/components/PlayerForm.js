import React, { useState } from "react";
import axios from "axios";
import styles from "./AuctionForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlayerForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [age, setAge] = useState("");
  const [sno, setSno] = useState("");
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playerData = {
      name,
      type,
      price,
      category,
      specialization,
      age,
      sno,
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_API + "/api/players",
        playerData
      );
      console.log("Player added:", response.data);
      toast.success("Player data saved", {
        position: "top-right",
      });
      // Optionally reset form fields here
    } catch (error) {
      toast.error("Player data save failed", {
        position: "top-right",
      });
      console.error("Error adding player:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Player</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* <input
          type="text"
          placeholder="Type (e.g., Local, Foreign)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        /> */}
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="indian">Indian</option>
          <option value="foreigner">Foreigner</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="capped">capped</option>
          <option value="uncapped">uncapped</option>
        </select>
        <input
          type="text"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="S.No"
          value={sno}
          onChange={(e) => setSno(e.target.value)}
          required
        />

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        >
          <option value="">Select Specialization</option>
          <option value="wicketKeeper">Wicket-Keeper</option>
          <option value="batsman">Batsman</option>
          <option value="AllRounder">All Rounder</option>
          <option value="Bowler">Bowler</option>
        </select>
        <button type="submit">Add Player</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PlayerForm;
