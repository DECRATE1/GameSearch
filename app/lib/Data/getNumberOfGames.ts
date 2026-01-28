import { cache } from "react";

export const getNumberOfGames = cache(async () => {
  const res = await fetch("http://localhost:3001/api/Game/GetNumberOFGames", {
    method: "GET",
  });
  return await res.json();
});
