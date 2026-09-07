export const createSpotifyEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
};