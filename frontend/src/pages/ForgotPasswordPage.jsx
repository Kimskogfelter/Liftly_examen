import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/liftly-logo.png";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-[#0D0D0E] px-4 font-sans text-white">
      {/* Centrerad box med exakt samma max-w-xs som LoginPage */}
      <div className="w-full max-w-xs flex flex-col items-center">

        {/* Logo & Rubrik Container */}
        <div className="mb-10 flex flex-col items-center text-center">
          <img src={logo} alt="Liftly logo" className="h-9 w-auto mb-3 object-contain" />
          <h1 className="text-base font-semibold text-white tracking-wide mb-1">
            Reset Password
          </h1>
          <p className="text-xs font-normal text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email address:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded bg-white px-3 py-2 text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded bg-[#4A4545] py-2 text-xs font-medium text-white transition-colors hover:bg-[#575151] focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <p className="mt-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20 w-full text-center">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-3 text-xs font-semibold text-red-500 bg-red-500/10 px-3 py-2 rounded border border-red-500/20 w-full text-center">
            {error}
          </p>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-xs text-gray-400 hover:text-white font-medium transition-colors"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ForgotPasswordPage;