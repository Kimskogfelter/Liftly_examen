import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedPosts from './pages/SavedPosts';
import ProfilePage from './pages/ProfilePage';
import Post from './pages/Post';
import Logout from './pages/Logout';



function App() {

const [loggedInUser, setLoggedInUser] = useState(false);
const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("currentUser")) || null
);
const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={loggedInUser ? <Home currentUser={currentUser}/> : <Navigate to="/login" />} />
          <Route path="/savedPosts" element={loggedInUser ? <SavedPosts currentUser={currentUser}/> : <Navigate to="/login" />} />
          <Route path="/users/:userId" element={loggedInUser ? <ProfilePage currentUser={currentUser}/> : <Navigate to="/login" />} />
          <Route path="/posts/:postId" element={loggedInUser ? <Post currentUser={currentUser}/> : <Navigate to="/login" />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
