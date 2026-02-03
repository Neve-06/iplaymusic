"use client"

import Player from "../_components/Player.jsx"

export default function Playerpage() {
    // Mock track data since the Player component expects a track prop
    const mockTrack = {
        track: {
            name: "Sample Song",
            artists: [{ name: "Sample Artist" }]
        }
    }

    return (
        <>
            <Player track={mockTrack} />
        </>
    )
}