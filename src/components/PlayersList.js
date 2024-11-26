import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PlayersList.module.css";
import { io } from "socket.io-client";

const PlayersList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]); // For role filtering
  const [selectedTeam, setSelectedTeam] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For search by player name
  const [sortOrder, setSortOrder] = useState(""); // For sorting
  const [selectedRole, setSelectedRole] = useState(""); // For role filtering

  // Fetch auction data
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + "/api/auction/players"
        );
        setAuctions(response.data);

        // Extract unique roles for filtering
        const uniqueRoles = Array.from(
          new Set(response.data.map((auction) => auction.specialization))
        ).filter(Boolean);
        setRoles(uniqueRoles);

        setLoading(false);
      } catch (err) {
        setError("Error fetching auctions data");
        setLoading(false);
      }
    };

    fetchAuctions();

    const socket = io(process.env.REACT_APP_API);

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

  // Filter, search, and sort players
  const filteredAuctions = auctions
    .filter((auction) => {
      // Filter by team
      if (selectedTeam && auction.team !== selectedTeam) return false;

      // Filter by role
      if (selectedRole && auction.specialization !== selectedRole) return false;

      // Search by player name
      if (
        searchQuery &&
        !auction.playerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.finalPrice - b.finalPrice;
      if (sortOrder === "desc") return b.finalPrice - a.finalPrice;
      return 0;
    });

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Players Auction List</h2>

      {/* Filters and Sorting */}
      <div className={styles.filters}>
        {/* Search by Player Name */}

        {/* Team Filter */}
        <div className={styles.right_filters}>
          <p>Filter By</p>
          <div className={styles.filter}>
            {/* <label htmlFor="team">Filter by Team: </label> */}
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

          {/* Role Filter */}
          <div className={styles.filter}>
            {/* <label htmlFor="role">Filter by Role: </label> */}
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Sort by Price */}
          <div className={styles.filter}>
            {/* <label htmlFor="sort">Sort by Price: </label> */}
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Price</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className={styles.filter}>
          {/* <label htmlFor="search">Search by Player Name: </label> */}
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player "
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Players Table */}

      <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Type</th>
            <th>Role</th>
            <th>Category</th>
            <th>Final Price</th>
            <th>Team</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <tr key={auction._id}>
                <td>{auction.playerName}</td>
                <td>{auction.type}</td>
                <td>{auction.specialization?.toLowerCase()}</td>
                <td>{auction.category}</td>
                <td>{convertToCrores(auction.finalPrice)}</td>
                <td>
                  {auction.status === "Unsold" || auction.status === "InQue"
                    ? "-"
                    : auction.team === "unsold"
                    ? "-"
                    : auction.team}
                </td>
                <td>{auction.status}</td>
              </tr>
            ))
          ) : (
            <td className={styles.noData} colSpan={7}>No players found in auctions.</td>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default PlayersList;
