import { useState, React } from "react";
import axios from "axios";

function EditProfileBio({ onClose, currentUser, setCurrentUser, getUserInfo }) {

    const [profileBio, setProfileBio] = useState("");
    const [error, setError] = useState("");

    // function to edit profile bio
    const editProfileBio = async (e) => {
        e.preventDefault();

        // check that text field is filled in before sending req to backend
        if (!profileBio) {
            setError("Please write a text first.");
            return;
        }

        try {

            // send updated data to backend
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/update`, { profileBio }, {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`
                }
            });

            console.log("Profile bio update request sent successfully:", response.data);


            // after successful patch req to backend of profile bio
            if (response.status === 200) {

                // extract the new profile bio text from response from backend
                const updatedProfileBio = response.data.updatedUser.profileBio;

                // create a new user object to update currentUser state with updated profile bio
                const updatedUser = { ...currentUser, profileBio: updatedProfileBio };

                // update state for currentUser in React AND localstorage
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

                // run getUserInfo function from profile page to make a new get request to backend to update profile bio directly
                await getUserInfo();

            }

            // close the EditProfileBio component after successful update
            onClose();

        } catch (err) {

            // handle errors and display error message to user
            const errorResponse = err.response?.data;
            setError(errorResponse?.message || "Your post could not be updated. Please try again.");
        }
    };

    return (
        <>
            {/* Outer card wrapper - modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">

                {/* edit container */}
                <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">

                    <h3 className="text-sm font-bold text-gray-900 mb-3 text-left">Edit Profile Bio</h3>

                    <form onSubmit={editProfileBio} className="space-y-6">

                        {/* textarea */}
                        <div className="relative">
                            <textarea
                                name="profileBio"
                                placeholder="What's on your mind?"
                                value={profileBio}
                                onChange={(e) => setProfileBio(e.target.value)}
                                className="w-full min-h-30 p-3 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg resize-none focus:outline-none text-xs bg-gray-50/50 transition-all focus:border-zinc-400"
                            ></textarea>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-[11px] p-2 rounded-lg font-medium border border-red-100 text-left">
                                {error}
                            </div>
                        )}

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
                                Update Profile Bio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProfileBio;