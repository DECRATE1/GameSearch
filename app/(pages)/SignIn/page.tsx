"use client";

import { useAuth } from "@/app/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  useEffect(() => {
    document.body.style = "Overflow: hidden";
    return () => {
      document.body.style = "Overflow: auto";
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
    capsLock: "",
  });
  const isCapsLockPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isCapsLock = e.getModifierState("CapsLock");
    if (isCapsLock) {
      setErrors({ ...errors, ["capsLock"]: "Caps Lock is pressed" });
    } else {
      setErrors({ ...errors, ["capsLock"]: "" });
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      const response = await fetch("http://localhost:3001/api/Auth/login", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (response.ok) {
        const body = await response.json();
        login({ key: body.accessToken });
        router.push("/");
      } else throw new Error(response + "");
    } catch (err) {
      console.error((err as Error).message);
    }
  };
  return (
    <div
      className="flex items-center justify-center w-full text-black"
      onSubmit={(e) => onSubmit(e)}
    >
      <form
        className="h-[600px] bg-[#839400] w-[450px] scale-120 rounded-xl flex flex-col items-center box-border"
        autoComplete="off"
      >
        <span className="mt-5 uppercase font-bold text-2xl text-white select-none">
          Вход
        </span>

        <div
          className="flex flex-col w-fit items-center 
          gap-4 [&>input]:outline-0 mt-auto 
          [&>input]:bg-white [&>input]:w-[350px] 
          [&>input]:rounded-xl [&>input]:h-9 
          [&>input]:pl-2 [&>span]:self-start [&>span]:text-pink-800 [&>span]:font-[750]
          [&>span]:uppercase"
        >
          {errors.name && <span>{errors.name}</span>}
          <input
            type="email"
            name="email"
            placeholder="Почта"
            readOnly={true}
            value={formData.email}
            onContextMenu={(e) => e.preventDefault()}
            onFocus={(e) => {
              e.target.placeholder = "";
              e.target.removeAttribute("readonly");
            }}
            onBlur={(e) => {
              e.target.placeholder = "Почта";
              if (e.target.value.length < 1)
                setErrors({ ...errors, [e.target.name]: "Email is required" });
            }}
            onChange={handleChange}
          ></input>
          {errors.email && <span>{errors.email}</span>}
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={formData.password}
            readOnly={true}
            onFocus={(e) => {
              e.target.placeholder = "";
              e.target.removeAttribute("readonly");
            }}
            onBlur={(e) => {
              e.target.placeholder = "Пароль";
              if (e.target.value.length < 1)
                setErrors({
                  ...errors,
                  [e.target.name]: "Password is required",
                });
            }}
            onKeyDown={isCapsLockPressed}
            onChange={handleChange}
            className="select-none"
          ></input>
          {errors.capsLock ||
            (errors.password && (
              <span>{errors.capsLock ? errors.capsLock : errors.password}</span>
            ))}
        </div>

        <button
          className="bg-white rounded-full w-[180px] h-8 mt-auto mb-5 cursor-pointer"
          type="submit"
        >
          Отправить
        </button>
        <Link
          href={"/SignIn"}
          className="mb-5 text-[14px] font-bold uppercase text-white"
        >
          Регистрация
        </Link>
      </form>
    </div>
  );
}
