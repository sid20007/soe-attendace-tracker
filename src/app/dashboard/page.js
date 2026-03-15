"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, LogOut } from "lucide-react";

function SubjectCard({ subject, target }) {
  const { name, code, attended, total, exempted = 0 } = subject;
  
  // The logic as requested: Constant 22 upcoming classes.
  const upcoming = 22;

  const attendedWithLeaves = attended + exempted;
  const currentPercent = total > 0 ? (attendedWithLeaves / total) * 100 : 0;
  const projectedTotal = total + upcoming;
  
  // Make sure mustAttend doesn't go below 0
  const mustAttendRaw = Math.ceil(target * projectedTotal) - attendedWithLeaves;
  const mustAttend = Math.max(0, mustAttendRaw);
  
  // If we must attend more than there are upcoming classes, we can't skip anything. 
  // It could be negative if we need more than 22, so clamp to 0.
  const canSkipRaw = upcoming - mustAttend;
  const canSkip = Math.max(0, canSkipRaw);
  
  const maxPossible = projectedTotal > 0 ? ((attendedWithLeaves + upcoming) / projectedTotal) * 100 : 0;
  
  const isCooked = maxPossible < target * 100;
  const extraNeeded = Math.max(
    Math.ceil(((target * projectedTotal) - (attendedWithLeaves + upcoming)) / (1 - target)),
    0
  );

  const isBelowTarget = currentPercent < target * 100;
  
  // 3-Tier color logic for the progress bar and current percent badge:
  // Red (< Target), Amber (Target to Target + 3%), Green (> Target + 3%)
  let barTheme = "";
  if (currentPercent < target * 100) {
    barTheme = "rose"; // Red
  } else if (currentPercent <= (target * 100) + 3) {
    barTheme = "amber"; // Amber
  } else {
    barTheme = "emerald"; // Green
  }

  // Create standard tailwind class strings dynamically for the Progress Bar
  const barBgClass = {
    "rose": "bg-rose-500",
    "amber": "bg-amber-500",
    "emerald": "bg-emerald-500"
  }[barTheme];

  // And the badge style
  const badgeClass = {
    "rose": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "amber": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "emerald": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  }[barTheme];


  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 transition-all duration-200 hover:border-neutral-700">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-white leading-snug">{name}</h3>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">{code || `SUB${subject.id}`}</p>
      </div>

      {/* Current stats */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Current</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-300">
            <span className="text-white font-semibold">{attended}</span>/{total}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {currentPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barBgClass}`}
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />
      </div>

      {/* Conditional: Cooked or Stats */}
      {isCooked ? (
        <div className="bg-rose-500/8 border border-rose-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-400">You&apos;re Cooked!</p>
              <p className="text-xs text-neutral-400 mt-1">
                Max possible: <span className="text-white font-medium">{maxPossible.toFixed(2)}%</span> •
                Need <span className="text-white font-medium">{Math.abs(mustAttendRaw)}</span> extra classes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-800/60 rounded-xl p-4 text-center border-b-2 border-emerald-500/30">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">Can Skip</p>
            <p className="text-3xl font-bold text-emerald-400 leading-none">{canSkip}</p>
          </div>
          <div className="bg-neutral-800/60 rounded-xl p-4 text-center border-b-2 border-white/10">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">Must Attend</p>
            <p className="text-3xl font-bold text-white leading-none">{mustAttend}</p>
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-800/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Upcoming Projections</span>
          <span className="text-neutral-300 font-medium">+{upcoming} classes</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Projected Total</span>
          <span className="text-neutral-300 font-medium">{projectedTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [target, setTarget] = useState(0.80);
  const [loading, setLoading] = useState(true);

  // Load state from local storage securely
  useEffect(() => {
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
        } else {
          router.push("/"); // Back to login if corrupted
        }
      } catch (e) {
        console.error("Parse error:", e);
        router.push("/");
      }
    } else {
      router.push("/"); // Back to login if not found
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("attendanceData");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: "0.1s"}}></span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: "0.2s"}}></span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Welcome, Student</h1>
          <p className="text-sm text-neutral-400 mt-1">Your Attendance Overview</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Target Setting Module */}
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Global Target
            </p>
            <span className="text-xl font-bold text-white tabular-nums">{Math.round(target * 100)}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(target * 100)}
            onChange={(e) => setTarget(Number(e.target.value) / 100)}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-[4px]
              [&::-webkit-slider-thumb]:border-neutral-900
              [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.8)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <div className="flex justify-between mt-2 px-1">
             <span className="text-[10px] font-bold text-neutral-600">0%</span>
             <span className="text-[10px] font-bold text-neutral-600">100%</span>
          </div>
        </div>
      </div>

      {/* Subject Feed */}
      <div className="space-y-4 pb-10">
        {subjects.map((sub, i) => (
          <div 
            key={sub.id} 
            className="animate-in slide-in-from-bottom-4 shadow-xl"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
          >
            <SubjectCard subject={sub} target={target} />
          </div>
        ))}
      </div>
    </div>
  );
}
