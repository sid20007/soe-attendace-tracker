import "./globals.css";

export const metadata = {
  title: "Student Connect",
  description: "Smart attendance tracker and timetable.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Student Connect",
  },
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false, themeColor: '#000000' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-[100dvh] bg-black text-white overflow-x-hidden">
        <main className="max-w-6xl mx-auto px-4 py-6 pb-20 w-full">
          {children}
          <div className="mt-12 text-center text-xs text-neutral-600 font-medium tracking-tight">
            Made by Sid from ISE
          </div>
        </main>
      </body>
    </html>
  );
}
