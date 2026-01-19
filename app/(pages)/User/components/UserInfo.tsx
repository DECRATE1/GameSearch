import UserAvatar from "./UserAvatar";

export default function UserInfo({
  url,
  handleModel,
  username,
  stats,
}: {
  url: string;
  handleModel: () => void;
  username: string;
  stats: number;
}) {
  return (
    <div className="flex gap-10 h-fit">
      <UserAvatar url={url} handleModel={handleModel}></UserAvatar>
      <div className="flex flex-col gap-1">
        <h4 className="font-bold">{username}</h4>
        <ul className="flex gap-8 capitalize">
          <li>Игр: {stats}</li>
        </ul>
      </div>
    </div>
  );
}
