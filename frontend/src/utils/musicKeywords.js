/**
 * Music keyword utility for Pinteractive.
 * Appends "music" keyword to search queries for music-themed results.
 */

/**
 * Append "music" keyword to a search query.
 * This ensures Unsplash returns music-related images.
 *
 * @param {string} query - The original search query
 * @returns {string} - The query with "music" appended
 *
 * @example
 * appendMusicKeyword("chill") // returns "chill music"
 * appendMusicKeyword("sad vibes") // returns "sad vibes music"
 * appendMusicKeyword("rock music") // returns "rock music" (already has "music")
 * appendMusicKeyword("") // returns "music"
 */
export function appendMusicKeyword(query) {
  const trimmedQuery = query.trim().toLowerCase();

  // If query is empty, return just "music"
  if (!trimmedQuery) {
    return "music";
  }

  // Check if the query already contains "music" or music-related terms
  const musicTerms = [
    "music",
    "musical",
    "musician",
    "song",
    "songs",
    "album",
    "vinyl",
    "concert",
    "band",
    "guitar",
    "piano",
    "drums",
    "dj",
    "headphones",
    "spotify",
    "playlist",
  ];

  const hasMusicalTerm = musicTerms.some((term) =>
    trimmedQuery.includes(term)
  );

  if (hasMusicalTerm) {
    // Query already has a music-related term, return as-is
    return query.trim();
  }

  // Append "music" to the query
  return `${query.trim()} music`;
}

/**
 * Get music-themed search suggestions.
 *
 * @returns {string[]} - Array of music-themed search suggestions
 */
export function getMusicSearchSuggestions() {
  return [
    "chill",
    "sad",
    "party",
    "romantic",
    "energetic",
    "melancholic",
    "happy",
    "lo-fi",
    "rock",
    "jazz",
    "hip hop",
    "electronic",
    "classical",
    "indie",
    "pop",
    "retro",
    "80s vibes",
    "summer",
    "night drive",
    "study",
  ];
}


