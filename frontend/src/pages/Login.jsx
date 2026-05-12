import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/liftly-logo.png';

function Login() {
  
  // states for form inputs from user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <section>
        <div><img src={logo} alt="Liftly logo" />
        <p>Where training meets community</p>
        <p>Join us today!</p>
        </div>
        <form action="GET">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="submit" value="Log in" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </form>
        <div><p>Don't have an account? <a href="/register">Sign up here</a></p></div>
    </section>
  );
}

export default Login;