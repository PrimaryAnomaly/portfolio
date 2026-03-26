"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectDetailPage = pathname.startsWith("/projects/") && pathname !== "/projects";
  const showSharedChrome = pathname !== "/" && !isProjectDetailPage;

  return (
    <div className="min-h-screen flex flex-col">
      {showSharedChrome && <Header />}
      <main className="flex-1">{children}</main>
      {showSharedChrome && <Footer />}
    </div>
  );
}
