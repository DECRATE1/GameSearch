import Hero from "./components/Hero";
import SetPageBar from "./components/SetPageBar";
import { getNumberOfGames } from "./lib/Data/getNumberOfGames";

//Главная страница
export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const numberOfGames = await getNumberOfGames();
  const page = (await searchParams).page;

  return (
    <div className="min-h-screen w-screen flex flex-col gap-9 ">
      <Hero></Hero>
      <SetPageBar numberOfGames={numberOfGames!} page={page}></SetPageBar>
    </div>
  );
}
