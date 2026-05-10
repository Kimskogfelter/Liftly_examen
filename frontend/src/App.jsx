import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



function App() {

  // state to check if user is logged in, if not redirect to login page
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/register" element={<h1>Register Page</h1>} />
          <Route path="/feed" element={userLoggedIn ? <h1>Feed</h1> : <Navigate to="/login" />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
