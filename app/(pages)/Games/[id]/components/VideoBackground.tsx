"use client";

import { useEffect, useState } from "react";

type VideoBackGroundParams = {
  handleVideoOpacity: (num: number) => void;
  videoOpacity: number;
  movies: string;
};

export default function VideoBackground({
  handleVideoOpacity,
  videoOpacity,
  movies,
}: VideoBackGroundParams) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <div>
      <video
        controls
        muted
        loop
        onLoadStart={() => handleVideoOpacity(0)}
        onPlay={() => handleVideoOpacity(70)}
        disablePictureInPicture
        onChange={() => handleVideoOpacity(0)}
        preload="auto"
        playsInline
        autoPlay
        style={{ opacity: videoOpacity + "%" }}
        className="pointer-events-none h-[600px] w-full object-cover absolute z-0 transition-opacity delay-75 duration-300 rounded-full"
      >
        <source src={movies} type="video/mp4"></source>
      </video>

      <div className="w-full h-[600px] bg-radial-[at_50%_-55%] to-[#151515] to-75% via-65% via-[#151515] absolute z-0"></div>
    </div>
  );
}
