import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
            console.log("Forgot password response:", res.data);
            setMessage(res.data.message);
            setEmail(""); // Rensa fältet när det lyckats
        } catch (err) {
            setError(
                err.response?.data?.message || "Something went wrong. Please try again."

            );
            console.error("Forgot password error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white font-sans text-gray-800">
            <div className="w-full max-w-sm border border-zinc-200 p-6 rounded-2xl shadow-sm">
                <h1 className="text-xl font-bold text-center mb-2">Forgot Password</h1>
                <p className="text-xs text-zinc-500 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {/* Success Message */}
                {message && (
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3 rounded-xl text-xs mb-4 font-medium">
                        {message}
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Sending link..." : "Send Reset Link"}
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

export default ForgotPasswordPage;