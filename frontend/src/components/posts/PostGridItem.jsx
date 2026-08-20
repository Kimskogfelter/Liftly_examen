import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle } from "react-icons/fi";

function PostGridItem({ post }) {
  const hasMedia = post.media && post.media.length > 0;
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  return (
    <Link 
      to={`/posts/${post._id}`} 
      className="relative aspect-square rounded-xl overflow-hidden group shadow-sm block bg-zinc-900"
    >
      {hasMedia ? (
        <img 
          src={post.media[0]} 
          alt="Post thumbnail" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      ) : (
        <div className="w-full h-full p-3.5 flex flex-col justify-between text-left">
          <p className="text-white text-xs font-medium line-clamp-4 leading-relaxed">
            {post.content}
          </p>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            {post.category || "Text"}
          </span>
        </div>
      )}

      {/* TikTok/Instagram-style Overlay vid hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-semibold text-xs">
        <div className="flex items-center gap-1">
          <FiHeart className="fill-white" size={16} />
          <span>{likesCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiMessageCircle className="fill-white" size={16} />
          <span>{commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}

export default PostGridItem;