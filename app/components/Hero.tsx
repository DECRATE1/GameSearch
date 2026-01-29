"use client";
import { useSearchParams } from "next/navigation";
import useFetch from "../hooks/useFetch";
import { GameDto } from "../DTOS/GameDTO";
import CardLoading from "./CardLoading";
import ToolTip from "./ToolTip";
import GameCard from "./GameCard";

export default function Hero() {
  const page = useSearchParams().get("page");
  const { data: games } = useFetch<GameDto[]>({
    url:
      page ?
        `http://localhost:3001/api/Game/GetLast?page=${page}`
      : "http://localhost:3001/api/Game/GetLast",
    requireToken: false,
    method: "GET",
    autoFetch: true,
    refetch: true,
    requireCache: false,
  });

  return (
    <div className="flex-wrap flex gap-x-4 gap-y-8">
      {!games || games.length === 0 ?
        Array.from({ length: 20 }).map((_, index) => {
          return <CardLoading key={"loading" + index}></CardLoading>;
        })
      : games.map((game, index) => {
          if (!game.name) return;
          return (
            <ToolTip key={game.name + index} label={`${game.name}`}>
              <GameCard
                href={`/Games/${game.id}`}
                title={game.name!}
                url={game.imageUrl}
                genres={game.genres!}
                release={game.released!}
              ></GameCard>
            </ToolTip>
          );
        })
      }
    </div>
  );
}
