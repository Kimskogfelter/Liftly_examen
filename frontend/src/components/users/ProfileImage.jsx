import React from "react";
import defaultProfileImage from "../../assets/images/Liftly_profile_avatar_image.png";

function ProfileImage({ currentUser, profileImage }) {
  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <img
        src={profileImage || currentUser?.profileImage || defaultProfileImage}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ProfileImage;