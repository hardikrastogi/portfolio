import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { CursorGlow } from "@/components/cursor-glow";
import { Intro } from "@/components/intro";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Condensed display face for the oversized section headings
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hardik Rastogi — Full Stack Developer",
  description:
    "Portfolio of Hardik Rastogi, a full stack developer building with React, Next.js, Node, Spring Boot and FastAPI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <head>
        {/* Returning visitors (same session) skip the intro — hide it before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("intro-seen")==="1")document.documentElement.classList.add("intro-seen")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Intro />
          <SmoothScroll />
          <CursorGlow />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
