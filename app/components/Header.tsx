"use client";

import Image from "next/image";
import { Jersey_25 } from "next/font/google";
import { FaSearch } from "react-icons/fa";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GameDto } from "../DTOS/GameDTO";
import Link from "next/link";
import SearchWall from "./SearchWall";
import UserIcon from "./UserIcon";
const jersey = Jersey_25({
  weight: "400",
  style: "normal",
});
//Шапка
//const text: string[] = ["lorem ipsum", "ipsum lorem", "i"];
export default function Header() {
  const [isSearchWallOpen, setSearchWallOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GameDto[]>([]);
  const [inputVal, setInputVal] = useState("");
  const searchRef = useRef(null);
  const currTimer = useRef<null | NodeJS.Timeout>(null);
  const search = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setInputVal(e.target.value);
    if (inputVal.length <= 3) {
      setSearchResults([]);
      setSearchWallOpen(false);
      return;
    }
    if (currTimer.current) clearTimeout(currTimer.current);
    const timer = setTimeout(async () => {
      const response = await fetch(
        `http://localhost:3001/api/Game/FindByName?name=${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
      );
      if (response.ok) {
        const body = await response.json();
        setSearchResults(body);
        setSearchWallOpen(true);
      } else {
        setSearchWallOpen(false);
      }
      clearTimeout(currTimer.current!);
      currTimer.current = null;
    }, 1000);
    currTimer.current = timer;
  };

  useEffect(() => {
    document.body.onclick = (e) => {
      if (!searchRef.current) return;
      const SearchWall = searchRef.current;
      if (e.target !== SearchWall) {
        setSearchWallOpen(false);
        setInputVal("");
        return;
      }
      return;
    };
  }, [setSearchWallOpen]);
  return (
    <header
      className={`flex w-full h-22 bg-[#839400] 
        items-center px-10 text-[40px] gap-5 text-white ${jersey.className} select-none mb-2`}
    >
      <Link href={"/"}>
        <Image
          src="/Logo.svg"
          alt="igro-search-logo"
          width={69}
          height={69}
          loading="lazy"
          className="text-white"
        ></Image>
      </Link>

      {/*<ul className="flex gap-[81px]">
        {text.map((str, i) => (
          <li key={"link " + i}>
            <Link href={str}>{str}</Link>
          </li>
        ))}
      </ul>*/}

      <search className="relative flex bg-white w-[300px] h-10 rounded-[15px] px-3 gap-2 box-border text-[20px] justify-center items-center">
        <input
          className="w-full outline-0 text-black"
          value={inputVal}
          onChange={async (e: ChangeEvent<HTMLInputElement>) => await search(e)}
        ></input>

        <FaSearch color="#839400"></FaSearch>

        {searchResults.length > 0 && isSearchWallOpen && (
          <SearchWall
            searchResults={searchResults}
            ref={searchRef}
          ></SearchWall>
        )}
      </search>

      <nav className="w-fit">
        <ul>
          <li>
            <Link href={"/Recomendations"}>recomendations</Link>
          </li>
        </ul>
      </nav>
      <UserIcon></UserIcon>
    </header>
  );
}
