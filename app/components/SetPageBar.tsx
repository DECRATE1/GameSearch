import Link from "next/link";

export default function SetPageBar({
  numberOfGames,
  numberOnPage,
  page,
}: {
  numberOfGames: number;
  numberOnPage?: number;
  page?: string | null;
}) {
  return (
    <div className="flex gap-2 mb-5">
      <ul className="flex gap-2 [&>li]:border-2 [&>li]:w-fit [&>li]:p-0.5 [&>li]:min-w-[30px] [&>li]:flex [&>li]:cursor-pointer text-center select-none">
        {page && +page > 2 && (
          <>
            <li className="size-full">
              <Link className="size-full" href={`/`}>
                1
              </Link>
            </li>
            ...
          </>
        )}
        {page ?
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="size-full">
              <Link
                className="size-full"
                href={
                  +page == 1 ? `/` : (
                    `/?page=${+page >= 2 ? +page - 1 + i : +page - 2 + i}`
                  )
                }
              >
                {+page >= 2 ? +page - 1 + i : +page - 2 + i}
              </Link>
            </li>
          ))
        : Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="size-full">
              <Link className="size-full" href={`/?page=${i + 1}`}>
                {i + 1}
              </Link>
            </li>
          ))
        }
      </ul>
      <ul
        className="flex text gap-2 [&>li]:border-2 [&>li]:w-fit [&>li]:p-0.5
      [&>li]:cursor-pointer text-center select-none"
      >
        ...
        <>
          {numberOnPage && (
            <li>
              <Link
                className="size-full"
                href={`/?page=${Math.ceil(numberOfGames / numberOnPage) - 1}`}
              >
                {Math.ceil(numberOfGames / numberOnPage) - 1}
              </Link>
            </li>
          )}
        </>
      </ul>
    </div>
  );
}
