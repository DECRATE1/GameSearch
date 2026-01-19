import Link from "next/link";

type HeroProps = {
  name: string;
  genres?: string;
  publishers?: string;
  developers?: string;
  webSite?: string;
  url?: URL;
  released?: Date;
  categories?: string;
  linuxIsSupported?: boolean;
  macIsSupported?: boolean;
  achivements?: number;
  supportedLanguages?: string[];
  fullAudioLanguages?: string[];
  aboutTheGame?: string;
};
export default function Hero({
  name,
  genres,
  publishers,
  developers,
  webSite,
  url,
  released,
  categories,
  linuxIsSupported,
  macIsSupported,
  achivements,
  supportedLanguages,
  fullAudioLanguages,
  aboutTheGame,
}: HeroProps) {
  const monthNames = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентебря",
    "Октября",
    "Ноября",
    "Декабря",
  ];
  return (
    <div className="w-full flex flex-col gap-10 pl-5 uppercase">
      <h1 className="uppercase font-bold flex h-fit w-full">{name}</h1>
      <ul className="flex flex-col gap-2">
        <li>Жанры: {genres ? genres.split(",").join(", ") : "-"}</li>
        <li>Издатели: {publishers ? publishers.split(",").join(", ") : "-"}</li>
        <li>Разработчик: {developers}</li>
        {webSite && (
          <li>
            Веб-сайт:{" "}
            <Link
              href={url ? url.href! : "/"}
              className="hover:text-yellow-400"
            >
              {url ? url.hostname : ""}
            </Link>
          </li>
        )}
        <li>
          Дата релиза:{" "}
          {released
            ? released
                .toString()
                .slice(0, 10)
                .split("-")
                .reverse()
                .map((el: string, i: number) =>
                  i == 1 ? monthNames[+el - 1] : el
                )
                .join(" ")
            : "-"}
        </li>
        <li>Категории: {categories?.split(",").join(", ")}</li>
        <li>
          Устройства: {linuxIsSupported ? "linux, " : ""}
          {macIsSupported ? "mac, " : ""} windows
        </li>
        <li>Колличество достижений: {achivements}</li>
        <li>Поддерживаемые языки: {supportedLanguages?.join(", ")}</li>
        <li className="normal-case">О игре: {<p>{aboutTheGame!}</p>}</li>
      </ul>
    </div>
  );
}
