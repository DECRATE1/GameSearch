"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
//Каточка игры на главной странице
export default function GameCard({
  href,
  url,
  title,
  release,
  genres,
}: {
  href: string;
  url?: string;
  title: string;
  release: Date;
  genres: string;
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
      className="w-[460px] h-100 select-none hover:border-zinc-700 transition-all 
      duration-300 hover:shadow-lg/80 shadow-zinc-500/50 bg-zinc-800 
      rounded-b-xl overflow-hidden rounded-t-xl"
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onBlur}
    >
      {isLoad ?
        <div className="flex flex-col w-full h-full gap-2">
          <Image
            src={`${url}`}
            alt={title}
            width={100}
            height={100}
            unoptimized
            onError={() => setIsLoad(false)}
            loading="lazy"
            className="w-full h-full flex items-center object-fill
            justify-center text-center"
            style={{
              width: url!.length > 0 ? "100%" : "80%",
            }}
          ></Image>

          <div className="w-full h-[60%] text-white flex flex-col gap-5 px-4 text-stroke">
            <h5>{title}</h5>
            <ul className="[&>li]:flex [&>li]:justify-between text-lg [&>li]:text-lg [&>li]:[&>p]:text-neutral-400 [&>li]:[&>p]:text-md">
              {genres && (
                <>
                  <li>
                    Жанр: <p>{genres.split(",")[0]}</p>
                  </li>
                  <li>
                    Год:{" "}
                    <p>
                      {release.toLocaleString().split("T").join("").slice(0, 4)}
                    </p>
                  </li>
                </>
              )}
            </ul>
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
