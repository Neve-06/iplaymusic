'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { IoChevronBackOutline } from 'react-icons/io5'
import SearchDropdown from './SearchDropdown'
import Image from 'next/image'

/**
 * Header Component
 * 
 * Renders the page header with dynamic title, back button navigation, and search functionality.
 * The header adapts its layout based on the current route (detail pages vs list pages).
 */
export default function Header() {
  const pathname = usePathname()

  /**
   * Returns the appropriate page title based on the current pathname
   */
  const getPageTitle = () => {
    if (pathname === '/') return 'Home'
    if (pathname === '/albums') return 'Albums'
    if (pathname.startsWith('/albums/')) return 'Album Details'
    if (pathname === '/artists') return 'Artists'
    if (pathname.startsWith('/artists/')) return 'Artist Details'
    if (pathname === '/categories') return 'Categories'
    if (pathname.startsWith('/categories/')) return 'Category'
    if (pathname === '/events') return 'Events'
    if (pathname === '/featured') return 'Featured'
    if (pathname === '/home') return 'Home'
    if (pathname === '/playlists') return 'Playlists'
    if (pathname.startsWith('/playlists/')) return 'Playlist'
    if (pathname === '/settings') return 'Settings'
    if (pathname === '/login') return 'Login'
    if (pathname === '/player') return 'Player'
    return 'iPlayMusic'
  }

  /**
   * Determines the appropriate back link URL for detail pages
   * @returns {string|null} The URL to navigate back to, or null if no back button needed
   */
  const getBackLink = () => {
    if (pathname.startsWith('/albums/') && pathname !== '/albums') {
      return '/albums'
    }
    if (pathname.startsWith('/playlists/') && pathname !== '/playlists') {
      return '/playlists'
    }
    if (pathname.startsWith('/categories/') && pathname !== '/categories') {
      return '/categories'
    }
    if (pathname.startsWith('/artists/') && pathname !== '/artists') {
      return '/artists'
    }
    if (pathname.startsWith('/player') && pathname !== '/')  {
      return '/'
    }
    return null // No back button needed
  }

  // Check if current page is a detail page (requires special header positioning)
  const isDetailPage =
    (pathname.startsWith('/albums/') && pathname !== '/albums') ||
    (pathname.startsWith('/artists/') && pathname !== '/artists') ||
    (pathname.startsWith('/playlists/') && pathname !== '/playlists')

  // Hide search on detail pages and player page
  const hideSearch = isDetailPage || pathname === '/player'

  // Apply absolute positioning for detail pages (overlays content), relative for others
  const headerClassName = isDetailPage
    ? 'flex justify-between items-center absolute top-0 left-0 w-full px-6 py-4 z-20'
    : 'flex justify-between items-center relative'

  return (
    <header className={headerClassName}>
      {getBackLink() && (
        <Link href={getBackLink()} className="text-2xl text-gray-900 dark:text-white">
          <IoChevronBackOutline />
        </Link>
      )}
      <h1 className="text-2xl font-light text-gray-900 dark:text-white bg-clip-text">{getPageTitle()}</h1>
      <div className={hideSearch ? 'invisible' : ''}>
        <SearchDropdown />
      </div>
    </header>
  )
}
