import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedPostsPage from './pages/SavedPostsPage';
import ProfilePage from './pages/ProfilePage';
import SinglePostPage from './pages/SinglePostPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import HashtagPage from './pages/HashtagPage';
import WorkoutPage from './pages/WorkoutPage';
import SingleWorkoutPage from './pages/SingleWorkoutPage';
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
          <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<AppLayout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path="/home" element={<HomePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} /> {/* NOT protected, uses the AppLayout component to render layout and navbar */}
            <Route path="/savedPosts" element={currentUser ? <SavedPostsPage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/users/:userId" element={currentUser ? <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/posts/:postId" element={currentUser ? <SinglePostPage currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />} />
            <Route path="/search" element={currentUser ? <SearchPage currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/category/:categoryName" element={currentUser ? <CategoryPage currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/hashtag/:hashtag" element={currentUser ? <HashtagPage currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/workouts" element={currentUser ? <WorkoutPage currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/workouts/:workoutId" element={currentUser ? <SingleWorkoutPage currentUser={currentUser} /> : <Navigate to="/login" />} />
          </Route>

        </Routes>
      </Router>

    </>
  )
}

export default App
