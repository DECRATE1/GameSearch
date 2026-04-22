export const getNumberOfGames = async () => {
  const res = await fetch("http://0.0.0.0:3001/api/Game/GetNumberOFGames", {
    method: "GET",
    cache: "force-cache",
  });
  return await res.json();
};
