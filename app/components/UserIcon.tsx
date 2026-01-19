"use client";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
export default function UserIcon() {
  return (
    <Link href={`/User/me`} className="bg-white size-10 ml-auto rounded-full">
      <i className="flex items-center justify-center size-full">
        <FaUser color="black" className="size-[70%]" />
      </i>
    </Link>
  );
}
