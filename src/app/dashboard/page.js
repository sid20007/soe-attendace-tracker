"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal, Info, X } from "lucide-react";
import { motion } from "framer-motion";

function SubjectCard({ subject, target }) {
  const { name, code, attended, total } = subject;
  
  const targetDecimal = target;
  const displayTarget = Math.round(target * 100);
  const currentPercent = Math.round((attended / total) * 100) || 0;

  // Formula for how many consecutive classes needed to hit target
  const catchUpClasses = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));

  // Formula for how many consecutive classes can be missed before dropping below target
  const safeToBunk = Math.floor((attended - (targetDecimal * total)) / targetDecimal);

  let verdictNode = null;

  if (currentPercent < displayTarget) {
    verdictNode = (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mt-4 font-medium backdrop-blur-sm">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">💀</span>
          You are below target. You need to attend the next <span className="font-bold">{Math.max(0, catchUpClasses)}</span> classes in a row to reach <span className="font-bold">{displayTarget}%</span>.
        </p>
      </div>
    );
  } else if (safeToBunk === 0) {
    verdictNode = (
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl p-4 mt-4 font-medium backdrop-blur-sm">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">⚠️</span>
          You are exactly on the borderline. Do not bunk the next class or you will drop below <span className="font-bold">{displayTarget}%</span>.
        </p>
      </div>
    );
  } else {
    verdictNode = (
      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-4 mt-4 font-medium backdrop-blur-sm">
        <p className="text-[15px] leading-snug">
          <span className="text-lg mr-2">✅</span>
          You can bunk the next <span className="font-bold">{safeToBunk}</span> classes and still be in your <span className="font-bold">{displayTarget}%</span> target range.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white leading-snug pr-2 antialiased tracking-tight">{name}</h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">{code || `SUB${subject.id}`}</p>
        </div>
        
        {/* Simple Current Attendance Badge */}
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex flex-col items-end shrink-0 backdrop-blur-md">
          <span className="text-xs font-semibold text-white">
            {subject.attended} <span className="text-neutral-500 font-normal">/ {subject.total}</span>
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 font-medium">{currentPercent}%</span>
        </div>
      </div>

      {/* Sleek Progress Bar */}
      <div className="mt-4 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${currentPercent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${
            currentPercent < displayTarget 
              ? 'bg-gradient-to-r from-red-500 to-rose-400' 
              : safeToBunk === 0 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
          }`}
        />
      </div>

      {/* The Verdict */}
      {verdictNode}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [target, setTarget] = useState(0.80);
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
          setStudentName(parsed.studentName || "Student");
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="antialiased"
    >
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

        </div>
      </div>

      {/* Subject Feed */}
      <div className="space-y-4 pb-10">
        {subjects.map((sub, i) => (
          <motion.div 
            key={sub.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ease: "easeOut" }}
            className="shadow-xl"
          >
            <SubjectCard subject={sub} target={target} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
