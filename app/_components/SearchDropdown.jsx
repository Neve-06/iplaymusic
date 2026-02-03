'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaSearch } from "react-icons/fa"
import { useEffect, useRef, useState } from 'react'
import useAlbumSearch from '../_hooks/useAlbumSearch'

/**
 * SearchDropdown Component
 * 
 * Provides a dropdown search interface that appears when clicking the search icon.
 * Features real-time search results for albums, artists, and tracks with debouncing.
 * Results are displayed in categorized sections with preview images.
 */
export default function SearchDropdown() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const searchRef = useRef(null)
  
  // Only perform search when dropdown is open to avoid unnecessary API calls
  const { results, isLoading } = useAlbumSearch(isSearchOpen && isAuthenticated ? searchQuery : '')

  /**
   * Handles form submission - navigates to albums page with search query
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    router.push(`/albums?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
  }

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check authentication status when the dropdown is opened
  useEffect(() => {
    if (!isSearchOpen) return

    let isMounted = true
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        if (isMounted) {
          setIsAuthenticated(Boolean(data?.authenticated))
          setAuthChecked(true)
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false)
          setAuthChecked(true)
        }
      }
    }

    checkAuth()
    return () => {
      isMounted = false
    }
  }, [isSearchOpen])

  const hasResults = results.albums.length > 0 || results.artists.length > 0 || results.tracks.length > 0

  return (
    <div ref={searchRef} className="relative">
      <button
        type="button"
        className="text-2xl"
        onClick={() => setIsSearchOpen((open) => !open)}
        aria-label="Open search"
      >
        <FaSearch />
      </button>

      {isSearchOpen && (
        <div className="absolute right-0 top-12 w-80 bg-linear-to-br from-pink-600 to-orange-600 rounded-2xl p-0.5 shadow-lg z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
            {!authChecked ? (
              <p className="text-center text-sm text-gray-500">Checking login status...</p>
            ) : !isAuthenticated ? (
              <p className="text-center text-sm text-gray-500">
                You must be logged in to use search.
              </p>
            ) : (
              <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search albums, artists, songs..."
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:border-pink-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-linear-to-br from-pink-600 to-orange-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </form>
            )}
            <div className="mt-4 max-h-64 overflow-y-auto">
              {isLoading && <p className="text-center text-sm text-gray-500">Searching...</p>}
              {!isLoading && searchQuery && !hasResults && (
                <p className="text-center text-sm text-gray-500">No results found</p>
              )}
              
              {!isLoading && hasResults && (
                <div className="space-y-4">
                  {/* Artists Section */}
                  {results.artists.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Artists</p>
                      <ul className="space-y-1">
                        {results.artists.slice(0, 3).map((artist) => (
                          <li key={artist.id}>
                            <Link
                              href={`/artists/${artist.id}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {artist.images?.[0] ? (
                                <img
                                  src={artist.images[0].url}
                                  alt={artist.name}
                                  loading="lazy"
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-pink-600 to-orange-600 shrink-0" />
                              )}
                              <p className="font-medium truncate">{artist.name}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Albums Section */}
                  {results.albums.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Albums</p>
                      <ul className="space-y-1">
                        {results.albums.slice(0, 3).map((album) => (
                          <li key={album.id}>
                            <Link
                              href={`/albums/${album.id}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {album.images?.[0] ? (
                                <img
                                  src={album.images[0].url}
                                  alt={album.name}
                                  loading="lazy"
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-300 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{album.name}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {album.artists.map((artist) => artist.name).join(', ')}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tracks Section */}
                  {results.tracks.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Songs</p>
                      <ul className="space-y-1">
                        {results.tracks.slice(0, 3).map((track) => (
                          <li key={track.id}>
                            <Link
                              href={`/albums/${track.album.id}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                              }}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {track.album?.images?.[0] ? (
                                <img
                                  src={track.album.images[0].url}
                                  alt={track.name}
                                  loading="lazy"
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-300 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{track.name}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {track.artists.map((artist) => artist.name).join(', ')}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
