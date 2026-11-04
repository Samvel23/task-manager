// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { preinit } from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "TaskFlow | Make room for what matters",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  preinit("/theme-init.js", { as: "script" });

  return (
    <html
      lang="en"
      className={geistMono.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
