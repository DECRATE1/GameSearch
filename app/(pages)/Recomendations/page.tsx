"use client";

import CardLoading from "@/app/components/CardLoading";
import GameCard from "@/app/components/GameCard";
import ToolTip from "@/app/components/ToolTip";
import { GameDto } from "@/app/DTOS/GameDTO";
import useFetch from "@/app/hooks/useFetch";
import { useEffect } from "react";

export default function RecomendationsPage() {
  const { data: games } = useFetch<GameDto[]>({
    url: "http://localhost:3001/api/Rec/Recommend",
    method: "GET",
    requireToken: true,
    autoFetch: true,
    refetch: false,
  });

  return (
    <div className="min-h-screen w-screen flex flex-col gap-9 ">
      <div className="flex-wrap flex gap-x-4 gap-y-8">
        {!games || games.length === 0 ?
          <div>Пока что рекомендаций нет</div>
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
    </div>
  );
}
