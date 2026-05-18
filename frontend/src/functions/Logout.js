export const Logout = (setCurrentUser, navigate) => {

  localStorage.removeItem("currentUser");
  setCurrentUser(null);
  navigate("/login");

};