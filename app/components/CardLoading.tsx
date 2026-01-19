"use client";
import { useEffect, useRef, useState } from "react";
//Загрузка карточки игры
export default function CardLoading() {
  const [dots, setDots] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (document.body.style.overflowY != "hidden")
      document.body.style.overflowY = "hidden";
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
      document.body.style.overflowY = "auto";
      clearTimeout(timer.current!);
    };
  }, [dots]);
  return (
    <div
      className="w-[460px] h-90 text-white uppercase font-bold flex justify-center 
        items-center rounded-2xl bg-gray-500/10 bg-clip-padding backdrop-filter 
        backdrop-blur backdrop-saturate-100 backdrop-contrast-100
        animate-[pulse_800ms_ease-out_infinite]"
    >
      {"Loading" + dots}
    </div>
  );
}
