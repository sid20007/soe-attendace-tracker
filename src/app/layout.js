import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
          <div className="mt-12 flex flex-col items-center gap-2 text-center text-xs text-neutral-600 font-medium tracking-tight">
            <span>Made by Sid from ISE</span>
            <div className="flex items-center gap-3">
              <a href="https://www.sidcv.online/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                Portfolio
              </a>
              <span className="text-neutral-800">•</span>
              <a href="https://github.com/sid20007" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <span className="text-neutral-800">•</span>
              <a href="https://www.linkedin.com/in/siddhartha-g-9761643a8/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                LinkedIn
              </a>
              <span className="text-neutral-800">•</span>
              <a href="https://forms.gle/M3bJcHTvHHH9Tv4s8" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                Report an Issue
              </a>
            </div>
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
