import Image from "next/image";
import Link from "next/link";

//Элемент поиска
export default function GameSearchElement({
  id,
  title,
  genre,
  metacritic,
  url,
}: {
  id: string;
  title: string;
  genre?: string[];
  metacritic?: number;
  url?: string;
}) {
  return (
    <li>
      <Link
        href={`/Games/${id}`}
        className="flex justify-between px-1 hover:bg-white rounded-xl items-center hover:text-black"
      >
        <Image
          src={`${url}`}
          width={30}
          height={30}
          alt="?"
          unoptimized
          loading="lazy"
          className="flex justify-center items-center size-10 rounded-sm object-cover"
        ></Image>
        <div className="flex flex-col text-sm w-full max-w-[65%]">
          <span className=" flex items-center text-[1.05rem]">{title}</span>
          <ul className="text-gray-400 text-[0.9rem] flex flex-wrap">
            {genre!.map((item, index) =>
              index < genre!.length - 1 ?
                <li key={index}>{item}, </li>
              : <li key={index}>{item}</li>,
            )}
          </ul>
        </div>
        <span
          className="size-10 flex justify-center items-center rounded-md text-[#fdfaf4] text-3xl"
          style={{
            background:
              metacritic == undefined ? "grey"
              : metacritic <= 59 ? "red"
              : metacritic <= 74 ? "#e8b011"
              : "#00d20c",
          }}
        >
          {metacritic ?? " "}
        </span>
      </Link>
    </li>
  );
}
