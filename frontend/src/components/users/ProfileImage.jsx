import React from "react";
import defaultProfileImage from "../../assets/images/Liftly_profile_avatar_image.png";

function ProfileImage({ currentUser, profileImage }) {
  const rawImage = profileImage || currentUser?.profileImage;

  // Bygg bilden med en unikt taggad cache-buster
  const getSrc = () => {
    if (!rawImage) return defaultProfileImage;
    // Om bilden är en base64/lokal fil
    if (rawImage.startsWith("data:") || rawImage.startsWith("blob:")) return rawImage;

    // Använd updatedAt om det finns, annars tvinga omritning när komponenten laddas
    const v = currentUser?.updatedAt || Date.now();
    const separator = rawImage.includes("?") ? "&" : "?";
    return `${rawImage}${separator}v=${v}`;
  };

  const imageSrc = getSrc();

  return (
    <div className="w-full h-full rounded-full overflow-hidden">
      <img
        key={rawImage} // 👈 Använd den RÅA bilden som key. När rawImage ändras från backend -> byggs <img> om!
        src={imageSrc}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ProfileImage;