import React, { useState } from "react";
import api from "../../api/axios";
import { IoCloseCircle } from "react-icons/io5";

function ShareCalendarModal({ calendarData, onClose, onShared }) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handlePublish = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('category', 'Training');
            formData.append('calendarShare', JSON.stringify(calendarData));

            const response = await api.post('/posts/create', formData);

            if (response.status === 201) {
                window.dispatchEvent(new Event("postCreated"));
                onShared();
            }
        } catch (err) {
            setError("Could not share calendar. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Beräkna första veckodagen för månaden baserat på första dagens datum
    const firstDateObj = calendarData?.days?.[0] ? new Date(calendarData.days[0].date) : new Date();
    const firstDayIndex = firstDateObj.getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-lg p-5 shadow-2xl border border-gray-100 text-left relative">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Share Training Calendar</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <IoCloseCircle size={20} />
                    </button>
                </div>

                <form onSubmit={handlePublish} className="space-y-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Your own thoughts during this journey..."
                        autoFocus
                        className="w-full h-20 text-xs text-gray-800 border border-zinc-200 rounded-lg p-3 resize-none focus:outline-none focus:border-zinc-400 bg-gray-50/30"
                    ></textarea>

                    {/* Förhandsgranskning av hela kalendern */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-gray-800 text-xs">
                        <p className="font-bold mb-2 text-zinc-600">Training Calendar — {calendarData.month}</p>

                        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[9px] font-bold text-zinc-400 uppercase">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>

                        {/* Hela månadens rutnät med utfyllnadsrutor */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
                                <div key={`empty-${index}`} className="aspect-square bg-transparent border border-transparent"></div>
                            ))}

                            {calendarData.days.map((day, idx) => {
                                let boxStyles = "bg-white border-zinc-200 text-zinc-700";

                                if (day.hasWorkout) {
                                    boxStyles = day.completed
                                        ? "bg-black border-black text-white font-bold shadow-xs"
                                        : "bg-zinc-200 border-zinc-300 text-zinc-800 shadow-xs";
                                } else {
                                    boxStyles = "bg-white/50 border-zinc-100 text-zinc-400";
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={`aspect-square p-0.5 rounded border flex flex-col justify-between text-[8px] ${boxStyles}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className={`font-bold ${day.completed ? "text-white" : "text-zinc-900"}`}>
                                                {day.dayNumber}
                                            </span>
                                            {day.completed && <span className="text-[7px] text-zinc-300">✓</span>}
                                        </div>
                                        {day.title ? (
                                            <span className={`truncate text-[6px] leading-tight ${day.completed ? "text-zinc-300" : "text-zinc-600"}`} title={day.title}>
                                                {day.title}
                                            </span>
                                        ) : (
                                            <span></span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {error && <p className="text-red-600 text-[11px] font-medium">{error}</p>}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-1.5 px-3.5 rounded-lg text-xs cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black hover:bg-zinc-800 text-white font-semibold py-1.5 px-4 rounded-lg text-xs cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Sharing..." : "Share to Feed"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShareCalendarModal;