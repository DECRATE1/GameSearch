"use client";

import GameCard from "./components/GameCard";
import { GameDto } from "./DTOS/GameDTO";
import CardLoading from "./components/CardLoading";

import useFetch from "./hooks/useFetch";
import SetPageBar from "./components/SetPageBar";
import { useSearchParams } from "next/navigation";
import ToolTip from "./components/ToolTip";
import { useAuth } from "./AuthContext";

//Главная страница

export default function Home() {
  const page = useSearchParams().get("page");
  const { isAuthorize, token } = useAuth();
  const { data: games } = useFetch<GameDto[]>({
    url:
      page ?
        `http://localhost:3001/api/Game/GetLast?page=${page}`
      : "http://localhost:3001/api/Game/GetLast",
    requireToken: false,
    method: "GET",
    autoFetch: true,
    refetch: true,
  });

  const { data: numberOfGames } = useFetch<number>({
    url: "http://localhost:3001/api/Game/GetNumberOFGames",
    requireToken: false,
    method: "GET",
    autoFetch: true,
    refetch: true,
  });

  /*useEffect(() => {
    if (isAuthorize)
      fetch("http://localhost:3001/api/User/GetRec", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
  }, [isAuthorize, token]);*/
  return (
    <div className="min-h-screen w-screen flex flex-col gap-9 ">
      {isAuthorize && <div>He/She is authorize</div>}

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

      <SetPageBar
        numberOfGames={numberOfGames!}
        numberOnPage={games?.length}
        page={page}
      ></SetPageBar>
    </div>
  );
}
