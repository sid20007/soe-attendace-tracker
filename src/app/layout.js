import "./globals.css";

export const metadata = {
  title: "SOE Attendance Tracker",
  description: "Attendance tracker for SOE students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950">
        <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
          {children}
          <div className="mt-12 text-center text-xs text-neutral-600 font-medium tracking-tight">
            Made by Sid from ISE
          </div>
        </main>
      </body>
    </html>
  );
}
