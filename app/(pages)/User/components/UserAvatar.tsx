import Image from "next/image";

export default function UserAvatar({
  url,
  handleModel,
}: {
  url?: string;
  handleModel: () => void;
}) {
  return (
    <i
      onClick={handleModel}
      className="group size-32 flex items-center justify-center relative rounded-full overflow-hidden 
          cursor-pointer"
      style={{ backgroundColor: !url ? "red" : "none" }}
    >
      {url && (
        <Image
          src={url}
          width={300}
          height={300}
          className="object-cover w-full h-full"
          alt={`user avatar - ${url}`}
          unoptimized
          loading="lazy"
        ></Image>
      )}
      <span
        className="group-hover:opacity-100 text-4xl group-hover:bg-black/50 font-sans opacity-0 w-full h-full 
            flex items-center justify-center rounded-full leading-none absolute"
      >
        +
      </span>
    </i>
  );
}
