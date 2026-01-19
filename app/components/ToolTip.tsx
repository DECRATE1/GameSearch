import { ReactNode, useRef, useState } from "react";

type ToolTipProps = {
  label: string;
  children: ReactNode;
};

export default function ToolTip({ label, children }: ToolTipProps) {
  const [labelIsHidden, setLabelIsHidden] = useState(true);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  return (
    <div
      className="flex flex-col w-fit h-fit items-center justify-center"
      onMouseMove={(e) => {
        setLabelIsHidden(false);

        if (!spanRef.current) return;
        const offsetX = 5;
        const offsetY = 25;
        const x = e.pageX - offsetX;
        const y = e.pageY + offsetY;

        spanRef.current.style.left = `${x}px`;
        spanRef.current.style.top = `${y}px`;
      }}
      onMouseLeave={() => setLabelIsHidden(true)}
    >
      <span
        ref={spanRef}
        className="bg-black rounded-2xl px-2 absolute z-10 transition-opacity pointer-events-none select-none"
        style={{
          opacity: labelIsHidden ? 0 : 1,
          transitionDelay: !labelIsHidden ? "1000ms" : "0ms",
          transitionDuration: !labelIsHidden ? "300ms" : "0ms",
        }}
      >
        {label}
      </span>

      {children}
    </div>
  );
}
