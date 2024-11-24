import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AuctionForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuctionForm = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setplayerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("");
  const [playerDetails, setPlayerDetails] = useState({
    type: "",
    category: "",
  });

  useEffect(() => {
    const fetchPlayersAndTeams = async () => {
      try {
        const playersResponse = await axios.get(
          process.env.REACT_APP_API + "/api/players"
        );
        setPlayers(playersResponse.data);

        const teamsResponse = await axios.get(
          process.env.REACT_APP_API + "/api/teams"
        );
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlayersAndTeams();
  }, []);

  useEffect(() => {
    if (playerName) {
      const player = players.find((p) => p.name === playerName);
      if (player) {
        setPlayerDetails({ type: player.type, category: player.category });
      }
    }
  }, [playerName, players]);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auctionData = { playerName, finalPrice, team, status, playerId };

    try {
      const response = await axios.post(
        process.env.REACT_APP_API + "/api/auctions",
        auctionData
      );
      console.log("Auction saved:", response.data);

      toast.success("Auction data saved", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error saving auction:", error);
      toast.error("Auction data save failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Player Auction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Player"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* <select
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setplayerId();
          }}
          required
        >
          <option value="">Select Player</option>
          {filteredPlayers.map((player) => (
            <option key={player._id} value={player.name}>
              {player?.sno}. {player.name} ({player?.age})
            </option>
          ))}
        </select> */}

        <select
          value={playerId}
          onChange={(e) => {
            const selectedPlayerId = e.target.value; // Get selected player's _id
            const selectedPlayer = players.find(
              (player) => player._id === selectedPlayerId
            ); // Find player by _id
            setPlayerName(selectedPlayer ? selectedPlayer.name : ""); // Set playerName from the selected player
            setplayerId(selectedPlayerId); // Set playerId
          }}
          required
        >
          <option value="">Select Player</option>
          {filteredPlayers.map((player) => (
            <option key={player._id} value={player._id}>
              {player?.sno}. {player.name} ({player?.age})
            </option>
          ))}
        </select>

        {playerName && (
          <div className={styles.playerDetails}>
            <p>Type: {playerDetails.type}</p>
            <p>Category: {playerDetails.category}</p>
          </div>
        )}

        <input
          type="number"
          placeholder="Final Price"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value)}
          required
        />

        <select value={team} onChange={(e) => setTeam(e.target.value)} required>
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t.team}>
              {t.team} ({t.fullName}, {t.year})
            </option>
          ))}
        </select>

        {/* <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        /> */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="InQue">InQue</option>
          <option value="Inprogress">Inprogress</option>
          <option value="Unsold">Unsold</option>
          <option value="Sold">Sold</option>
          <option value="RTM">RTM</option>
          <option value="Retained">Retained</option>
        </select>

        <button type="submit">Submit Auction</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AuctionForm;
