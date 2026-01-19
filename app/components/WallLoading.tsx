"use client";
import { useEffect, useRef, useState } from "react";

//Элемент загрузки для правой части страницы игры
export default function RightBorderLoading() {
  const [dots, setDots] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const updateDots = () => {
      setDots((prev) => {
        if (prev.length === 3) {
          clearTimeout(timer.current!);
          return "";
        }
        return prev + ".";
      });
    };

    timer.current = setTimeout(updateDots, 500);

    return () => {
      clearTimeout(timer.current!);
    };
  }, [dots]);
  return (
    <div
      className="w-[25%] h-[70%] text-white uppercase font-bold flex justify-center 
        items-center rounded-2xl bg-gray-500/10 bg-clip-padding backdrop-filter 
        backdrop-blur backdrop-saturate-100 backdrop-contrast-100
        animate-[pulse_800ms_ease-out_infinite]"
    >
      Loading{dots}
    </div>
  );
}
