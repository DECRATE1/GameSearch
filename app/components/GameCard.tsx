"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
//Каточка игры на главной странице
export default function GameCard({
  href,
  url,
  title,
}: {
  href: string;
  url?: string;
  title: string;
}) {
  const [isLoad, setIsLoad] = useState(true);
  const [isOverLink, setItsOverLink] = useState(false);

  const handleOverLink = () => {
    setItsOverLink(!isOverLink);
  };

  const onEnter = () => {
    handleOverLink();
  };

  const onBlur = () => {
    handleOverLink();
  };

  return (
    <Link
      className="w-[460px] h-100 select-none text-center"
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onBlur}
    >
      {isLoad ?
        <div className="flex flex-col w-full h-full rounded-t-3xl overflow-hidden bg-[#839400] gap-2 rounded-b-xl">
          <Image
            src={`${url}`}
            alt={title}
            width={100}
            height={100}
            unoptimized
            onError={() => setIsLoad(false)}
            loading="lazy"
            className="w-full h-full flex items-center object-fill
            justify-center text-center rounded-xl"
            style={{
              width: url!.length > 0 ? "100%" : "80%",
            }}
          ></Image>

          <div className="w-full h-30 bg-[#839400] text-white uppercase font-bold">
            <span>{title}</span>
          </div>
        </div>
      : <div
          className="bg-linear-to-tr/shorter from-50% from-[#839400]/50 to-[#151515] 
          to-100% w-full h-full flex justify-center items-center 
          hover:from-[#839400]/90 hover:to-100% hover:to-[#839400] 
          transition-colors duration-250 ease-linear delay-100 select-none"
        >
          {title}
        </div>
      }
    </Link>
  );
}
