"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null | undefined;
  isAuthorize: boolean;
  login: ({ key }: { key: string }) => void;
  revoke: ({ accessToken }: { accessToken: string }) => void;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorize, setIsAuthorize] = useState<boolean>(false);
  const handleAuth = ({
    token,
    isAuth,
  }: {
    token: string;
    isAuth: boolean;
  }) => {
    setToken(token);
    setIsAuthorize(isAuth);
  };
  const login = ({ key }: { key: string }) => {
    handleAuth({ token: key, isAuth: true });
  };

  const revoke = ({ accessToken }: { accessToken: string }) => {
    handleAuth({
      isAuth: true,
      token: accessToken,
    });
  };

  useEffect(() => {
    const run = () => {
      fetch("http://localhost:3001/api/Auth/checkRefreshToken", {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error((await res.text()) + "");
        })
        .then((data) => {
          if (data) {
            handleAuth({ isAuth: true, token: data.accessToken });
            return;
          }
          throw new Error("text");
        })
        .catch((err) => {
          const error = err as Error;
          if (error.message === "Token is invalid") {
            handleAuth({ isAuth: false, token: "" });
            setError(error.message);
            return;
          } else if (
            error.message === "NetworkError when attempting to fetch resource."
          ) {
            run();
          }
        });
    };
    run();
  }, []);

  const value: AuthContextType = {
    token,
    isAuthorize,
    login,
    revoke,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
