import React from "react";
import defaultProfileImage from "../../assets/images/Liftly_profile_avatar_image.png";

function ProfileImage({ currentUser, profileImage }) {
  const imageSrc = profileImage || currentUser?.profileImage || defaultProfileImage;

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <img
        key={imageSrc} // Tvingar React att rita om bilden direkt när URL ändras
        src={imageSrc}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ProfileImage;