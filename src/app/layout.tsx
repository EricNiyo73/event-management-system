import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Management System",
  description: "Book and manage events easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow">
            <nav className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-xl font-bold text-blue-600 hover:text-blue-700"
                  >
                    EventMaster
                  </Link>

                  <div className="hidden md:flex space-x-4">
                    <Link
                      href="/bookings"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Upcoming
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-grow">{children}</main>
          <Toaster />

          <footer className="bg-blue-600  border-t">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-white text-sm">
                  © {new Date().getFullYear()} EventMaster. All rights reserved.
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link
                    href="/terms"
                    className="text-white hover:text-white text-sm"
                  >
                    Terms
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-white hover:text-gray-600 text-sm"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/contact"
                    className="text-white hover:text-gray-600 text-sm"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
