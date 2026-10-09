import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LuCalendar } from "react-icons/lu";
import { FiShare2 } from "react-icons/fi";
import CalendarGrid from '../components/calendar/CalendarGrid';
import AssignWorkoutForm from '../components/calendar/AssingWorkoutForm';
import ShareCalendarModal from '../components/calendar/ShareCalendarModal';
import ScheduledWorkoutsList from '../components/calendar/ScheduledWorkoutsList';

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
            <CalendarGrid
                year={year}
                month={month}
                currentDateObj={currentDateObj}
                logs={logs}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                handleShareMonth={handleShareMonth}
                monthNames={monthNames}
                daysInMonth={daysInMonth}
                adjustedFirstDay={adjustedFirstDay}
                FiShare2={FiShare2}
            />

            {/* Aktivt datum & Formulär för att boka pass */}
            <AssignWorkoutForm
                selectedDate={selectedDate}
                selectedWorkoutId={selectedWorkoutId}
                setSelectedWorkoutId={setSelectedWorkoutId}
                notes={notes}
                setNotes={setNotes}
                workouts={workouts}
                handleAssignWorkout={handleAssignWorkout}
            />

            {/* Lista över pass för valt datum */}
            <ScheduledWorkoutsList
                loading={loading}
                logsForSelectedDate={logsForSelectedDate}
                navigate={navigate}
                handleToggleComplete={handleToggleComplete}
                handleDeleteLog={handleDeleteLog}
            />
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