"use client";
import CardLoading from "@/app/components/CardLoading";
import LoadingText from "@/app/components/LoadingText";
import RightBorderLoading from "@/app/components/WallLoading";
import { useMemo, useState } from "react";
import GameBanner from "./GameBanner";

import VideoBackground from "./VideoBackground";
import RatingBar from "./RatingBar";
import { GameDto } from "@/app/DTOS/GameDTO";
import Hero from "./Hero";
import GameRightBorder from "./GameRightBorder";

//Вверхняя часть от страницы игры
export default function GamePageClient({ gameData }: { gameData: GameDto }) {
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [ratingIsHide, setRatingIsHide] = useState(true);

  const url = useMemo(() => {
    if (!gameData || !gameData.webSite) return;
    return new URL(gameData.webSite!);
  }, [gameData]);

  const handleVideoOpacity = (num: number) => {
    setVideoOpacity(num);
  };

  const handleRatingIsHide = () => {
    setRatingIsHide(!ratingIsHide);
  };

  return (
    <div className="w-full flex overflow-x-hidden relative">
      {gameData?.movies && (
        <VideoBackground
          handleVideoOpacity={handleVideoOpacity}
          videoOpacity={videoOpacity}
          movies={gameData.movies}
        />
      )}

      <div className="z-10 text-white w-full flex justify-between gap-1">
        <div className="min-w-[416px] max-w-[40%] w-[40%] flex flex-col items-center gap-10">
          {!gameData ? (
            <CardLoading></CardLoading>
          ) : (
            <>
              <GameBanner
                url={gameData.imageUrl!}
                name={gameData.name!}
              ></GameBanner>
              <RatingBar
                ratingIsHide={ratingIsHide}
                handleRatingIsHide={handleRatingIsHide}
              ></RatingBar>
            </>
          )}
        </div>

        {/*Центральная часть страницы игры*/}
        {!gameData ? (
          <LoadingText></LoadingText>
        ) : (
          <Hero
            name={gameData.name!}
            genres={gameData.genres}
            publishers={gameData.publishers}
            developers={gameData.developers}
            webSite={gameData.webSite}
            url={url}
            released={gameData.released}
            categories={gameData.categories}
            linuxIsSupported={gameData.linux}
            macIsSupported={gameData.mac}
            achivements={gameData.achivements}
            supportedLanguages={gameData.supportedLanguages}
            aboutTheGame={gameData.aboutTheGame}
          ></Hero>
        )}

        {/*Правая часть страницы игры*/}
        {!gameData ? (
          <RightBorderLoading></RightBorderLoading>
        ) : (
          <GameRightBorder
            metacriticScore={gameData.metacriticScore}
          ></GameRightBorder>
        )}
      </div>
    </div>
  );
}
