import api from "../../api/axios";

export const handleFollowUserToggle = async (
    targetUser,
    setTargetUser,
    currentUser,
    setCurrentUser,
    isAlreadyFollowing
) => {
    try {
        const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
        const targetUserId = (targetUser?._id || targetUser?.id)?.toString();

        if (isAlreadyFollowing) {
            // Unfollow user
            const response = await api.delete(`/users/${targetUserId}/unfollow`);
            console.log("Unfollowed user successfully:", response.data);

            // 1. Uppdatera den profil du kollar på (ta bort ditt ID från deras followers)
            if (setTargetUser) {
                setTargetUser((prev) => {
                    if (Array.isArray(prev)) {
                        return prev.map((u) =>
                            u._id.toString() === targetUserId
                                ? { ...u, followers: (u.followers || []).filter((id) => (id._id || id).toString() !== currentUserId) }
                                : u
                        );
                    }
                    return {
                        ...prev,
                        followers: (prev?.followers || []).filter((id) => (id._id || id).toString() !== currentUserId)
                    };
                });
            }

            // 2. Uppdatera din egen inloggade användare (ta bort deras ID från din following)
            if (setCurrentUser) {
                setCurrentUser((prev) => ({
                    ...prev,
                    following: (prev?.following || []).filter((id) => (id._id || id).toString() !== targetUserId)
                }));
            }

        } else {
            // Follow user
            const response = await api.post(`/users/${targetUserId}/follow`, {});
            console.log("Followed user successfully:", response.data);

            // 1. Uppdatera den profil du kollar på (lägg till ditt ID i deras followers)
            if (setTargetUser) {
                setTargetUser((prev) => {
                    if (Array.isArray(prev)) {
                        return prev.map((u) =>
                            u._id.toString() === targetUserId
                                ? { ...u, followers: [...(u.followers || []), currentUserId] }
                                : u
                        );
                    }
                    return {
                        ...prev,
                        followers: [...(prev?.followers || []), currentUserId]
                    };
                });
            }

            // 2. Uppdatera din egen inloggade användare (lägg till deras ID i din following)
            if (setCurrentUser) {
                setCurrentUser((prev) => ({
                    ...prev,
                    following: [...(prev?.following || []), targetUserId]
                }));
            }
        }
    } catch (err) {
        console.error("Error toggling follow:", err);
    }
};