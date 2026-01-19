export default function SimpleError({ err }: { err: string }) {
  return (
    <div
      className="color-white absolute bottom-0 
    right-0 transition-transform animate-fadein"
    >
      {err}
    </div>
  );
}
