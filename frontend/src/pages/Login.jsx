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
      setError(errorResponse.message || "Your login attempt was unsuccessful. Please check your credentials and try again.");
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0E] px-4 font-sans text-white">
      {/* Centrerad login-box */}
      <div className="w-full max-w-xs flex flex-col items-center">

        {/* Logo & Slogan Container - Ändrad från mb-6 till mb-14 för mer luft i botten */}
        <div className="mb-14 flex flex-col items-center text-center">
          <img src={logo} alt="Liftly logo" className="h-9 w-auto mb-2 object-contain" />
          <p className="text-sm font-normal text-white tracking-wide">
            Where training meets community
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={loginUser} className="w-full flex flex-col gap-3">
          {/* Username */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Username:"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded bg-white px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded bg-white px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Log in button */}
          <button
            type="submit"
            className="mt-1 w-full rounded bg-[#4A4545] py-2 text-xs font-medium text-white transition-colors hover:bg-[#575151] focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            Log in
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 w-full text-center">
            {error}
          </p>
        )}

        {/* Sign up link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-300">
            Don’t have an account?{" "}  {/* {" "} renders space between the paragraph and link */}
            <a href="/register" className="font-semibold text-white hover:underline"> Sign up </a>
          </p>
        </div>

      </div>
    </section>
  );
}

export default Login;