import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/liftly-logo.png';

function Login({ setCurrentUser }) {

  // states for form inputs from user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // function to handle user login
  const loginUser = async (e) => {
    e.preventDefault();     
    try {

      // send login data to backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { username, password });
      console.log("Login successful:", response.data);
      // redirect to dashboard page after successful login
      if (response.status === 200) {
        // save user data to local storage
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        // update current user state in App component
        setCurrentUser(response.data);
        navigate('/home');
      }

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message);
    }
  };

  return (
    <section>
        <div><img src={logo} alt="Liftly logo" />
        <p>Where training meets community</p>
        <p>Welcome back! Please log in to your account</p>
        </div>
        <form onSubmit={loginUser}>
          {/* username */}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {/* password */}
          <input type={"password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {/* Log in button */}
          <input type="submit" value="Log in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </form>
        {/* Error message */}
        {error && <p>{error}</p>}
        <div><p>Don't have an account? <a href="/register">Sign up here</a></p></div>
    </section>
  );
}

export default Login;