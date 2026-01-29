"use client";
import useFetch from "@/app/hooks/useFetch";
import { ChangeEvent, DragEvent, FormEvent, useState } from "react";

export default function SetIconModal({
  onClose,
  handleError,
}: {
  onClose: () => void;
  handleError: (err: string) => void;
}) {
  const { execute } = useFetch<File>({
    url: `http://localhost:3001/api/User/AddAvatar`,
    method: "PUT",
    requireToken: true,
    autoFetch: false,
    refetch: true,
    requireCache: false,
  });

  const [inputValue, setInputValue] = useState<File | null>();
  const [labelValue, setLabelValue] = useState("Drag or Choose file");
  const [style, setStyle] = useState<{
    drag: { backgroundColor: string };
    label: { color: string };
  }>({
    drag: { backgroundColor: "white" },
    label: { color: "black" },
  });
  const handleStyle = ({
    dragStyleParam,
    labelStyleParam,
  }: {
    dragStyleParam?: string;
    labelStyleParam?: string;
  }) => {
    setStyle({
      drag: { backgroundColor: dragStyleParam ?? style.drag.backgroundColor },
      label: { color: labelStyleParam ?? style.label.color },
    });
  };

  const onDragEnter = () => {
    setLabelValue("DROP");
    handleStyle({ dragStyleParam: "black", labelStyleParam: "white" });
  };

  const onDragExit = () => {
    setLabelValue("Drag or Choose file");
    handleStyle({ dragStyleParam: "white", labelStyleParam: "black" });
  };

  const onDrop = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.dataTransfer.files[0];
    if (value) {
      setLabelValue(value.name);
      setInputValue(value);
      handleStyle({ dragStyleParam: "green" });
    }
  };

  const onDragOver = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const value = e.target.files[0];
    if (!value) return;
    setInputValue(value);
    setLabelValue(value.name);
    handleStyle({ dragStyleParam: "green", labelStyleParam: "white" });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) {
      handleError("No value");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", inputValue);
    try {
      await execute({ body: formData });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex items-center justify-center absolute w-full h-full bg-black/50 z-100">
      <form
        className="bg-blue-500 w-lg h-135 rounded-4xl px-2 py-4 flex flex-col items-center transition-color duration-200 ease-in-out delay-50"
        onSubmit={(e) => onSubmit(e)}
      >
        <span
          className="size-fit flex justify-end cursor-pointer self-end pr-2"
          onClick={onClose}
        >
          X
        </span>
        <div className="relative w-full mt-auto mb-auto flex items-center justify-center">
          <label
            className="absolute text-black pointer-events-none uppercase w-full text-center"
            style={style.label}
            htmlFor="avatar"
          >
            {labelValue}
          </label>
          <input
            id="avatar"
            accept="image/png, image/jpeg, image/jpg"
            style={style.drag}
            className="w-full h-81 rounded-4xl flex text-center cursor-pointer text-transparent"
            type="file"
            title="user avatar"
            name="avatar"
            onDragEnter={onDragEnter}
            onDragExit={onDragExit}
            onDrop={(e) => onDrop(e)}
            onDragOver={(e) => onDragOver(e)}
            onChange={(e) => onChange(e)}
          ></input>
        </div>
        <button
          className="bg-white border-none text-black w-100 h-20 rounded-4xl cursor-pointer"
          style={{
            backgroundColor: style.drag.backgroundColor,
            color: style.label.color,
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
