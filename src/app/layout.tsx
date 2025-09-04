import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Background from "./utils/Background";
import Header from "@/components/header";
import Privacy from "@/components/privacy";
import RouteTransition from "@/components/route";
import Footer from "@/components/footer";

const array = localFont({
  src: "./fonts/Array-Regular.otf",
  variable: "--font-array",
  weight: "100 900",
});
const general = localFont({
  src: "./fonts/GeneralSans.ttf",
  variable: "--font-general",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cimion v0.1",
  description: "Something similar to notion, but worse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${array.variable} ${general.variable} antialiased`}>
        <Header />
        <Background />
        <RouteTransition>{children}</RouteTransition>
        <Footer />
        <Privacy />
      </body>
    </html>
  );
}
