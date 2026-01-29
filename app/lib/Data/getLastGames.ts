import { GameDto } from "@/app/DTOS/GameDTO";

export const getLastGames = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/Game/GetLast", {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const body: GameDto[] = await response.json();
      return body;
    } else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    if ((err as Error).message == "Unauthorized") {
      return "/SignUp";
    }
  }
};
