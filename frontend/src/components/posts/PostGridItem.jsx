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
        /* Textinlägg - Flex col så text och kategori staplas lodrätt */
        <div className="w-full h-full p-4 flex flex-col items-center justify-between text-center relative z-0">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-xs font-medium line-clamp-4 leading-relaxed">
              {post.content}
            </p>
          </div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider pt-1">
            {post.category || "General"}
          </span>
        </div>
      )}

      {/* TikTok/Instagram-style Overlay vid hover (z-10 så den täcker texten rent) */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-semibold text-xs z-10 backdrop-blur-[2px]">
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