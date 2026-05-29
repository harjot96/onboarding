import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  title: "ProjectFlow – PM Suite",
  description: "Project Management Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-100 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
