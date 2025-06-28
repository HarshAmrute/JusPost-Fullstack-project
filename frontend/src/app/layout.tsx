import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { PostProvider } from "@/context/PostContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JusPost",
  description: "A simple messaging app",
  icons: {
    icon: "/juspost-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <UserProvider>
            <PostProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "rgb(30 41 59 / 0.9)",
                    color: "#fff",
                    border: "1px solid #334155",
                    backdropFilter: "blur(4px)",
                  },
                  success: {
                    iconTheme: { primary: "#22c55e", secondary: "#f0fdf4" },
                  },
                  error: {
                    iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
                  },
                }}
              />
            </PostProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
