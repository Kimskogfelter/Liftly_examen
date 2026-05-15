import React from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setCurrentUser }) {

  const navigate = useNavigate();

  // Use useEffect to clear localStorage and redirect to login page when user logs out
  React.useEffect(() => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  }, [navigate, setCurrentUser]);

  return (
    <div>
      <h1>Logout User</h1>
    </div>
  );
}

export default Logout;