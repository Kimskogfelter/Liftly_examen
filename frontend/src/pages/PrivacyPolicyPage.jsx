import React from 'react';
import { Link } from 'react-router-dom';
import { LuShield } from "react-icons/lu";

const PrivacyPolicyPage = () => {
    return (
        <section className="px-4 md:px-6 max-w-2xl mx-auto pt-20 md:pt-24 xl:pt-8 pb-24 font-sans text-gray-800">
            {/* Header */}
            <div className="w-full text-center mb-8 border-b border-zinc-200 pb-5">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                    <div className="p-2 bg-black text-white rounded-lg shadow-xs shrink-0">
                        <LuShield size={18} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                        Privacy Policy & GDPR
                    </h1>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                    How we handle and protect your data
                </p>
            </div>

            {/* Innehållskort */}
            <div className="bg-white border border-gray-100 rounded-lg p-5 sm:p-6 shadow-sm space-y-4 text-xs text-zinc-600 leading-relaxed">
                <div>
                    <h2 className="font-bold text-zinc-900 text-sm mb-1">1. Overview</h2>
                    <p>Welcome to Liftly. We respect your privacy and are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
                </div>

                <div>
                    <h2 className="font-bold text-zinc-900 text-sm mb-1">2. What Data We Collect</h2>
                    <p>When you register an account, we collect your chosen username, email address, and a securely hashed password. We also store the workout schedules, logs, and nutritional data you choose to save within the app.</p>
                </div>

                <div>
                    <h2 className="font-bold text-zinc-900 text-sm mb-1">3. Purpose of Processing</h2>
                    <p>Your data is processed strictly to provide you with access to your fitness calendar, workout routines, and history. We store your GDPR consent status and timestamp to comply with legal accountability requirements.</p>
                </div>

                <div>
                    <h2 className="font-bold text-zinc-900 text-sm mb-1">4. Your Rights</h2>
                    <p>You have the right to request access to, correction of, or deletion of your personal data at any time.</p>
                </div>

                <div className="pt-4 border-t border-zinc-100 text-center">
                    <Link to="/register" className="font-semibold text-black hover:underline cursor-pointer">
                        &larr; Back to Registration
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicyPage;