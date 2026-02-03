'use client'

import { useEffect, useState } from 'react'

/**
 * useAlbumSearch Hook
 * 
 * Custom React hook for searching albums, artists, and tracks via Spotify API.
 * Implements debouncing (300ms) to avoid excessive API calls while typing.
 * 
 * @param {string} query - The search query string
 * @returns {Object} Object containing:
 *   - results: {albums: [], artists: [], tracks: []} - Search results
 *   - isLoading: boolean - Loading state indicator
 */
export default function useAlbumSearch(query) {
  const [results, setResults] = useState({ albums: [], artists: [], tracks: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If input is empty, clear results immediately
    if (!query) {
      setResults({ albums: [], artists: [], tracks: [] })
      return
    }

    // Debounce the request so we don't call the API on every keystroke
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        // Calls our API route, which then talks to Spotify
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults({
            albums: data.albums?.items || [],
            artists: data.artists?.items || [],
            tracks: data.tracks?.items || []
          })
        } else {
          setResults({ albums: [], artists: [], tracks: [] })
        }
      } catch {
        setResults({ albums: [], artists: [], tracks: [] })
      } finally {
        setIsLoading(false)
      }
    }, 300)

    // Cleanup timer if the user keeps typing
    return () => clearTimeout(timer)
  }, [query])

  return { results, isLoading }
}
