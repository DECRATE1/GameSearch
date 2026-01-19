import Image from "next/image";
//Баннер игры на страницы игры
export default function GameBanner({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  return (
    <Image
      src={url}
      alt={`Вертикальный баннер ${name}`}
      unoptimized
      width={100}
      height={100}
      loading="lazy"
      className="w-[460px] h-[215px] object-fill text-center"
    ></Image>
  );
}
