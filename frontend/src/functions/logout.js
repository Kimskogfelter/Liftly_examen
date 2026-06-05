export const logout = (setCurrentUser, navigate) => {

  localStorage.removeItem("currentUser");
  setCurrentUser(null);
  navigate("/login");

};