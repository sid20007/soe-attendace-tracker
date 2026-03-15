"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal, Info, X } from "lucide-react";

function SubjectCard({ subject, target, upcoming, plannedBunks }) {
  const { name, code, attended, total, exempted = 0 } = subject;
  
  const currentPercent = Math.round((subject.attended / subject.total) * 100) || 0;
  const projectedTotal = subject.total + upcoming;
  const mustAttend = Math.ceil((target) * projectedTotal) - subject.attended;
  const bunkable = upcoming - mustAttend;
  const actualBunkable = bunkable - plannedBunks;
  const displayTarget = Math.round(target * 100);

  let verdictNode = null;

  if (mustAttend > upcoming) {
    verdictNode = (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mt-4 text-rose-500 font-medium">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">💀</span>
          You&apos;re cooked! Even if you attend all <span className="font-bold">{upcoming}</span> remaining classes, you won&apos;t reach <span className="font-bold">{displayTarget}%</span>.
        </p>
      </div>
    );
  } else if (mustAttend === upcoming) {
    verdictNode = (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 text-amber-500 font-medium">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">🚨</span>
          Zero margin for error! You are currently at <span className="font-bold">{currentPercent}%</span>. You MUST attend ALL <span className="font-bold">{upcoming}</span> remaining classes to reach <span className="font-bold">{displayTarget}%</span>.
        </p>
      </div>
    );
  } else if (actualBunkable < 0) {
    verdictNode = (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 text-amber-500 font-medium">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">⚠️</span>
          You are planning to bunk too much! Cancel <span className="font-bold">{Math.abs(actualBunkable)}</span> planned bunks to stay safe.
        </p>
      </div>
    );
  } else if (currentPercent < displayTarget && bunkable > 0) {
    verdictNode = (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 text-amber-500 font-medium">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">⚠️</span>
          You are currently below target. To reach <span className="font-bold">{displayTarget}%</span>, you must attend <span className="font-bold">{mustAttend}</span> more classes. (You can only bunk <span className="font-bold">{bunkable}</span>).
        </p>
      </div>
    );
  } else if (currentPercent >= displayTarget && bunkable >= 0) {
    verdictNode = (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-4 text-emerald-500 font-medium">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">✅</span>
          You are safe! Even with your planned bunks, you can skip <span className="font-bold">{actualBunkable}</span> more classes.
        </p>
      </div>
    );
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
          <span className="text-[10px] text-neutral-400 mt-0.5 font-medium">{currentPercent}%</span>
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
  const [studentName, setStudentName] = useState("Student");
  const [target, setTarget] = useState(0.80);
  const [upcoming, setUpcoming] = useState(25); // Value kept constant for math logic, mapped out of UI
  const [plannedBunks, setPlannedBunks] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load state from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.subjects) {
          setSubjects(parsed.subjects);
          if (parsed.studentName) setStudentName(parsed.studentName);
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          // Fallback for old cached data format
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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome, {studentName} 👋</h1>
          <p className="text-sm text-neutral-400 mt-1">Manage your attendance targets</p>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Heads Up Banner */}
      {showAlert && (
        <div className="bg-amber-950/20 border border-amber-700/50 rounded-xl p-4 mb-6 relative animate-in fade-in slide-in-from-top-2 duration-300">
          <button 
            onClick={() => setShowAlert(false)}
            className="absolute top-4 right-4 text-amber-500/70 hover:text-amber-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-500 font-semibold text-sm mb-2">Heads up — Read before using</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li className="text-neutral-400 text-sm leading-relaxed">
                  Keep a buffer. For best results, aim for at least 80% instead of cutting it close at 75%. Edge cases, surprise classes, or minor calculation drift can push you below the threshold.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

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

          {/* Planned Bunks Counter */}
          <div className="pt-2 border-t border-neutral-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400 font-medium">Planned Bunks</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Classes you already plan to skip</p>
              </div>
              <div className="flex items-center gap-3 bg-neutral-950/50 border border-neutral-800 rounded-lg p-1">
                <button 
                  onClick={() => setPlannedBunks(Math.max(0, plannedBunks - 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-bold text-white tabular-nums">{plannedBunks}</span>
                <button 
                  onClick={() => setPlannedBunks(plannedBunks + 1)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
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
            <SubjectCard subject={sub} target={target} upcoming={upcoming} plannedBunks={plannedBunks} />
          </div>
        ))}
      </div>
    </div>
  );
}
