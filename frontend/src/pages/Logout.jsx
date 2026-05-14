import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();

  // Use useEffect to clear localStorage and redirect to login page when user logs out
  React.useEffect(() => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h1>Logout User</h1>
    </div>
  );
}   

export default Logout;