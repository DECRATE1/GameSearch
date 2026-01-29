import useFetch from "@/app/hooks/useFetch";
import { useParams } from "next/navigation";
import { MouseEvent, useState } from "react";
import { FaStar } from "react-icons/fa";

type RatingBarType = {
  ratingIsHide: boolean;
  handleRatingIsHide: () => void;
};

export default function RatingBar({
  ratingIsHide,
  handleRatingIsHide,
}: RatingBarType) {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const { execute } = useFetch({
    url: `http://localhost:3001/api/User/RateGame/${id}`,
    method: "POST",
    autoFetch: false,
    body: rating,
    requireToken: true,
    refetch: false,
    requireCache: false,
  });
  const onClick = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
    const number = +e.currentTarget.innerHTML;
    if (typeof number !== "number" || !number) return;
    setRating(number);
    execute({ body: JSON.stringify({ Points: number }) });
  };

  return (
    <div className="relative h-10 w-full select-none justify-center flex items-center gap-1">
      <i
        className="size-7 cursor-pointer hover:text-yellow-500 flex items-center 
              justify-center transition-transform duration-300 delay-150 absolute
              ease-in-out z-1"
        onClick={(e) => {
          {
            e.currentTarget.style.translate =
              ratingIsHide ?
                `-${
                  e.currentTarget.parentElement!.getBoundingClientRect().width /
                    2 -
                  e.currentTarget.getBoundingClientRect().width / 1.5
                }px 0px`
              : "0px 0px";
            handleRatingIsHide();
          }
        }}
      >
        <FaStar className="size-full" />
      </i>

      <ul className="w-full flex justify-between px-2 items-center text-center h-full">
        <span className="size-7"></span>
        {Array.from({ length: 10 }).map((_, i) => {
          return (
            <li
              key={"rating-" + i}
              onClick={onClick}
              style={{
                opacity: ratingIsHide ? 0 : 100,
                transitionDelay: ratingIsHide ? "75ms" : "400ms",
                transitionDuration: ratingIsHide ? "100ms" : "500ms",
                pointerEvents: ratingIsHide ? "none" : "auto",
              }}
              className="hover:text-green-500 size-8 flex items-center justify-center transition-opacity ease-in-out cursor-pointer"
            >
              {i + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
