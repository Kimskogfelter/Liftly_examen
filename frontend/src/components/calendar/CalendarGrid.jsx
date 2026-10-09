import React from 'react';

const CalendarGrid = ({
    year,
    month,
    currentDateObj,
    logs,
    selectedDate,
    setSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    handleShareMonth,
    monthNames,
    daysInMonth,
    adjustedFirstDay,
    FiShare2
}) => {
    return (
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
                                            className={`text-[9px] sm:text-[10px] font-medium leading-tight px-0.5 py-0.5 rounded line-clamp-2 ${
                                                log.completed ? "line-through opacity-80" : ""
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
    );
};

export default CalendarGrid;