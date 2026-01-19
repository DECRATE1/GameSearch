import Image from "next/image";

export default function GameRightBorder({
  metacriticScore,
}: {
  metacriticScore?: number;
}) {
  return (
    <div className="flex w-[25%]">
      <ul className="flex gap-2 h-fit w-full">
        <li
          className="size-[90px] p-2 box-border flex justify-center items-center rounded-md text-[#fdfaf4] text-3xl select-none font-black"
          style={{
            background:
              metacriticScore == undefined || metacriticScore == 0 ? "grey"
              : metacriticScore <= 59 ? "red"
              : metacriticScore <= 74 ? "#e8b011"
              : "#00d20c",
          }}
        >
          {metacriticScore == undefined || metacriticScore == 0 ?
            "-"
          : metacriticScore}
        </li>

        <li className="flex items-center justify-center">
          {/*Символ метакритика*/}
          <Image
            className="flex items-center justify-between scale-100"
            src="/metacritic.svg"
            alt="Метакритик"
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </li>
      </ul>
    </div>
  );
}
