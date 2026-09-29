import React from "react";
import { useNavigate } from "react-router-dom";
import { LuDumbbell, LuCalendar, LuApple } from "react-icons/lu";

function TrainingPage({ currentUser }) {
    const navigate = useNavigate();

    const hubItems = [
        {
            title: "Workouts",
            description: "Create, edit, and run your daily workout routines.",
            icon: <LuDumbbell size={18} className="text-white" />,
            path: "/workouts",
        },
        {
            title: "Activity Calendar",
            description: "Check off today's workout, build your monthly streak, and view history.",
            icon: <LuCalendar size={18} className="text-white" />,
            path: "/calendar",
        },
        {
            title: "Food Log",
            description: "Keep track of your daily calories, protein, and fat.",
            icon: <LuApple size={18} className="text-white" />,
            path: "/food-log",
        },
    ];

    return (
        <section className="px-2 md:px-6 max-w-2xl mx-auto pt-20 md:pt-24 xl:pt-8 pb-24 font-sans text-gray-800">
            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                    <div className="p-2 bg-black text-white rounded-xl shadow-xs shrink-0">
                        <LuDumbbell size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Training & Health
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    Your daily hub for workouts, history, and nutrition
                </p>
            </div>

            <div className="w-full space-y-3">
                {hubItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:border-zinc-300 transition-all cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
                            <div className="p-2.5 bg-black text-white rounded-xl shrink-0 shadow-xs">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-bold text-zinc-900 group-hover:text-black">
                                    {item.title}
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5 leading-normal">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <span className="text-zinc-300 group-hover:text-zinc-600 transition-colors text-sm font-bold shrink-0">
                            →
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TrainingPage;