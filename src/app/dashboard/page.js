"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal, Info, X, Calendar, Clock, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";



// --- DYNAMIC TIMETABLE ---
// Mock structure using subject codes (adjust as necessary per actual branch codes)
const masterTimetable = {
  // PHYSICS CYCLE BRANCHES
  ISE: {
    Monday: ['25ENUBC101', '25ENUEC108', '25ENUHM115', '25ENUEC107', '25ENUBC100'],
    Tuesday: ['25ENUEC107', '25ENUHM114', '25ENUEC108', '25ENUEC109'],
    Wednesday: ['25ENUBC101', '25ENUEC108', '25ENUBC100', '25ENUHM114'],
    Thursday: ['25ENUEC107', '25ENUEC109'],
    Friday: ['25ENUBC101', '25ENUEC108', '25ENUEC107'],
    Saturday: ['25ENUBC100', '25ENUMC117', '25ENUEC107']
  },
  CSE: {
    Monday: ['25ENUBC100', '25ENUEC109', '25ENUBP101', '25ENUBP100', '25ENUEC108', '25ENUEC107'],
    Tuesday: ['25ENUBP101', '25ENUBP100', '25ENUEC107', '25ENUBC101', '25ENUBC100', '25ENUHM114'],
    Wednesday: ['25ENUBC100', '25ENUHM115', '25ENUEC109', '25ENUEC107', '25ENUBP101'],
    Thursday: ['25ENUBC101', '25ENUHM114', '25ENUEC108', '25ENUBC100', '25ENUEC107'],
    Friday: ['25ENUEC108', '25ENUEC107', '25ENUEC108', '25ENUBP101', '25ENUHM115'],
    Saturday: ['25ENUMC117', '25ENUBC101', '25ENUEC108']
  },
  // CHEMISTRY CYCLE BRANCHES
  AIML: {
    Monday: ['CHEM_DE_LAB', 'CHEM_CHY', 'CHEM_TE', 'CHEM_PY'],
    Tuesday: ['CHEM_DE', 'CHEM_ES', 'CHEM_CHY', 'CHEM_M2', 'CHEM_CHY_LAB'],
    Wednesday: ['CHEM_PY', 'CHEM_M2', 'CHEM_IDT', 'CHEM_ES', 'CHEM_DE'],
    Thursday: ['CHEM_DE', 'CHEM_PY', 'CHEM_IDT', 'CHEM_CHY', 'CHEM_M2'],
    Friday: ['CHEM_DE', 'CHEM_EVS', 'CHEM_DE_LAB', 'CHEM_CHY_LAB'],
    Saturday: ['CHEM_WEB_LAB', 'CHEM_M2', 'CHEM_ES']
  },
  ECE: {
    Monday: ['CHEM_TE', 'CHEM_ES', 'CHEM_PY', 'CHEM_DE', 'CHEM_CHY', 'CHEM_M2'],
    Tuesday: ['CHEM_M2', 'CHEM_DE_LAB', 'CHEM_IDT', 'CHEM_EVS', 'CHEM_ES'],
    Wednesday: ['CHEM_DE', 'CHEM_CHY', 'CHEM_DE_LAB', 'CHEM_CHY_LAB'],
    Thursday: ['CHEM_M2', 'CHEM_CHY', 'CHEM_IDT', 'CHEM_DE', 'CHEM_PY'],
    Friday: ['CHEM_PY', 'CHEM_M2', 'CHEM_CHY_LAB', 'CHEM_PY_LAB'],
    Saturday: ['CHEM_ES', 'CHEM_PY', 'CHEM_WEB_LAB']
  },
  UNKNOWN: { Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] }
};

const calculateExactRemaining = (subjectCode, branch, endDateStr) => {
  if (!branch || !masterTimetable[branch]) return 15;

  let remainingClasses = 0;
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow
  const endDate = new Date(endDateStr);

  // Known St. Aloysius Holidays
  const holidays = ['2026-03-20', '2026-03-31', '2026-04-03', '2026-04-14'];

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (!holidays.includes(dateString)) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const daysSubjects = masterTimetable[branch][dayOfWeek] || [];
      if (daysSubjects.includes(subjectCode)) {
        remainingClasses++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (remainingClasses === 0) {
    const weeksLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7));
    return weeksLeft > 0 ? weeksLeft : 0;
  }
  return remainingClasses;
};

// --- CLASS SLOT TIMINGS ---
const slotTimes = [
  "09:00 AM - 09:50 AM",
  "09:50 AM - 10:40 AM",
  "10:55 AM - 11:45 AM",
  "11:45 AM - 12:35 PM",
  "01:30 PM - 02:20 PM",
  "02:25 PM - 03:15 PM",
  "03:20 PM - 04:10 PM"
];

function SubjectCard({ subject, target, endDate, branch, timeSlot }) {
  const { name, code, attended, total, officialPercentage } = subject;

  const targetDecimal = target;
  const displayTarget = Math.round(target * 100);
  const currentPercent = officialPercentage !== undefined ? officialPercentage : (Math.round((attended / total) * 100) || 0);

  // Math projections
  const catchUpClasses = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));
  const safeToBunk = Math.floor((attended - (targetDecimal * total)) / targetDecimal);

  // exact remaining count lookup
  const exactRemaining = calculateExactRemaining(code, branch, endDate);
  const projectedTotal = total + exactRemaining;
  const maxPossiblePercent = ((attended + exactRemaining) / projectedTotal) * 100;

  // Clamp negative numbers to 0 for a clean UI
  const displaySafeToBunk = Math.max(0, safeToBunk);
  const displayCatchUp = Math.max(0, catchUpClasses);

  // Calculate how many EXTRA classes they would need beyond the semester to pass
  const targetAttendedNeeded = Math.ceil((targetDecimal) * projectedTotal);
  const maxAttendedPossible = attended + exactRemaining;
  const extraClassesNeeded = targetAttendedNeeded - maxAttendedPossible;



  return (
    <div key={subject.code} className="bg-[#18181b] rounded-[1.5rem] p-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">
      {/* Header */}
      <h3 className="text-lg font-semibold text-white tracking-tight truncate">{subject.name}</h3>
      {timeSlot && (
        <p className="text-xs font-semibold text-blue-400 font-mono mt-1 mb-2 flex items-center gap-1">
          {timeSlot}
        </p>
      )}
      <p className="text-sm text-neutral-500 font-mono mt-1">{subject.code}</p>

      {/* Progress Bar */}
      <div className="mt-5 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${currentPercent >= target ? 'bg-emerald-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />
      </div>

      {/* Current Status */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-neutral-400">Current</span>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">{subject.attended}/{subject.total}</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${currentPercent >= target ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {currentPercent}%
          </span>
        </div>
      </div>

      <hr className="border-white/5 my-5" />

      {/* Action Blocks Conditional Render */}
      {maxPossiblePercent < displayTarget ? (
        <div className="bg-[#1A0B0B] border border-[#3A1616] rounded-xl p-4 flex items-center gap-4 my-3">
          <div className="bg-[#3A1616] text-[#FF453A] rounded-full p-1.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#FF453A] font-semibold text-sm mb-0.5">You're Cooked!</span>
            <span className="text-neutral-400 text-xs">Max possible: {maxPossiblePercent.toFixed(2)}% • Need {extraClassesNeeded} extra classes</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-white/5 rounded-xl py-4 flex flex-col items-center justify-center border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Can Skip</span>
            <span className={`text-4xl font-bold my-1 ${displaySafeToBunk > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {displaySafeToBunk}
            </span>
            <span className="text-xs text-neutral-500">classes</span>
          </div>
          
          <div className="bg-white/5 rounded-xl py-4 flex flex-col items-center justify-center border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Must Attend</span>
            <span className="text-4xl font-bold my-1 text-blue-500">
              {displayCatchUp}
            </span>
            <span className="text-xs text-neutral-500">classes</span>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">Upcoming Classes</span>
          <span className="text-white font-medium">{exactRemaining}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">Projected Total</span>
          <span className="text-white font-medium">{subject.total + exactRemaining}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("Student");
  const [branch, setBranch] = useState("UNKNOWN");
  const [selectedBranch, setSelectedBranch] = useState("UNKNOWN");
  const [target, setTarget] = useState(0.80);
  const [endDate, setEndDate] = useState('2026-04-30');
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  // Initialize selectedBranch from localStorage on mount
  useEffect(() => {
    setSelectedBranch(localStorage.getItem('userBranch') || "UNKNOWN");
  }, []);

  // Real-time clock setup
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load state from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        console.log("Debug Data:", parsed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.subjects) {
          setSubjects(parsed.subjects);
          setStudentName(parsed.studentName || "Student");
          const b = parsed.branch || "UNKNOWN";
          setBranch(b);
          if (b !== "UNKNOWN") {
            setSelectedBranch(b);
            localStorage.setItem('userBranch', b);
          }
        } else if (Array.isArray(parsed) && parsed.length > 0) {
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
      <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.1s" }}></span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
        </div>
      </div>
    );
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = days[time.getDay()];
  const activeBranch = selectedBranch !== "UNKNOWN" ? selectedBranch : branch;
  const branchTimetable = masterTimetable[activeBranch] || masterTimetable["UNKNOWN"];
  const todayCodes = branchTimetable[currentDayName] || [];



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="antialiased min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-6"
    >
      {/* ROW 1: Header / Live Clock */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-neutral-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome, {studentName} 👋</h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1 bg-neutral-900 border border-neutral-800"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* WARNING BANNER */}
      {showWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-[#130E05] border border-[#2B1D0E] rounded-2xl p-5 mb-8 flex gap-4 relative overflow-hidden"
        >
          <div className="bg-[#2B1D0E] text-[#ECA239] rounded-full p-1.5 h-fit flex-shrink-0 flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-[#ECA239] font-bold text-lg mb-4 flex items-center justify-between">
              Heads up — Read before using
              <button onClick={() => setShowWarning(false)} className="text-neutral-500 hover:text-neutral-400 font-normal absolute top-4 right-4 bg-neutral-900/40 hover:bg-neutral-800/80 p-1 rounded-lg border border-white/5">
                <X className="w-4 h-4" />
              </button>
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#ECA239] font-bold">•</span>
                <span>
                  <strong className="text-neutral-200">Set your Last Working Day.</strong> The auto-detected end date may not match your actual semester end. Make sure to verify and adjust it — this directly affects how many classes are projected.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#ECA239] font-bold">•</span>
                <span>
                  <strong className="text-neutral-200">Keep a buffer.</strong> For best results, aim for at least <span className="text-[#ECA239] font-semibold">80%</span> instead of cutting it close at 75%. Edge cases, surprise classes, or minor calculation drift can push you below the threshold.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* ROW 2: Semester Settings Card */}
      <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-2 text-neutral-300 pb-4 border-b border-white/5 mb-4 relative z-10">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider text-white">Semester Settings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
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
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[4px]
                [&::-webkit-slider-thumb]:border-neutral-900 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
          </div>

          {/* End Date Controller */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-400 font-medium">Semester End Date</p>
              <div className="flex gap-2">
                <button onClick={() => setEndDate('2026-04-07')} className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 font-medium transition-colors">Apr 7 (Internals)</button>
                <button onClick={() => setEndDate('2026-04-30')} className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 font-medium transition-colors">Apr 30 (LWD)</button>
                <button onClick={() => setEndDate('2026-05-15')} className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 font-medium transition-colors">May 15 (Exams)</button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Today's Hitlist */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          ⚡ Today&apos;s Hitlist
          {activeBranch !== "UNKNOWN" && (
            <span className="text-xs font-normal text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">
              {todayCodes.length > 0 ? `${todayCodes.length} classes scheduled` : 'No classes or weekend'}
            </span>
          )}
        </h2>

        {activeBranch === "UNKNOWN" ? (
          <div className="bg-neutral-900/40 border border-neutral-800/50 border-dashed rounded-2xl p-6 text-center flex flex-col items-center gap-3">
            <p className="text-neutral-400 text-sm">Select your branch to see today&apos;s classes:</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {['ISE', 'CSE', 'AIML', 'ECE'].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBranch(b);
                    localStorage.setItem('userBranch', b);
                  }}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold hover:bg-blue-600/30 transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        ) : todayCodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayCodes.map((code, index) => {
              const subDetails = subjects.find(s => s.code === code);
              if (!subDetails) return null;
              return (
                <motion.div
                  key={`hitlist-${code}-${index}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <SubjectCard
                    subject={subDetails}
                    target={target}
                    endDate={endDate}
                    branch={activeBranch}
                    timeSlot={slotTimes[index]}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-neutral-900/40 border border-neutral-800/50 border-dashed rounded-2xl p-8 text-center">
            <p className="text-neutral-500 text-sm">You are free today! Enjoy the break or study. 🎉</p>
          </div>
        )}
      </div>

      {/* ROW 4: All Subjects Bento Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">📚 All Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {subjects.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <SubjectCard subject={sub} target={target} endDate={endDate} branch={activeBranch} />
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
