import { useState, React } from "react";
import api from "../../api/axios";
import EditProfileImage from "./EditProfileImage"; // Vi importerar din färdiga bildredigerare!

function EditProfileModal({ onClose, currentUser, setCurrentUser, getUserInfo }) {

    const [profileBio, setProfileBio] = useState(currentUser?.profileBio || "");
    const [showImagePicker, setShowImagePicker] = useState(false);

    // State för de tre sociala plattformarna
    const [socialLinks, setSocialLinks] = useState({
        instagram: currentUser?.socialLinks?.instagram || "",
        tiktok: currentUser?.socialLinks?.tiktok || "",
        youtube: currentUser?.socialLinks?.youtube || ""
    });

    const [error, setError] = useState("");

    // Hantera ändringar i sociala-fält
    const handleSocialChange = (e) => {
        setSocialLinks({
            ...socialLinks,
            [e.target.name]: e.target.value
        });
    };

    // Funktion för att redigera profil (bio + sociala länkar)
    const editProfileBio = async (e) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/users/update`, {
                profileBio,
                socialLinks
            });

            if (response.status === 200) {
                const updatedUserFromBackend = response.data.updatedUser;

                const updatedUser = {
                    ...currentUser,
                    profileBio: updatedUserFromBackend.profileBio,
                    socialLinks: updatedUserFromBackend.socialLinks
                };

                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

                if (getUserInfo) await getUserInfo();
            }

            onClose();

        } catch (err) {
            const errorResponse = err.response?.data;
            setError(errorResponse?.message || "Your profile could not be updated. Please try again.");
        }
    };

    return (
        <>
            {/* Yttre modal-wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">

                <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">

                    <h3 className="text-sm font-bold text-gray-900 mb-4 text-left">Edit Profile</h3>

                    {/* 1. SEKTION FÖR PROFILBILD (Återanvänder din befintliga bild) */}
                    <div className="flex flex-col items-center justify-center pb-4 mb-4 border-b border-gray-100">
                        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 shadow-sm mb-2">
                            {currentUser?.profileImage ? (
                                <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                                    {currentUser?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowImagePicker(true)}
                            className="text-xs font-semibold text-black hover:underline cursor-pointer"
                        >
                            Change profile photo
                        </button>
                    </div>

                    {/* 2. FORMULÄR FÖR BIO & SOCIALA LÄNKAR */}
                    <form onSubmit={editProfileBio} className="space-y-4">

                        {/* Bio Textarea */}
                        <div className="relative">
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1 text-left">Bio</label>
                            <textarea
                                name="profileBio"
                                placeholder="What's on your mind?"
                                value={profileBio}
                                onChange={(e) => setProfileBio(e.target.value)}
                                className="w-full min-h-20 p-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none text-xs bg-gray-50/50 transition-all focus:border-zinc-400"
                            ></textarea>
                        </div>

                        {/* Social Links Input Fields */}
                        <div className="space-y-2 pt-2 border-t border-gray-100 text-left">
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Social Links (Usernames)</label>

                            {/* Instagram */}
                            <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus-within:border-zinc-400">
                                <svg className="w-4 h-4 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <input
                                    type="text"
                                    name="instagram"
                                    placeholder="instagram_username"
                                    value={socialLinks.instagram}
                                    onChange={handleSocialChange}
                                    className="w-full text-xs text-gray-800 bg-transparent focus:outline-none"
                                />
                            </div>

                            {/* TikTok */}
                            <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus-within:border-zinc-400">
                                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.56-1.27 2.56.02.82.43 1.62 1.1 2.08.79.57 1.84.7 2.76.42 1.05-.3 1.83-1.22 1.96-2.3.06-1.58.04-3.16.04-4.74V.02z" />
                                </svg>
                                <input
                                    type="text"
                                    name="tiktok"
                                    placeholder="tiktok_username"
                                    value={socialLinks.tiktok}
                                    onChange={handleSocialChange}
                                    className="w-full text-xs text-gray-800 bg-transparent focus:outline-none"
                                />
                            </div>

                            {/* YouTube */}
                            <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus-within:border-zinc-400">
                                <svg className="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <input
                                    type="text"
                                    name="youtube"
                                    placeholder="youtube_username"
                                    value={socialLinks.youtube}
                                    onChange={handleSocialChange}
                                    className="w-full text-xs text-gray-800 bg-transparent focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
                                {error}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#3A3939] hover:bg-zinc-800 text-white font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer text-xs shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* IF user clicks "Change profile photo", open EditProfileImage directly */}
            {showImagePicker && (
                <EditProfileImage
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    getUserInfo={getUserInfo}
                    onClose={() => setShowImagePicker(false)}
                />
            )}
        </>
    );
}

export default EditProfileModal;