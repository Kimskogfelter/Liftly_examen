import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/images/liftly-logo.png';

function RegisterPage() {

  // states for form inputs from user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedGDPR, setAcceptedGDPR] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // function to handle user registration
  const registerUser = async (e) => {
    e.preventDefault();

    if (!acceptedGDPR) {
      // Visa ett felmeddelande i din UI om man försöker registrera utan att kryssa i
      setError("You must accept the GDPR terms to register.");
      return;
    }

    try {

      // send registration data to backend
      const response = await api.post(`/users/register`, { username, email, password, confirmPassword, gdprConsent: { accepted: acceptedGDPR } });
      // console.log("Registration successful:", response.data);
      // redirect to login page after successful registration
      if (response.status === 201) {
        navigate('/login');
      }

    } catch (err) {

      // handle errors and display error message to user
      const errorResponse = err.response.data;
      setError(errorResponse.message || "Your registration attempt was unsuccessful. Please check your input and try again.");
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0E] px-4 font-sans text-white">
      {/* Centrerad register-box (låst till 320px bredd) */}
      <div className="w-full max-w-xs flex flex-col items-center">

        {/* Logo & Slogan Container */}
        <div className="mb-14 flex flex-col items-center text-center">
          <img src={logo} alt="Liftly logo" className="h-9 w-auto mb-2 object-contain" />
          <p className="text-sm font-normal text-white tracking-wide">
            Where training meets community
          </p>
          <p className="text-xs font-light text-gray-400 mt-1">
            Join us today!
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={registerUser} className="w-full flex flex-col gap-3">
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

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded bg-white px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded bg-white pl-3 pr-10 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password:"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded bg-white pl-3 pr-10 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
            </button>
          </div>
          {/* GDPR Checkbox */}
          <div className="flex items-start gap-2.5 my-3">
            <input
              type="checkbox"
              id="gdpr"
              checked={acceptedGDPR}
              onChange={(e) => setAcceptedGDPR(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black cursor-pointer"
            />
            <label htmlFor="gdpr" className="text-xs text-zinc-600 select-none  leading-tight">
              I agree that my personal data and workout information can be stored in accordance with the{' '}
              <Link to="/privacy" className="underline font-medium text-zinc-900 hover:text-black cursor-pointer">
                Privacy Policy
              </Link>{' '}
              and GDPR.
            </label>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            disabled={!acceptedGDPR}
            className="mt-1 w-full rounded bg-[#4A4545] py-2 text-xs font-medium text-white transition-colors hover:bg-[#575151] focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            Sign up
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 w-full text-center">
            {error}
          </p>
        )}

        {/* Login link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-300">
            Already have an account?{/* {" "} renders space between the paragraph and link */}
            {" "}
            <Link to="/login" className="font-semibold text-white hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}

export default RegisterPage;