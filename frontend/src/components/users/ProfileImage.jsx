import React from "react";
import defaultProfileImage from "../../assets/images/Liftly_profile_avatar_image.png";

function ProfileImage({ currentUser }) {

  return (

    <div className="w-full h-full rounded-full overflow-hidden">
      <img
        src={currentUser?.profileImage || defaultProfileImage} // if logged in user show logged in users profile image, else show default image imported at the top
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ProfileImage;