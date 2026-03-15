"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal } from "lucide-react";

function SubjectCard({ subject, target }) {
  const { name, code, attended, total, exempted = 0 } = subject;
  
  const attendedWithLeaves = attended + exempted;
  const currentPercent = total > 0 ? (attendedWithLeaves / total) * 100 : 0;
  
  // Mathematical Margin: How far ahead or behind are we in terms of raw classes?
  // attended >= target * total  ==>  margin >= 0 (Safe)
  const margin = attendedWithLeaves - (target * total);

  // Let's determine the Verdict Box UI based on exact bounds
  let verdictNode = null;

  if (margin < 0) {
    // They are in a deficit. How many classes must they attend in a row to hit the target?
    // (A + y) / (T + y) >= target  ==>  y >= (target * T - A) / (1 - target)
    const mustAttend = Math.ceil(-margin / (1 - target));
    
    verdictNode = (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mt-4">
        <p className="text-[15px] font-medium text-rose-400 leading-snug">
          <span className="text-lg mr-2">💀</span>
          You are severely cooked. You must attend the next <span className="font-bold text-rose-500">{mustAttend}</span> classes in a row just to get back on track.
        </p>
      </div>
    );
  } else {
    // They are currently safe (margin >= 0). How many can they bunk in a row?
    // A / (T + x) >= target  ==>  x <= (A - target * T) / target
    // target cannot be 0 for this formula, so guard against target = 0
    let canBunk = 0;
    if (target > 0) {
      canBunk = Math.floor(margin / target);
    } else {
      canBunk = 999; // If target is 0%, they can bunk infinite classes...
    }

    if (canBunk > 0) {
      verdictNode = (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4">
          <p className="text-[15px] font-medium text-emerald-400 leading-snug">
            <span className="text-lg mr-2">✅</span>
            You are safe! You can confidently bunk the next <span className="font-bold text-emerald-500">{canBunk}</span> classes.
          </p>
        </div>
      );
    } else {
      // They are safe, but can't bunk even 1 class without dipping below the target.
      verdictNode = (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
          <p className="text-[15px] font-medium text-amber-400 leading-snug">
            <span className="text-lg mr-2">⚠️</span>
            You are exactly on track. Do <span className="font-bold text-amber-500 text-underline">not</span> bunk the next class or you will drop below {Math.round(target * 100)}%.
          </p>
        </div>
      );
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white leading-snug pr-2">{name}</h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">{code || `SUB${subject.id}`}</p>
        </div>
        
        {/* Simple Current Attendance Badge */}
        <div className="bg-neutral-800/80 border border-neutral-700/50 rounded-lg px-3 py-1.5 flex flex-col items-end shrink-0">
          <span className="text-xs font-semibold text-white">
            {subject.attended} <span className="text-neutral-500 font-normal">/ {subject.total}</span>
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 font-medium">{subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0}%</span>
        </div>
      </div>

      {/* The Verdict */}
      {verdictNode}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [target, setTarget] = useState(0.80);
  const [loading, setLoading] = useState(true);

  // Load state from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error("Parse error:", e);
        router.push("/");
      }
    } else {
      router.push("/");
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">Plain-English Attendance Verdicts</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Global Controls Module */}
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/50 mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          
          <div className="flex items-center gap-2 text-neutral-300 pb-2 border-b border-neutral-800/50">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Adjustment Controls</span>
          </div>

          {/* Target Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-400 font-medium">Target Attendance</p>
              <span className="text-lg font-bold text-white tabular-nums">{Math.round(target * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(target * 100)}
              onChange={(e) => setTarget(Number(e.target.value) / 100)}
              className="w-full h-2 bg-neutral-800 rounded-full appearance-none flex cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[4px]
                [&::-webkit-slider-thumb]:border-neutral-900
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-webkit-slider-thumb]:transition-transform"
            />
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
