import React from "react";
import defaultProfileImage from "../../assets/images/Liftly_profile_avatar_image.png";

function ProfileImage({ currentUser, profileImage }) {
  
  const rawImage = profileImage || currentUser?.profileImage;

  // Om bilden finns, häng på en cache-buster parameter baserat på när profilen uppdaterades (eller fallback till tid)
  // Detta tvingar mobilens webbläsare att förstå att det är en NY bild fast URL:en i grunden är samma
  const imageSrc = rawImage 
    ? `${rawImage}${rawImage.includes('?') ? '&' : '?'}v=${currentUser?.updatedAt || '1'}`
    : defaultProfileImage;



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