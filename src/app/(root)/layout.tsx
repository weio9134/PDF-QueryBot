import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/Provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF QueryBot",
  description: "Upload a PDF and get instant answers to your questions about its content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <Provider>
        <html lang="en">
          <body className={`${inter.className} overflow-hidden`}>
            <Toaster />
            {children}
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
