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

  // state to check if user is logged in, if not redirect to login page
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/savedPosts" element={userLoggedIn ? <SavedPosts/> : <Navigate to="/login" />} />
          <Route path="/users/:userId" element={userLoggedIn ? <ProfilePage/> : <Navigate to="/login" />} />
          <Route path="/posts/:postId" element={userLoggedIn ? <Post/> : <Navigate to="/login" />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
