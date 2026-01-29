//Получить игру по id
export const getGame = async (id: string) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/Game/GetByGameId/${id}`,
      {
        method: "GET",
        cache: "force-cache",
      },
    );

    if (response.ok) {
      const body = await response.json();
      return body;
    } else throw new Error(response + "");
  } catch (err) {
    console.error(err);
  }
};
