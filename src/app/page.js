"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, ShieldCheck, Eye, EyeOff, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");
  const [semester, setSemester] = useState("1");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!registerNo.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ register_no: registerNo, password, semester }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or portal error.");
      }

      const data = await response.json();

      // Save to localStorage for the dashboard to read
      localStorage.setItem("attendanceData", JSON.stringify({ ...data, semester }));
      sessionStorage.setItem("temp_password", password);

      // Navigate to the dashboard
      router.push("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError("Check your credentials or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = registerNo.trim().length > 0 && password.trim().length > 0 && !isLoading;

  return (
    <div className="fixed inset-0 min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-neutral-950 flex items-center justify-center p-5 z-50">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 flex items-center justify-center shadow-2xl">
            <ShieldCheck className="w-7 h-7 text-neutral-300" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Log in to B.Tech Connect</h1>
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
            Connect to your student portal.<br />
            We never store your password.
          </p>
        </div>

        {/* Login Card Form */}
        <form onSubmit={handleLogin} className="bg-neutral-900/70 backdrop-blur-2xl border border-neutral-800/80 rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Student ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-600 pointer-events-none" />
                <input
                  type="text"
                  value={registerNo}
                  onChange={(e) => setRegisterNo(e.target.value)}
                  placeholder="e.g. 25192199..."
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Portal Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-600 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Semester Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
                Semester
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-600 pointer-events-none" />
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      Semester {num}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching portal data...</span>
              </>
            ) : (
              "Analyze Attendance"
            )}
          </button>
        </form>

        {/* Footer trust text */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Your credentials are used only to fetch data from<br />
            the university portal. Stored locally on your device and aren't saved on the servers<br />
            though session cookies are cached to improve speed :D.<br />
            Since the project is running on alot of free services there might be lag or issues!<br />

          </p>
        </div>
      </div>
    </div>
  );
}
