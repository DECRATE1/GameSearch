import { Metadata } from "next";
import { cookies } from "next/headers";
import UserClient from "../components/UserHero";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  return {
    title: username ?? "me",
  };
}

export default function UserPage() {
  return <UserClient />;
}
