import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiMusic } from "react-icons/fi";

function PostGridItem({ post }) {
  const hasMedia = post.media && post.media.length > 0;
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.reduce(
    (total, comment) => total + 1 + (comment.replies?.length || 0),
    0
  ) || 0;

  // kategorietiketten (visar underkategori om den finns)
  const displayCategory = post.subCategory || post.category || "General";

  return (
    <Link
      to={`/posts/${post._id}`}
      className="relative aspect-square rounded-lg overflow-hidden group shadow-sm border border-gray-100 block bg-zinc-900"
    >
      {/* Badges i övre vänstra hörnet (Recipe och/eller Music) */}
      <div className="absolute top-2 left-2 z-20 pointer-events-none flex flex-col gap-1">
        {post.recipe && (
          <span className="bg-amber-500/85 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
            Recipe
          </span>
        )}
        {post.spotifyUrl && (
          <span className="bg-[#1DB954]/90 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
            <FiMusic size={10} /> Music
          </span>
        )}
      </div>

      {hasMedia ? (
        <>
          <img
            src={post.media[0]}
            alt="Post thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Ren text-tagg centrerad längst ner */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-2">
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate block">
              {displayCategory}
            </span>
          </div>
        </>
      ) : (
        /* Textinlägg - Flex col så text och kategori staplas lodrätt */
        <div className="w-full h-full p-4 flex flex-col items-center justify-between text-center relative z-0">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-xs font-medium line-clamp-4 leading-relaxed">
              {post.content}
            </p>
          </div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider pt-1 truncate max-w-full">
            {displayCategory}
          </span>
        </div>
      )}

      {/* TikTok/Instagram-style Overlay vid hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-semibold text-xs z-10 backdrop-blur-[2px]">
        {/* LIKES COUNT */}
        <div className="flex items-center gap-1">
          <FiHeart className="fill-white" size={16} />
          <span>{likesCount}</span>
        </div>
        {/* COMMENTS COUNT */}
        <div className="flex items-center gap-1">
          <FiMessageCircle className="fill-white" size={16} />
          <span>{commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}

export default PostGridItem;