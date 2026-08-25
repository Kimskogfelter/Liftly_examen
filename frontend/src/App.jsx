import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedPosts from './pages/SavedPosts';
import ProfilePage from './pages/ProfilePage';
import SinglePost from './pages/SinglePost';
import SearchPage from './pages/SearchPage';
import Category from './pages/Category';
import HashtagPage from './pages/HashtagPage';
import AppLayout from './components/layout/AppLayout';


function App() {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [onlineUsers, setOnlineUsers] = useState([]);

  // check if the user(token) is still valid when the app loads, if not, log out the user
  useEffect(() => {
    const verifyToken = async () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));

      if (storedUser && storedUser.token) {
        try {
          const response = await fetch("http://localhost:5000/api/users/verify", {
            headers: {
              "Authorization": `Bearer ${storedUser.token}`
            }
          });

          // IF token is invalid, remove user from localStorage and set currentUser to null
          if (!response.ok) {
            localStorage.removeItem("currentUser");
            setCurrentUser(null);
          }

        } catch (err) {
          console.log("Kunde inte nå servern för verifiering", err);
        }
      }
    };

    verifyToken();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<AppLayout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path="/home" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser} />} /> {/* NOT protected, uses the AppLayout component to render layout and navbar */}
            <Route path="/savedPosts" element={currentUser ? <SavedPosts currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/users/:userId" element={currentUser ? <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/posts/:postId" element={currentUser ? <SinglePost currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/search" element={currentUser ? <SearchPage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/category/:categoryName" element={currentUser ? <Category currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/hashtags/:hashtag" element={currentUser ? <HashtagPage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
          </Route>

        </Routes>
      </Router>

    </>
  )
}

export default App
