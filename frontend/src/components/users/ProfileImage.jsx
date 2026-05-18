import React from "react";

function ProfileImage({ image }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300">
      {image && <img src={image} alt="Profile" className="w-full h-full object-cover" />}
    </div>
  );
}       

export default ProfileImage;