// src/components/TeamForm.js

import React, { useState } from "react";
import axios from "axios";

const TeamForm = () => {
  const [team, setTeam] = useState("");
  const [fullName, setFullName] = useState("");
  const [year, setYear] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const teamData = {
      team,
      fullName,
      year,
    };

    try {
      // Post data to backend API
      const response = await axios.post(
        process.env.REACT_APP_API + "/api/teams",
        teamData
      );
      console.log("Team added:", response.data);
      // Optionally, reset form fields
      setTeam("");
      setFullName("");
      setYear("");
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  return (
    <div>
      <h2>Add Team</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Team Name:</label>
          <input
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Team</button>
      </form>
    </div>
  );
};

export default TeamForm;
