import React, { useState } from "react";
import PlayerForm from "./components/PlayerForm";
import AuctionForm from "./components/AuctionForm";
import TeamForm from "./components/TeamForm";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PlayersList from "./components/PlayersList";
import AuthPin from "./components/AuthPin";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const correctPin = "@nil";
  const handleAuthorization = () => {
    setIsAuthorized(true);
  };
  return (
    <Router>
      <div className="App">
        <h1 className="head_title" style={{textAlign:"center"}}>Auction2025</h1>
        <Routes>
          <Route path="/" element={<PlayersList />} />

          {/* <Route path="/players" element={<PlayerForm />} />
          <Route path="/auction" element={<AuctionForm />} />
          <Route path="/team" element={<TeamForm />} /> */}

          {/* Authorization route */}
          <Route
            path="/auth"
            element={
              <AuthPin
                correctPin={correctPin}
                onAuthorized={handleAuthorization}
              />
            }
          />

          {/* Protected routes (accessible only after authorization) */}
          {isAuthorized ? (
            <>
              <Route path="/players" element={<PlayerForm />} />
              <Route path="/auction" element={<AuctionForm />} />
              <Route path="/team" element={<TeamForm />} />
              <Route path="/*" element={<PlayersList />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <ProtectedRoute
                  onUnauthorized={handleAuthorization}
                  correctPin={correctPin}
                  onAuthorized={handleAuthorization}
                />
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

function ProtectedRoute({ onUnauthorized, correctPin, onAuthorized }) {
  const location = useLocation();
  const redirectTo = location.pathname || "/"; // Default to home if no previous route
  console.log(redirectTo);

  return (
    <div>
      <AuthPin
        correctPin={correctPin}
        onAuthorized={onAuthorized}
        redirectTo={redirectTo}
      />
    </div>
  );
}

export default App;
