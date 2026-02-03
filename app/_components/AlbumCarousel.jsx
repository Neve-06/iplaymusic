"use client"

import Image from "next/image"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import { useState } from "react"
import Link from "next/link"

/**
 * AlbumCarousel Component
 * 
 * Displays a full-width carousel of albums with navigation arrows.
 * Shows one album at a time with its cover art, name, and artist.
 * Supports both saved albums and new releases data structures.
 * 
 * @param {Array} albums - Array of album objects to display in carousel
 */
export default function AlbumCarousel({ albums }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Navigate to previous album (loops to end if at beginning)
    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? albums.length - 1 : prevIndex - 1
        )
    }

    // Navigate to next album (loops to beginning if at end)
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === albums.length - 1 ? 0 : prevIndex + 1
        )
    }

    if (!albums || albums.length === 0) {
        return <div className="text-center py-8">No albums found</div>
    }

    // Normalize album structure (handles different API response formats)
    const currentAlbum = albums[currentIndex]
    const normalizedAlbum = currentAlbum.album ?? currentAlbum // support both saved albums and new releases
    const albumImage = normalizedAlbum?.images?.[0]

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 space-y-6">
            {/* Carousel Container */}
            <div className="relative bg-linear-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg">
                {/* Album Image */}
                <div className="relative w-full aspect-square bg-gray-700">
                    {albumImage ? (
                        <Link href={`/albums/${normalizedAlbum.id}`}>
                            <Image
                                src={albumImage.url}
                                alt={normalizedAlbum?.name || "Album"}
                                fill
                                className="object-cover"
                                loading="lazy"
                            />
                        </Link>
                    ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200 z-10"
                    aria-label="Previous album"
                >
                    <IoChevronBackOutline size={24} className="text-white" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200 z-10"
                    aria-label="Next album"
                >
                    <IoChevronForwardOutline size={24} className="text-white" />
                </button>
            </div>

            {/* Album Info */}
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                    {normalizedAlbum?.name}
                </h3>
                <p className="text-gray-400 mt-2">
                    {normalizedAlbum?.artists?.[0]?.name}
                </p>
            </div>
        </div>
    )
}