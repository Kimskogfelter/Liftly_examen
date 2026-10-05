import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FiMail, FiSend, FiCheckCircle, FiX } from "react-icons/fi";

function ContactModal({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "Feedback",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const backdropClasses =
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Exempel med Web3Forms (eller din egen backend-lösning)
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: "DIN_ACCESS_KEY_HÄR", 
                    subject: `Liftly Contact: ${formData.category}`,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } catch (err) {
            setError("Could not send message. Check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className={backdropClasses} onClick={onClose}>
            <div
                className="w-full max-w-md bg-white rounded-lg p-6 text-gray-800 relative animate-in zoom-in-95 duration-150 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                            <FiMail size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 tracking-tight text-left">Contact & Feedback</h3>
                            <p className="text-[11px] text-gray-500 text-left">Share ideas, report bugs or partnerships</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {submitted ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center space-y-2 my-2">
                        <FiCheckCircle size={32} className="mx-auto text-emerald-600" />
                        <h4 className="text-xs font-bold text-emerald-900">Message sent!</h4>
                        <p className="text-[11px] text-emerald-700">
                            Thank you for reaching out. I'll get back to you as soon as possible.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({ name: "", email: "", category: "Feedback", message: "" });
                            }}
                            className="mt-3 text-xs font-semibold bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 text-left">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="E.g. John Doe"
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Topic</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
                            >
                                <option value="Feedback">Feedback & Ideas</option>
                                <option value="Bug">Report a Bug</option>
                                <option value="Partnership">Partnership / Advertising</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={3}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your thoughts here..."
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-xs cursor-pointer disabled:opacity-50 mt-1"
                        >
                            <FiSend size={13} />
                            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                        </button>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}

export default ContactModal;