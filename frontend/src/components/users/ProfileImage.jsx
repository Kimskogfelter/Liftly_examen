import React from "react";

function ProfileImage({ image }) {
  return (
  
    <div className="w-full h-full rounded-full overflow-hidden">
      <img 
        src={image} 
        alt="Profile" 
        className="w-full h-full object-cover" 
      />
    </div>
  );
}

export default ProfileImage;