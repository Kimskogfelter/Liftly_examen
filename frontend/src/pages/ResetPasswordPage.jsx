import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 10) {
      return setError("Password must be at least 10 characters long.");
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);

      // Omdirigera till login efter 2 sekunder
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white font-sans text-gray-800">
      <div className="w-full max-w-sm border border-zinc-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-xs text-zinc-500 text-center mb-6">
          Enter your new password below.
        </p>

        {/* Success Message */}
        {message && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3 rounded-xl text-xs mb-4 font-medium">
            {message} Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-zinc-700">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 10 characters"
              className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-zinc-700">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-xs text-zinc-500 hover:text-black font-semibold transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;