import { Oxanium } from "next/font/google";

import Header from "@/components/header";
import "./globals.css";

const oxanium = Oxanium({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="jp">
      <head />
      <body className={`${oxanium.variable} bg-neutral-200 font-koruri`}>
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
