import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "P-Wallet",
  description: "Sistema premium de gestión de inventario y datos",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "P-Wallet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
            <MobileNav />
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('ServiceWorker registration successful');
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
                
                // Capture deferred prompt for PWA
                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  window.deferredPrompt = e;
                });
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
