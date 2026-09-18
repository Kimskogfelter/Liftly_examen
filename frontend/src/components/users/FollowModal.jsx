import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProfileImage from './ProfileImage';
import { handleFollowUserToggle } from '../../functions/user/handleFollowUserToggle';
import { IoClose } from 'react-icons/io5';

export const FollowModal = ({ userId, type, isOpen, onClose, currentUser, setCurrentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !userId) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/users/${userId}/${type}`);

                const userList = type === 'following'
                    ? response.data.followingUsers
                    : response.data.followerUsers;

                setUsers(userList || []);
            } catch (error) {
                console.error(`Could not fetch ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userId, type, isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] font-sans"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-base text-gray-900 capitalize">
                        {type === 'following' ? 'Following' : 'Followers'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* Body / User List */}
                <div className="p-4 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="py-8 text-center text-sm text-gray-500">
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-8 text-center text-sm text-gray-400">
                            {type === 'following' ? 'Not following anyone yet.' : 'No followers yet.'}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {users.map((targetUser) => {
                                // 1. Kolla om targetUser._id finns i den inloggade användarens (currentUser) following-array
                                const isAlreadyFollowing = currentUser?.following?.some(
                                    (id) => (id._id || id).toString() === targetUser._id.toString()
                                ) || false;

                                // 2. Säkerställ att vi kollar mot både currentUser.id och currentUser._id
                                const currentUserId = currentUser?.id || currentUser?._id;
                                const isSelf = currentUserId ? currentUserId.toString() === targetUser._id.toString() : false;

                                return (
                                    <li key={targetUser._id} className="py-2.5 flex items-center justify-between gap-3">
                                        <Link
                                            to={`/users/${targetUser._id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 min-w-0 flex-1 p-1 -mx-1 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-gray-100">
                                                <ProfileImage profileImage={targetUser.profileImage} />
                                            </div>
                                            <span className="font-semibold text-sm text-gray-900 truncate">
                                                {targetUser.username}
                                            </span>
                                        </Link>

                                        {/* Visa knappen om det inte är du själv */}
                                        {!isSelf && (
                                            <button
                                                onClick={() => handleFollowUserToggle(targetUser, setUsers, currentUser, setCurrentUser, isAlreadyFollowing)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${isAlreadyFollowing
                                                        ? "bg-gray-100 hover:bg-gray-200 text-black border border-gray-300"
                                                        : "bg-black hover:bg-zinc-800 text-white"
                                                    }`}
                                            >
                                                {isAlreadyFollowing ? "Following" : "Follow"}
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};