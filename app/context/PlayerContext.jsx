'use client';

import { createContext, useContext, useState } from 'react';

/**
 * PlayerContext
 * 
 * React Context for managing Spotify Web Playback SDK state across the application.
 * Stores the device ID and ready state for the Spotify player instance.
 * 
 * Used by components that need to control playback or check player readiness.
 */
const PlayerContext = createContext({
  deviceId: null,
  setDeviceId: () => {},
  isReady: false,
  setIsReady: () => {},
});

/**
 * PlayerProvider Component
 * 
 * Context provider that wraps the application to make player state available globally.
 * Should be placed high in the component tree (typically in layout).
 */
export function PlayerProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  return (
    <PlayerContext.Provider value={{ deviceId, setDeviceId, isReady, setIsReady }}>
      {children}
    </PlayerContext.Provider>
  );
}

/**
 * usePlayer Hook
 * 
 * NOTE: NOT currently used in the application - Kept for future implementation
 * 
 * Custom hook to access player context values.
 * @returns {Object} Player context containing deviceId, setDeviceId, isReady, setIsReady
 */
export function usePlayer() {
  return useContext(PlayerContext);
}
