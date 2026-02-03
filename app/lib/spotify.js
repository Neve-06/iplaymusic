/**
 * Spotify Web API helper functions
 * These are designed to be used in server components or API routes
 */

const SPOTIFY_API = "https://api.spotify.com/v1";

/**
 * Search albums, artists, and tracks
 * Server-side only: call Spotify directly with the user's access token
 * @param {string} accessTokenCookie
 * @param {string} query
 * @param {number} limit
 */
export async function searchAlbums(accessTokenCookie, query, limit = 10) {
  const response = await fetch(
    `${SPOTIFY_API}/search?q=${encodeURIComponent(query)}&type=album,artist,track&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessTokenCookie}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search");
  }

  return response.json();
}

/**
 * ========================================
 * NOTE: The functions below are NOT currently used in the application
 * They are kept for potential future playback control features
 * ========================================
 */

/**
 * Get current playback state
 * NOT USED - Kept for future implementation
 */
export async function getCurrentPlayback(accessTokenCookie) {
  const response = await fetch(`${SPOTIFY_API}/me/player`, {
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playback state");
  }

  return response.json();
}

/**
 * Play a track, album, or playlist
 * NOT USED - Kept for future implementation
 * @param {string} accessTokenCookie
 * @param {object} options - { context_uri?, uris?, device_id? }
 */
export async function playTrack(accessTokenCookie, options = {}) {
  let url = `${SPOTIFY_API}/me/player/play`;
  if (options.device_id) {
    url += `?device_id=${options.device_id}`;
  }
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Spotify API error: ${response.status} ${JSON.stringify(errorData)}`);
  }
}

/**
 * Pause playback
 * NOT USED - Kept for future implementation
 */
export async function pausePlayback(accessTokenCookie) {
  const response = await fetch(`${SPOTIFY_API}/me/player/pause`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to pause playback");
  }
}

/**
 * Skip to next track
 * NOT USED - Kept for future implementation
 */
export async function nextTrack(accessTokenCookie) {
  const response = await fetch(`${SPOTIFY_API}/me/player/next`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to skip to next track");
  }
}

/**
 * Skip to previous track
 * NOT USED - Kept for future implementation
 */
export async function previousTrack(accessTokenCookie) {
  const response = await fetch(`${SPOTIFY_API}/me/player/previous`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to skip to previous track");
  }
}

/**
 * Seek to position (in milliseconds)
 * NOT USED - Kept for future implementation
 */
export async function seekToPosition(accessTokenCookie, positionMs) {
  const response = await fetch(
    `${SPOTIFY_API}/me/player/seek?position_ms=${positionMs}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessTokenCookie}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to seek");
  }
}

/**
 * Set volume
 * NOT USED - Kept for future implementation
 * @param {string} accessTokenCookie
 * @param {number} volumePercent - 0-100
 */
export async function setVolume(accessTokenCookie, volumePercent) {
  const response = await fetch(
    `${SPOTIFY_API}/me/player/volume?volume_percent=${volumePercent}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessTokenCookie}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to set volume");
  }
}

/**
 * Get available devices
 * NOT USED - Kept for future implementation
 */
export async function getDevices(accessTokenCookie) {
  const response = await fetch(`${SPOTIFY_API}/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${accessTokenCookie}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch devices");
  }

  return response.json();
}
