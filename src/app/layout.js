import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Phuc AI — Mai Tan Phuc's Portfolio",
  description:
    "Chat with Phuc AI to explore the experience, projects and skills of Mai Tan Phuc, a Full-Stack Developer (ReactJS / NodeJS).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/*
          Google Sans Flex (the typeface Gemini uses, OFL-licensed) isn't in next/font's
          bundled list yet, so it is loaded from Google Fonts. The Vietnamese subset is
          included and served automatically by unicode-range.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout in the App Router is shared by every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&display=swap"
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
