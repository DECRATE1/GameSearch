import GamePageClient from "@/app/(pages)/Games/[id]/components/GamePageTopPart";
import { GameDto } from "@/app/DTOS/GameDTO";
import { getGame } from "@/app/lib/Data/getGame";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const game: GameDto = await getGame(id);

  return {
    title: game.name,
    description: `Game name: ${game.name ?? ""}, developed by: ${
      game.developers ?? ""
    }, published by: ${game.publishers}`,
  };
}

//Страница игры
export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const game = await getGame(id);
  return <GamePageClient gameData={game}></GamePageClient>;
}
