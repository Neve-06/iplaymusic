import { formatTime } from "../_utils/timeFormat"

export default function ProgressBar({ position, duration }) {
  if (!duration) return null

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span>{formatTime(position)}</span>
      <div className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden">
        <div
          className="bg-white h-full transition-all"
          style={{ width: `${(position / duration) * 100}%` }}
        />
      </div>
      <span>{formatTime(duration)}</span>
    </div>
  )
}
