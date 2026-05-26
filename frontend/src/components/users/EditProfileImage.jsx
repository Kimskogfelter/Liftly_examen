import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SlPicture } from "react-icons/sl";

function EditProfileImage({ onClose, currentUser, setCurrentUser, getUserInfo }) {

    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");

    // function to edit profile image
    const editProfileImage = async (e) => {
        e.preventDefault();

        // check that a image is choosen before sending req to backend
        if (!profileImage) {
            setError("Please select an image first.");
            return;
        }

        try {

            // send updated data to backend
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/profile-image`, { profileImage }, {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Profile image update request sent successfully:", response.data);


            // after successful post req to backend of profile image
            if (response.status === 200) {

                // extract the new profile image url from response from backend
                const updatedProfileImage = response.data.cloudinaryImagePath;

                // create a new user object to update currentUser state with updated profile image
                const updatedUser = { ...currentUser, profileImage: updatedProfileImage };

                // update state for currentUser in React AND localstorage
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));

                // run getUserInfo function from profile page to make a new get request to backend to update profile image directly
                await getUserInfo();

            }

            // close the EditProfileImage component after successful update
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

                    <h3 className="text-sm font-bold text-gray-900 mb-3 text-left">Edit Profile Image</h3>

                    <form onSubmit={editProfileImage} className="space-y-6">

                        <div className="flex justify-center py-4">
                            <div className="relative w-28 h-28">
                                {/* IF profile image is choosen, display choosen image in preview */}
                                {profileImage ? (
                                    <img
                                        src={URL.createObjectURL(profileImage)}
                                        alt="Preview"
                                        className="w-full h-full rounded-full object-cover border border-gray-200 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs font-medium">
                                        No image
                                    </div>
                                )}

                                {/* image icon to trigger file input below*/}
                                <label
                                    htmlFor="media"
                                    className="absolute bottom-0 right-0 p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-md transition-colors flex items-center justify-center cursor-pointer text-gray-600 hover:text-black"
                                    title={profileImage ? "Change Photo" : "Choose Photo"}
                                >
                                    <SlPicture size={16} />
                                </label>
                            </div>

                            <input
                                className="hidden"
                                type="file"
                                name="media"
                                id="media"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setProfileImage(e.target.files[0]);
                                        setError("");
                                    }
                                }}
                            />
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
                                Update Profile Image
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProfileImage;