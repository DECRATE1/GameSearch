import { RefObject } from "react";
import { GameDto } from "../DTOS/GameDTO";
import GameSearchElement from "./GameSearchElement";

//Хранилище для поисковика
export default function SearchWall({
  searchResults,
  ref,
}: {
  ref: RefObject<null>;
  searchResults: GameDto[];
}) {
  return (
    <ul
      className="bg-black/65 w-full min-h-15 absolute top-12 rounded-[10px] flex flex-col gap-5 py-2 px-1 box-border select-none"
      ref={ref}
    >
      {searchResults.map((game, index) => {
        return (
          <GameSearchElement
            key={game.id! + index}
            title={game.name!}
            metacritic={game!.metacritic!}
            genre={game.genres}
            id={game.id + ""}
            url={game.imageUrl}
          ></GameSearchElement>
        );
      })}
    </ul>
  );
}
