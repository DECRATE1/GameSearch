"use client";
import LoadingText from "@/app/components/LoadingText";
import useFetch from "@/app/hooks/useFetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import { createPortal } from "react-dom";
import SetIconModal from "./SetIconModal";
import SimpleError from "@/app/components/SimpleError";
import { GameDto } from "@/app/DTOS/GameDTO";
import GameCard from "@/app/components/GameCard";

export default function UserClient() {
  const [err, setErr] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const router = useRouter();

  const { data: userData, error } = useFetch<{
    user: { name: string; avatar: string };
    games: { game: GameDto; points: string }[];
  }>({
    url: `http://localhost:3001/api/User/GetUserById`,
    requireToken: true,
    method: "GET",
    autoFetch: true,
    refetch: true,
  });

  useEffect(() => {
    if (error) {
      router.push("/SignUp");
    }
  }, [error, router]);

  useEffect(() => {
    if (showModel) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [showModel]);

  const handleModel = () => {
    setShowModel(!showModel);
  };

  const handleError = (err: string) => {
    setErr(err);
    setTimeout(() => setErr(null), 2000);
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div
      className="w-full flex items-center mt-10 flex-col 
    gap-12 select-none"
    >
      {!userData ?
        <LoadingText />
      : <UserInfo
          url={userData.user.avatar}
          handleModel={handleModel}
          username={userData.user.name}
          stats={userData.games.length}
        ></UserInfo>
      }

      <span className="border-t-3 border-gray-500 w-full"></span>
      <div className="w-full h-full flex">
        {userData && userData!.games.length > 0 && (
          <div className="flex w-full h-full gap-3">
            {userData?.games.map((gameData, index) => {
              const game = gameData.game;
              const points = +gameData.points;
              return (
                <div
                  className="w-fit h-fit relative"
                  key={`user game - ${game.id} - ${index}`}
                >
                  <span
                    className="size-10 flex items-center 
                  justify-center text-center absolute 
                  z-2 right-1 top-1 rounded-full p-2"
                    style={{
                      backgroundColor:
                        points >= 7 ? "green"
                        : points >= 5 ? "orange"
                        : "red",
                    }}
                  >
                    {points}
                  </span>
                  <GameCard
                    href={`/Games/${game.id}`}
                    url={game.imageUrl}
                    title={game.name!}
                  ></GameCard>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModel &&
        createPortal(
          <SetIconModal
            onClose={() => setShowModel(false)}
            handleError={handleError}
          ></SetIconModal>,
          document.body,
        )}
      {err &&
        createPortal(<SimpleError err={err}></SimpleError>, document.body)}
    </div>
  );
}
