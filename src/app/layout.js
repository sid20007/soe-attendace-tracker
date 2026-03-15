import "./globals.css";

export const metadata = {
  title: "Smart Student Dashboard",
  description: "Ultra-modern attendance tracker for college students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950">
        <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
