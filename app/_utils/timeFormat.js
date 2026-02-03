/**
 * formatTime Utility
 * 
 * Converts milliseconds to a human-readable time format (M:SS)
 * Commonly used for displaying track durations.
 * 
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string (e.g., "3:45", "12:03")
 */
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
