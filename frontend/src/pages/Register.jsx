import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/images/liftly-logo.png';

function Register() {

  // states for form inputs from user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  return (
    <section>
        <div><img src={logo} alt="Liftly logo" />
        <p>Where training meets community</p>
        <p>Join us today!</p>
        </div>
        <form action="POST">
          {/* username */}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {/* email */}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {/* password */}
          <div>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye/> : <FaEyeSlash/>}
            </button>
          </div>
          {/* confirm password */}
          <div>
            <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye/> : <FaEyeSlash/>}
            </button>
          </div>
          {/* Sign up button */}
          <input type="submit" value="Sign up" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
        </form>
        <div><p>Already have an account? <a href="/login">Login here</a></p></div>
    </section>
  );
}

export default Register;