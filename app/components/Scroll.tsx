"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
//Элемент для скролла вверх
export default function Scroll() {
  const path = usePathname();
  const searchParameters = useSearchParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path, searchParameters]);
  return <></>;
}
