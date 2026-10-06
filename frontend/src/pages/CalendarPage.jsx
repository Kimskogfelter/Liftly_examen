import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ShareCalendarModal from '../components/calendar/ShareCalendarModal';
import { LuCalendar } from "react-icons/lu";
import { FiPlus, FiCheck, FiShare2 } from "react-icons/fi";

const CalendarPage = () => {
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // För månadsvyn (YYYY-MM)
    const [currentDateObj, setCurrentDateObj] = useState(new Date());
    const year = currentDateObj.getFullYear();
    const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const yearMonthString = `${year}-${month}`;

    const [logs, setLogs] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shareModalData, setShareModalData] = useState(null);

    // Formulär-state för att boka pass
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchCalendarData();
    }, [yearMonthString]);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);
            const [logsRes, workoutsRes] = await Promise.all([
                api.get(`/calendar?month=${yearMonthString}`),
                api.get('/workouts/user')
            ]);
            setLogs(logsRes.data);
            setWorkouts(workoutsRes.data.workouts || workoutsRes.data);
        } catch (err) {
            console.error("Error fetching calendar data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDateObj(new Date(year, currentDateObj.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDateObj(new Date(year, currentDateObj.getMonth() + 1, 1));
    };


    const handleShareMonth = () => {
        const monthName = `${monthNames[currentDateObj.getMonth()]} ${year}`;

        // Bygg ihop array med alla dagar för den aktiva månaden
        const daysData = Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateString = `${year}-${month}-${formattedDay}`;
            const dayLogs = Array.isArray(logs) ? logs.filter((l) => l.date === dateString) : [];

            const hasWorkout = dayLogs.length > 0;
            const isCompleted = hasWorkout && dayLogs.every(l => l.completed);
            const title = dayLogs.length > 0 ? dayLogs[0].title : "";

            return {
                date: dateString,
                dayNumber: dayNum,
                title: title,
                completed: isCompleted,
                hasWorkout: hasWorkout
            };
        });

        // Sätt data till modalen istället för att posta direkt
        setShareModalData({
            month: monthName,
            days: daysData
        });
    };

    const handleAssignWorkout = async (e) => {
        e.preventDefault();
        if (!selectedWorkoutId) return;

        const chosenWorkout = workouts.find((w) => w._id === selectedWorkoutId);
        if (!chosenWorkout) return;

        try {
            await api.post('/calendar', {
                date: selectedDate,
                title: chosenWorkout.title,
                workout: chosenWorkout._id,
                notes
            });
            setSelectedWorkoutId('');
            setNotes('');
            fetchCalendarData();
        } catch (err) {
            console.error("Error assigning workout:", err);
        }
    };

    const handleToggleComplete = async (logId, currentStatus) => {
        try {
            await api.patch(`/calendar/${logId}`, {
                completed: !currentStatus
            });
            fetchCalendarData();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const handleDeleteLog = async (logId) => {
        try {
            await api.delete(`/calendar/${logId}`);
            fetchCalendarData();
        } catch (err) {
            console.error("Error deleting calendar log:", err);
        }
    };

    // Beräkna dagar i månaden för rutnätet
    const daysInMonth = new Date(year, currentDateObj.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(year, currentDateObj.getMonth(), 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const logsForSelectedDate = Array.isArray(logs) ? logs.filter((l) => l.date === selectedDate) : [];

    return (
        <section className="px-2 md:px-6 max-w-2xl mx-auto pt-20 md:pt-24 xl:pt-8 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                    <div className="p-2 bg-black text-white rounded-lg shadow-xs shrink-0">
                        <LuCalendar size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Activity Calendar
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    Plan and track your workout schedule
                </p>
            </div>

            {/* Månadsväljare & Månadsvy */}
            <div className="bg-transparent sm:bg-white sm:border sm:border-gray-100 sm:rounded-lg p-0 sm:p-5 sm:shadow-sm mb-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4 px-1 sm:px-0">
                    <span className="text-xs font-semibold text-zinc-700">Select Month</span>

                    <div className="flex items-center gap-3">
                        {/* DELNINGSKNAPP */}
                        <button
                            onClick={handleShareMonth}
                            className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-xs"
                            title="Share month overview to feed"
                        >
                            <FiShare2 size={13} />
                            <span>Share</span>
                        </button>

                        <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">
                            <button onClick={handlePrevMonth} className="text-xs font-bold text-zinc-600 hover:text-black cursor-pointer">
                                &larr;
                            </button>
                            <span className="text-xs font-bold text-zinc-800">
                                {monthNames[currentDateObj.getMonth()]} {year}
                            </span>
                            <button onClick={handleNextMonth} className="text-xs font-bold text-zinc-600 hover:text-black cursor-pointer">
                                &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rutnät för kalendern */}
                <div className="pt-2 sm:pt-3 border-t border-zinc-100">
                    <div className="grid grid-cols-7 gap-1 mb-1.5 text-center text-[10px] font-bold text-zinc-400 uppercase">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: adjustedFirstDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="aspect-square bg-zinc-50/30 rounded-lg border border-transparent"></div>
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const dayNum = index + 1;
                            const formattedDay = String(dayNum).padStart(2, '0');
                            const dateString = `${year}-${month}-${formattedDay}`;
                            const dayLogs = Array.isArray(logs) ? logs.filter((l) => l.date === dateString) : [];

                            const hasWorkout = dayLogs.length > 0;
                            const isCompleted = hasWorkout && dayLogs.every(l => l.completed);
                            const isSelected = selectedDate === dateString;

                            let boxStyles = "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300";

                            if (hasWorkout) {
                                boxStyles = isCompleted
                                    ? "bg-black border-black text-white shadow-sm"
                                    : "bg-zinc-200 border-zinc-300 text-zinc-800 shadow-sm";
                            }

                            if (isSelected) {
                                boxStyles += " border-black ring-2 ring-black z-10";
                            }

                            return (
                                <div
                                    key={dateString}
                                    onClick={() => setSelectedDate(dateString)}
                                    className={`aspect-square p-1 rounded-lg border flex flex-col justify-between transition-all cursor-pointer overflow-hidden ${boxStyles}`}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span className={`text-[10px] sm:text-xs font-bold ${isCompleted ? "text-white" : "text-zinc-900"}`}>
                                            {dayNum}
                                        </span>
                                        {isCompleted && <span className="text-[9px] text-zinc-300">✓</span>}
                                    </div>

                                    <div className="flex-1 overflow-hidden flex flex-col justify-center">
                                        {dayLogs.map((log) => (
                                            <div
                                                key={log._id}
                                                className={`text-[9px] sm:text-[10px] font-medium leading-tight px-0.5 py-0.5 rounded line-clamp-2 ${log.completed ? "line-through opacity-80" : ""
                                                    }`}
                                                title={log.title}
                                            >
                                                {log.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Aktivt datum & Formulär för att boka pass */}
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-6">
                <div className="mb-4 pb-3 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Selected Date</span>
                        <h2 className="text-base font-bold text-zinc-900 mt-0.5 font-mono">{selectedDate}</h2>
                    </div>
                </div>

                <form onSubmit={handleAssignWorkout} className="space-y-3">
                    <h2 className="font-semibold text-zinc-900 text-xs">Assign Workout</h2>
                    <select
                        value={selectedWorkoutId}
                        onChange={(e) => setSelectedWorkoutId(e.target.value)}
                        className="w-full border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                        <option value="">Select from your workouts...</option>
                        {workouts.map((w) => (
                            <option key={w._id} value={w._id}>
                                {w.title}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Notes (optional)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-zinc-200 p-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                        type="submit"
                        disabled={!selectedWorkoutId}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-zinc-800 disabled:bg-zinc-300 transition text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                        <FiPlus size={16} />
                        <span>Add to Calendar</span>
                    </button>
                </form>
            </div>

            {/* Lista över pass för valt datum */}
            <div className="space-y-3">
                <h2 className="font-semibold text-zinc-900 text-xs">Scheduled Workouts</h2>
                {loading ? (
                    <p className="text-xs text-zinc-400">Loading...</p>
                ) : logsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-500 text-xs font-medium">No workouts scheduled for this date.</p>
                    </div>
                ) : (
                    logsForSelectedDate.map((log) => (
                        <div key={log._id} className="border border-gray-100 p-4 rounded-lg flex flex-row justify-between items-center gap-3 bg-white shadow-sm">
                            <div className="min-w-0 flex-1">
                                <p
                                    onClick={() => {
                                        const workoutId = log.workout?._id || log.workout;
                                        if (workoutId) {
                                            navigate(`/workouts/${workoutId}`);
                                        }
                                    }}
                                    className={`font-semibold text-xs truncate cursor-pointer hover:underline hover:text-blue-600 transition ${log.completed ? "line-through text-zinc-400" : "text-zinc-900"
                                        }`}
                                    title={log.title}
                                >
                                    {log.title}
                                </p>
                                {log.notes && <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{log.notes}</p>}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggleComplete(log._id, log.completed)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${log.completed
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                                        }`}
                                >
                                    <FiCheck size={14} className={log.completed ? "text-green-700" : "text-zinc-600"} />
                                    <span>{log.completed ? "Completed" : "Mark as Done"}</span>
                                </button>

                                <button
                                    onClick={() => handleDeleteLog(log._id)}
                                    className="text-zinc-400 hover:text-red-600 text-xs font-medium transition cursor-pointer px-2 py-1.5"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Share Calendar Modal */}
            {shareModalData && (
                <ShareCalendarModal
                    calendarData={shareModalData}
                    onClose={() => setShareModalData(null)}
                    onShared={() => {
                        setShareModalData(null);
                        navigate('/');
                    }}
                />
            )}
        </section>
    );
};

export default CalendarPage;