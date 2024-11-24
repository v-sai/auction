import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PlayersList.module.css";
import { io } from "socket.io-client";

const PlayersList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  // Fetch auction data
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + "/api/auction/players"
        );
        setAuctions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching auctions data");
        setLoading(false);
      }
    };

    fetchAuctions();

    const socket = io(process.env.REACT_APP_API); // Replace with your backend URL

    // Listen for new auction events
    socket.on("new-auction", (newAuction) => {
      setAuctions((prevAuctions) => {
        // Update auction if it exists, or add it to the list
        const updatedAuctions = prevAuctions.map((auction) =>
          auction._id === newAuction._id ? newAuction : auction
        );
        if (
          !updatedAuctions.find((auction) => auction._id === newAuction._id)
        ) {
          updatedAuctions.push(newAuction); // Add if it doesn't exist
        }
        return updatedAuctions;
      });
    });
  }, []);

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + "/api/teams"
        );
        setTeams(response.data);
      } catch (err) {
        setError("Error fetching teams data");
      }
    };

    fetchTeams();
  }, []);

  const convertToCrores = (x) => {
    const crore = x / 100;
    return `${crore} Cr`;
  };

  // Filter auctions based on the selected team
  const filteredAuctions = selectedTeam
    ? auctions.filter((auction) => auction.team === selectedTeam)
    : auctions;

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Players Auction List</h2>

      {/* Team Filter Dropdown */}
      <div className={styles.filter}>
        <label htmlFor="team">Filter by Team: </label>
        <select
          id="team"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team._id} value={team.team}>
              {team.team}
            </option>
          ))}
        </select>
      </div>

      {filteredAuctions.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Final Price</th>
              <th>Team</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuctions.map((auction) => (
              <tr key={auction._id}>
                <td>{auction.playerName}</td>
                <td>{auction.type}</td>
                <td>{auction.category}</td>
                <td>{convertToCrores(auction.finalPrice)}</td>
                <td>
                  {auction.status === "Unsold" || auction.status === "InQue"
                    ? "-"
                    : auction.team === "unsold" ? "-" : auction.team }
                </td>
                <td>{auction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noData}>No players found in auctions.</div>
      )}
    </div>
  );
};

export default PlayersList;
