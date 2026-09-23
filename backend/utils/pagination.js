// backend/utils/pagination.js

export const getPagination = (reqQuery, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(reqQuery.page, 10) || 1);
  const limit = Math.max(1, parseInt(reqQuery.limit, 10) || defaultLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const formatPaginatedResponse = (posts, totalPosts, page, limit) => {
  const hasMore = page * limit < totalPosts;
  
  return {
    posts,
    hasMore,
    currentPage: page,
    totalPosts
  };
};