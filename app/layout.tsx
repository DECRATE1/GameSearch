import { Metadata } from "next";
import Header from "./components/Header";
import Scroll from "./components/Scroll";
import "./globals.css";
import { Unbounded } from "next/font/google";
import { AuthProvider } from "./AuthContext";
import { Suspense } from "react";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameSearch",
  description: "GameSearch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`flex flex-col items-center bg-[#151515] text-white ${unbounded.className}`}
      >
        <Suspense>
          <AuthProvider>
            <Scroll></Scroll>

            <Header></Header>

            <main className="flex max-w-[1440px] w-screen min-h-screen bg-[#151515]">
              {children}
            </main>
          </AuthProvider>

          <div className="portal-root"></div>
        </Suspense>
      </body>
    </html>
  );
}
