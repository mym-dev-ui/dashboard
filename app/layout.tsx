import { Inter } from 'next/font/google';
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";



export const metadata = {
  title: "لوحة تحكم أكوا فلو",
  description: "لوحة تحكم لإدارة متجر المياه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultOpen =true;
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex w-full">
            <AppSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
