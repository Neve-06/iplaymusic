"use client"
import { useState, useRef, useEffect } from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";
import ProgressBar from "./ProgressBar";
import Image from "next/image"; 

export default function Player({ track }) {
  // Only log when track actually changes, not on every render
  useEffect(() => {
    console.log("Track changed:", track);
  }, [track?.track?.id]); // Only log when track ID changes

  const [isplaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef();
  function togglePlayer(event) {
    console.log("player started");

    if (isplaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  }

  const handleTimeUpdate = () => {
    if (!playerRef.current) return;
    setPosition(playerRef.current.currentTime * 1000); // Convert seconds to milliseconds
  };

  const handleLoadedMetadata = () => {
    if (!playerRef.current) return;
    setDuration(playerRef.current.duration * 1000 || 0); // Convert seconds to milliseconds
  };

  return (
    <>
      <li className="list-none">
        <Image src="/player.png" alt="Player" width={300} height={50} className="rounded mt-20 mb-10" />
        <button onClick={togglePlayer} type="submit" className="text-white bg-linear-to-br from-pink-600 to-orange-600 rounded-full p-2 hover:from-pink-700 hover:to-orange-700">
          {isplaying ? <MdPause /> : <MdPlayArrow />}
        </button>
        <span>{track.track.name}</span>
        <span>{track.track.artists[0].name}</span>
        <audio
          ref={playerRef}
          src="/Whats-going-on.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        ></audio>
        <ProgressBar position={position} duration={duration} />
      </li>
    </>
  )
}










