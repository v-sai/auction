import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthPin = ({ correctPin, onAuthorized,redirectTo }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous route the user was trying to access
  const from = location.pathname || "/";

  const handleChange = (event) => {
    setPin(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin === correctPin) {
      onAuthorized();
      navigate(from, { replace: true });  // Redirect to the intended route
    } else {
      setError("Invalid PIN. Please try again.");
    }
  };

  return (
    <div>
      <h2>Enter PIN to Access</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pin}
          onChange={handleChange}
          placeholder="Enter PIN"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AuthPin;
