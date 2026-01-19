import { cache } from "react";

export const getUser = cache(
  async ({ userId, token }: { userId: string; token: string }) => {
    const response = await fetch(
      `http://localhost:3001/api/User/GetUserById/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error(response.status.toString());
  }
);
