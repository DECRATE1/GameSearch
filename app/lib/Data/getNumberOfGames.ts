import { cache } from "react";

export const getNumberOfGames = async () => {
  const res = await fetch("http://localhost:3001/api/Game/GetNumberOFGames", {
    method: "GET",
    cache: "force-cache",
  });
  return await res.json();
};
