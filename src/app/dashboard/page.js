"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, SlidersHorizontal, Info, X, Calendar, Clock, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const masterTimetable = {
  "ISE": {
    "Monday": [
      { code: "PHY", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "CP", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "BIO", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "EC", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "M1", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "PHY", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "BIO", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Tuesday": [
      { code: "EC", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "UHV", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "Dr KY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "CP", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "CP", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "GAVEL", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "AI", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Wednesday": [
      { codeB1: "EC LAB (XAVIER)", codeB2: "CP LAB (LCRI)", start: "09:00 AM", end: "10:40 AM", isLab: true },
      { code: "PHY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "CP", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "M1", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "UHV", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "M1", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Thursday": [
      { code: "EC", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "AI", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "PHY LAB (LCRI)", codeB2: "SCILAB (LCRI)", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { code: "LUNCH", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "ACTIVITY", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "ACTIVITY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Friday": [
      { codeB1: "SCILAB (LCRI)", codeB2: "PHY LAB (LCRI)", start: "09:00 AM", end: "10:40 AM", isLab: true },
      { codeB1: "FREE", codeB2: "PHY LAB", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "INNOVATION", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { codeB1: "CP LAB (LCRI)", codeB2: "EC LAB (XAVIER)", start: "01:30 PM", end: "03:15 PM", isLab: true },
      { code: "MENTORING", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Saturday": [
      { code: "M1", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "CIP", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "EC", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "LIBRARY", start: "11:45 AM", end: "12:35 PM", isLab: false }
    ]
  },
  "CSE": {
    "Monday": [
      { code: "M1", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "AI", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "SCILAB (LCRI)", codeB2: "PHY LAB (LCRI)", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { code: "CP", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "EC", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "LIBRARY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Tuesday": [
      { codeB1: "PHY LAB (LCRI)", codeB2: "SCILAB (LCRI)", start: "09:00 AM", end: "10:40 AM", isLab: true },
      { codeB1: "PHY LAB (LCRI)", codeB2: "FREE", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "EC", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "PHY", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "M1", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "UHV", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Wednesday": [
      { code: "M1", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "Dr KY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "BIO", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "AI", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { codeB1: "EC LAB (XAVIER)", codeB2: "CP LAB (LCRI)", start: "01:30 PM", end: "04:10 PM", isLab: true }
    ],
    "Thursday": [
      { code: "PHY", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "UHV", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "CP", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "M1", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "EC", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "ACTIVITY", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "ACTIVITY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Friday": [
      { code: "CP", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "EC", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "CP LAB (LCRI)", codeB2: "EC LAB (XAVIER)", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { code: "BIO", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "GAVEL", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "MENTORING", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Saturday": [
      { code: "CIP", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "PHY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "CP", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "INNOVATION", start: "11:45 AM", end: "12:35 PM", isLab: false }
    ]
  },
  "AIML": {
    "Monday": [
      { codeB1: "MENTORING", codeB2: "DE LAB (XAVIER)", start: "09:00 AM", end: "10:40 AM", isLab: true },
      { code: "CHY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "TE", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "PY", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "PY", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "LIBRARY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Tuesday": [
      { code: "DE", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "ES", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "CHY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "M2", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { codeB1: "PY LAB (LCRI)", codeB2: "CHY LAB (XAVIER)", start: "01:30 PM", end: "03:15 PM", isLab: true },
      { code: "INNOVATION", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Wednesday": [
      { code: "PY", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "M2", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "Dr KY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "IDT", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "ES", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "GAVEL CLUB", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "DE", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Thursday": [
      { code: "DE", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "PY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "IDT", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "CHY", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "M2", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "ACTIVITY", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "ACTIVITY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Friday": [
      { code: "DE", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "EVS", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "DE LAB (XAVIER)", codeB2: "MENTORING", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { codeB1: "CHY LAB (ADMIN)", codeB2: "PY LAB", start: "01:30 PM", end: "04:10 PM", isLab: true }
    ],
    "Saturday": [
      { code: "WEB LAB", start: "09:00 AM", end: "10:40 AM", isLab: true },
      { code: "M2", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "ES", start: "11:45 AM", end: "12:35 PM", isLab: false }
    ]
  },
  "ECE": {
    "Monday": [
      { code: "TE", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "ES", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "PY", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "DE", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "CHY", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "DE", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "M2", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Tuesday": [
      { code: "M2", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "Dr KY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "DE LAB (XAVIER)", codeB2: "CLUB", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { code: "IDT", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "EVS", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "ES", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Wednesday": [
      { code: "DE", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "CHY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "CLUB (LUNCH)", codeB2: "DE LAB (XAVIER)", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { codeB1: "PY LAB (LCRI)", codeB2: "CHY LAB (XAVIER)", start: "12:35 PM", end: "02:20 PM", isLab: true },
      { code: "LIBRARY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Thursday": [
      { code: "M2", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "CHY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "IDT", start: "10:55 AM", end: "11:45 AM", isLab: false },
      { code: "DE", start: "11:45 AM", end: "12:35 PM", isLab: false },
      { code: "PY", start: "01:30 PM", end: "02:20 PM", isLab: false },
      { code: "GAVEL", start: "02:25 PM", end: "03:15 PM", isLab: false },
      { code: "ACTIVITY", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Friday": [
      { code: "PY", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "M2", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { codeB1: "CHY LAB (XAVIER)", codeB2: "MENTORING", start: "10:55 AM", end: "12:35 PM", isLab: true },
      { codeB1: "MENTORING", codeB2: "PY LAB (ADMIN)", start: "01:30 PM", end: "03:15 PM", isLab: true },
      { code: "INNOVATION", start: "03:20 PM", end: "04:10 PM", isLab: false }
    ],
    "Saturday": [
      { code: "ES", start: "09:00 AM", end: "09:50 AM", isLab: false },
      { code: "PY", start: "09:50 AM", end: "10:40 AM", isLab: false },
      { code: "WEB LAB", start: "10:55 AM", end: "12:35 PM", isLab: true }
    ]
  }
};

const subjectNamesLookup = {
  // Feel free to update these names to match your curriculum!
  'CHEM_DE': 'Digital Electronics',
  'CHEM_CHY': 'Engineering Chemistry',
  'CHEM_TE': 'Technical English',
  'CHEM_PY': 'Engineering Physics',
  'CHEM_DE_LAB': 'Digital Electronics Lab',
  'CHEM_CHY_LAB': 'Chemistry Lab',
  'CHEM_ES': 'Environmental Science',
  'CHEM_M2': 'M2',
  'CHEM_IDT': 'Innovation & Design',
  'CHEM_EVS': 'Environmental Studies',
  'CHEM_WEB_LAB': 'Web Development Lab',
  'CHEM_PY_LAB': 'Physics Lab'
};

const calculateExactRemaining = (subjectCode, branch, endDateStr) => {
  if (!branch || !masterTimetable[branch]) return 15;

  let remainingClasses = 0;
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow
  const endDate = new Date(endDateStr);

  const holidays = ['2026-03-20', '2026-03-31', '2026-04-03', '2026-04-14'];

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (!holidays.includes(dateString)) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const daysSubjects = masterTimetable[branch][dayOfWeek] || [];
      if (daysSubjects.some(s => s.code === subjectCode)) {
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

const slotTimes = [
  "09:00 AM - 09:50 AM",
  "09:50 AM - 10:40 AM",
  "10:55 AM - 11:45 AM",
  "11:45 AM - 12:35 PM",
  "01:30 PM - 02:20 PM",
  "02:25 PM - 03:15 PM",
  "03:20 PM - 04:10 PM"
];

function SubjectCard({ subject, target, endDate, branch, timeSlot, customTitle, customStart, customEnd }) {
  const { name, code, attended, total, officialPercentage } = subject;

  const targetDecimal = target;
  const displayTarget = Math.round(target * 100);
  const currentPercent = officialPercentage !== undefined ? officialPercentage : (Math.round((attended / total) * 100) || 0);

  const catchUpClasses = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));
  const safeToBunk = Math.floor((attended - (targetDecimal * total)) / targetDecimal);

  const exactRemaining = calculateExactRemaining(code, branch, endDate);
  const projectedTotal = total + exactRemaining;
  const maxPossiblePercent = ((attended + exactRemaining) / projectedTotal) * 100;

  const displaySafeToBunk = Math.max(0, safeToBunk);
  const displayCatchUp = Math.max(0, catchUpClasses);

  const targetAttendedNeeded = Math.ceil((targetDecimal) * projectedTotal);
  const maxAttendedPossible = attended + exactRemaining;
  const extraClassesNeeded = targetAttendedNeeded - maxAttendedPossible;

  let barColor = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-500/15';
  let badgeText = 'text-emerald-400';

  if (currentPercent < 73) {
    barColor = 'bg-[#FF453A]'; // Danger Red
    badgeBg = 'bg-[#FF453A]/15';
    badgeText = 'text-[#FF453A]';
  } else if (currentPercent >= 73 && currentPercent < 75) {
    barColor = 'bg-[#FFD60A]'; // Warning Yellow
    badgeBg = 'bg-[#FFD60A]/15';
    badgeText = 'text-[#FFD60A]';
  }return (
    <div key={subject.code} className="bg-[#18181b] rounded-[1.5rem] p-5 border border-white/5 shadow-2xl transition-transform hover:scale-[1.02]">

      <h3 className="text-lg font-semibold text-white tracking-tight truncate">{customTitle || subject.name}</h3>
      {(customStart || timeSlot) && (
        <p className="text-xs font-semibold text-blue-400 font-mono mt-1 mb-2 flex items-center gap-1">
          {customStart ? `${customStart} - ${customEnd}` : timeSlot}
        </p>
      )}
      <p className="text-sm text-neutral-500 font-mono mt-1">{subject.code}</p>

      <div className="mt-5 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-neutral-400">Current</span>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white">{subject.attended}/{subject.total}</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${badgeBg} ${badgeText}`}>
            {currentPercent}%
          </span>
        </div>
      </div>

      <hr className="border-white/5 my-5" />

      {maxPossiblePercent < displayTarget ? (
        <div className="bg-[#1A0B0B] border border-[#3A1616] rounded-xl p-4 flex items-center gap-4 my-3">
          <div className="bg-[#3A1616] text-[#FF453A] rounded-full p-1.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
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
  const fileInputRef = useRef(null);
  const [customAvatar, setCustomAvatar] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('customAvatar');
    if (saved) setCustomAvatar(saved);
  }, []);
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("Student");
  const [loginId, setLoginId] = useState("");
  const [branch, setBranch] = useState("UNKNOWN");
  const [selectedBranch, setSelectedBranch] = useState("UNKNOWN");
  const [target, setTarget] = useState(0.80);
  const [endDate, setEndDate] = useState('2026-04-30');
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("2");
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [hitlistBranch, setHitlistBranch] = useState("");
  const [userBatch, setUserBatch] = useState("B1");

  useEffect(() => {
    const defaultBranch = selectedBranch !== "UNKNOWN" ? selectedBranch : branch;
    if (defaultBranch !== "UNKNOWN" && !hitlistBranch) {
      setHitlistBranch(defaultBranch);
    }
  }, [selectedBranch, branch, hitlistBranch]);



  useEffect(() => {
    setSelectedBranch(localStorage.getItem('userBranch') || "UNKNOWN");
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('student_name');
    if (savedName) {
      if (/^\d+$/.test(savedName) || savedName.toLowerCase() === 'student' || savedName === 'Demo Student') {

        localStorage.removeItem('student_name');
        setLocalName("");
      } else {
        setLocalName(savedName);
      }
    }
  }, []);

  const handleNameSave = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingName(false);
      const finalName = localName.trim() === '' ? 'Student' : localName.trim();
      setLocalName(finalName);
      localStorage.setItem('student_name', finalName);
    }
  };

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        console.log("Debug Data:", parsed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.subjects) {
          setSubjects(parsed.subjects);
          console.log("Portal Subject Codes:", parsed.subjects.map(s => s.code));
          setStudentName(parsed.studentName || "Student");

          const id = parsed.loginId || (/^\d+$/.test(parsed.studentName) ? parsed.studentName : "");
          setLoginId(id);

          if (parsed.studentName && !/^\d+$/.test(parsed.studentName)) {
            setLocalName(parsed.studentName);
            localStorage.setItem('student_name', parsed.studentName);
          }

          const b = parsed.branch || "UNKNOWN";
          setBranch(b);
          if (b !== "UNKNOWN") {
            setSelectedBranch(b);
            localStorage.setItem('userBranch', b);
          }

          if (parsed.semester) {
            setSelectedSemester(parsed.semester);
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

  useEffect(() => {
    // Avoid double-fetching on initial mount
    const dataStr = localStorage.getItem("attendanceData");
    if (dataStr) {
      const parsed = JSON.parse(dataStr);
      if (parsed.semester === selectedSemester) return;
    }

    const fetchAttendance = async () => {
      setIsFetchLoading(true);
      setFetchError("");
      try {
        const password = sessionStorage.getItem("temp_password");
        if (!password || !loginId) {
          setFetchError("Log out and back in to enable switching.");
          return;
        }

        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ register_no: loginId, password, semester: selectedSemester }),
        });

        if (!response.ok) throw new Error("Fetch failed.");
        const data = await response.json();

        setSubjects(data.subjects);
        
        if (data.branch && data.branch !== "UNKNOWN") {
          setHitlistBranch(data.branch);
          setSelectedBranch(data.branch);
        }

        if (data.studentName) {
          setLocalName(data.studentName);
          localStorage.setItem('student_name', data.studentName);
        }

        const currentData = JSON.parse(localStorage.getItem("attendanceData") || "{}");
        localStorage.setItem("attendanceData", JSON.stringify({ ...currentData, ...data, semester: selectedSemester }));

      } catch (err) {
        setFetchError("Portal fetch failed. Retry later.");
      } finally {
        setIsFetchLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedSemester, loginId]);


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

  const activeHitlistBranch = hitlistBranch || activeBranch;
  const hitlistTimetable = masterTimetable[activeHitlistBranch] || masterTimetable["UNKNOWN"];
  const todaysSchedule = hitlistTimetable[currentDayName] || [];

  // Global Health Indicator: Calculate the ring color based on the lowest attendance
  let profileRingColor = 'border-[#D9A02A]/30'; // Default Gold (if no data)
  let profileGlow = 'shadow-[0_0_15px_rgba(217,160,42,0.15)]';

  if (subjects && subjects.length > 0) {
    const lowestPercent = subjects.reduce((min, subject) => {
      const percent = (subject.attended / subject.total) * 100;
      return percent < min ? percent : min;
    }, 100);

    if (lowestPercent < 73) {
      profileRingColor = 'border-[#FF453A]/80'; // Danger Red
      profileGlow = 'shadow-[0_0_20px_rgba(255,69,58,0.4)]';
    } else if (lowestPercent >= 73 && lowestPercent < 75) {
      profileRingColor = 'border-[#FFD60A]/80'; // Warning Yellow
      profileGlow = 'shadow-[0_0_20px_rgba(255,214,10,0.4)]';
    } else {
      profileRingColor = 'border-emerald-500/80'; // Safe Green
      profileGlow = 'shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="antialiased min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden p-4 sm:p-6"
    >

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          if(e.target.files && e.target.files[0]){
            const reader = new FileReader();
            reader.onload = (ev) => { setCustomAvatar(ev.target.result); localStorage.setItem('customAvatar', ev.target.result); };
            reader.readAsDataURL(e.target.files[0]);
          }
        }} />
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">

          {loginId ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`relative w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0 bg-[#1A1408] cursor-pointer group transition-all duration-700 ease-in-out ${profileRingColor} ${profileGlow}`}
              title="Click to change profile picture"
            >
              <img 
                src={customAvatar || `https://btechconnect.staloysius.edu.in/storage/photos/${loginId}.jpg`} 
                alt="Student Profile" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity group-hover:opacity-40"
                onError={(e) => {
                  if (!customAvatar) {
                    e.target.src = `https://ui-avatars.com/api/?name=${localName || 'Student'}&background=1A1408&color=D9A02A`;
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-white/10 bg-white/5 animate-pulse flex-shrink-0" />
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">Welcome,</span>
              <span className="text-3xl font-bold text-white tracking-tight">
                {loginId || "Student"}
              </span>
            </div>
            <p className="text-neutral-400 font-medium tracking-wide text-sm mt-1">
              {activeBranch !== "UNKNOWN" ? activeBranch : "Student"} • {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1 bg-neutral-900 border border-neutral-800"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#130E05] border border-[#2B1D0E] rounded-2xl p-5 mb-8 flex gap-4 relative overflow-hidden"
        >
          <div className="bg-[#2B1D0E] text-[#ECA239] rounded-full p-1.5 h-fit flex-shrink-0 flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-[#ECA239] font-bold text-lg mb-4 flex items-center justify-between">
              Heads up — Read before using
              <button onClick={() => setShowWarning(false)} className="text-neutral-500 hover:text-neutral-400 font-normal absolute top-4 right-4 bg-neutral-900/40 hover:bg-neutral-800/80 p-1 rounded-lg border border-white/5">
                <X className="w-4 h-4" />
              </button>
            </h3>
            <ul className="space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-[#A1A1AA] pl-6 list-disc marker:text-[#6B4E16]">
              <li className="pl-1">
                <span className="text-[#F4F4F5] font-semibold">Set your Last Working Day.</span> The auto-detected end date may not match your actual semester end. Make sure to verify and adjust it — this directly affects how many classes are projected.
              </li>
              <li className="pl-1">
                <span className="text-[#F4F4F5] font-semibold">Keep a buffer.</span> For best results, aim for at least <span className="text-[#F4F4F5] font-semibold">80%</span> instead of cutting it close at 75%. Edge cases, surprise classes, or minor calculation drift can push you below the threshold.
              </li>
              <li className="pl-1">
                <span className="text-[#F4F4F5] font-semibold">Expect slight delays & report bugs.</span> Fetching live portal data can take a few seconds. If you spot any glitches or weird math, please scroll to the bottom of the page and report them!
              </li>
            </ul>
          </div>
        </motion.div>
      )}

      

      <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-2 text-neutral-300 pb-4 border-b border-white/5 mb-4 relative z-10">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider text-white">Semester Settings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

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

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-400 font-medium">Semester End Date</p>
              <div className="flex gap-2">
                <button onClick={() => setEndDate('2026-04-30')} className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-md text-neutral-300 font-medium transition-colors">Apr 30 (LWD)</button>
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

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-400 font-medium">Select Semester</p>
              {isFetchLoading && (
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#D9A02A] flex-shrink-0" />
              )}
            </div>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                }}
                disabled={isFetchLoading}
                className="w-full appearance-none bg-[#1A1408] border border-[#4A3510] text-[#D9A02A] rounded-xl px-4 py-2 pr-10 outline-none focus:border-[#D9A02A] text-sm font-semibold cursor-pointer shadow-sm transition-colors hover:bg-[#2A200C] disabled:opacity-50"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num.toString()}>
                    Semester {num}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#D9A02A]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
            {fetchError && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium bg-rose-500/5 p-1 px-1.5 rounded-lg border border-rose-500/10 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {fetchError}
              </p>
            )}
          </div>

        </div>
      </div>

      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚡ Today&apos;s Hitlist
            {activeHitlistBranch !== "UNKNOWN" && (
              <span className="text-xs font-normal text-neutral-500 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">
                {todaysSchedule.length > 0 ? `${todaysSchedule.length} classes scheduled` : 'No classes or weekend'}
              </span>
            )}
          </h2>

          <div className="flex items-center gap-3">
          <div className="flex bg-[#1A1408] border border-[#4A3510] rounded-lg p-1 w-max">
            {['ISE', 'CSE', 'AIML', 'ECE'].map(branchOption => (
              <button
                key={branchOption}
                onClick={() => setHitlistBranch(branchOption)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeHitlistBranch === branchOption
                    ? 'bg-[#D9A02A] text-black shadow-sm'
                    : 'text-[#8A651B] hover:text-[#D9A02A]'
                  }`}
              >
                {branchOption}
              </button>
            ))}
          </div>
          <div className="flex bg-[#1A1408] border border-[#4A3510] rounded-lg p-1 w-max">
            {['B1', 'B2'].map(batch => (
              <button
                key={batch}
                onClick={() => setUserBatch(batch)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${userBatch === batch 
                    ? 'bg-[#D9A02A] text-black shadow-sm' 
                    : 'text-[#8A651B] hover:text-[#D9A02A]'
                  }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>
        </div>

        {activeHitlistBranch === "UNKNOWN" ? (
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
        ) : todaysSchedule.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysSchedule.map((slot, index) => {
              const displayCode = slot.isLab && slot.codeB1 ? (userBatch === 'B1' ? slot.codeB1 : slot.codeB2) : slot.code;
              
              const userSubjectData = subjects.find(s => {
                if (!displayCode) return false;
                const code = s.code.toLowerCase();
                const dCode = displayCode.toLowerCase().split(' ')[0];
                const name = s.name ? s.name.toLowerCase() : "";
                
                if (code.includes(dCode)) return true;
                
                // Acronym expansions for ALL branches
                if ((dCode === 'phy' || dCode === 'py') && (code.includes('ph') || code.includes('py') || code.includes('bp'))) return true;
                if ((dCode === 'cp') && (code.includes('cs') || code.includes('cd') || code.includes('bc') || code.includes('mc'))) return true;
                if ((dCode === 'de') && (code.includes('ec') || code.includes('de') || code.includes('el'))) return true;
                if ((dCode === 'chy' || dCode === 'ch') && (code.includes('ch') || code.includes('cy') || code.includes('ac'))) return true;
                
                if (dCode === 'uhv' && (code.includes('uh') || code.includes('mc'))) return true;
                if (dCode === 'bio' && (code.includes('bi') || code.includes('bc'))) return true;

                if ((dCode === 'phy' || dCode === 'py') && name.includes('physics')) return true;
                if ((dCode === 'chy' || dCode === 'ch') && name.includes('chemistry')) return true;
                if (dCode === 'cp' && (name.includes('programming') || name.includes('computer'))) return true;
                if (dCode === 'de' && (name.includes('digital') || name.includes('electronic'))) return true;

                return false;
              });

              if (userSubjectData && activeHitlistBranch === activeBranch) {
                return (
                  <motion.div
                    key={`hitlist-${displayCode}-${index}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className={`h-full ${slot.isLab ? 'md:col-span-2' : ''}`}
                  >
                    <div className="relative h-full">
                      {slot.isLab && (
                        <span className="absolute -top-1.5 right-4 bg-purple-500/20 text-purple-400 text-[9px] font-bold px-2 py-0.5 rounded-md border border-purple-500/30 z-10 tracking-wider">
                          {userBatch} LAB
                        </span>
                      )}
                      <SubjectCard
                        subject={userSubjectData}
                        target={target}
                        endDate={endDate}
                        branch={activeBranch}
                        timeSlot={`${slot.start} - ${slot.end}`}
                        customTitle={displayCode}
                      />
                    </div>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={`hitlist-${displayCode}-${index}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <div className="bg-[#18181b] border border-white/5 rounded-[1.5rem] p-5 shadow-lg flex flex-col justify-center border-l-4 border-l-neutral-700 h-full relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                        Class in Session
                      </span>
                      <h3 className="text-base font-semibold text-white/90 tracking-tight truncate">
                        {userSubjectData ? userSubjectData.name : (subjectNamesLookup[displayCode] || displayCode)}
                      </h3>
                      {slot.start && (
                        <p className="text-[11px] font-medium text-neutral-500 font-mono mt-1 flex items-center gap-1">
                          {slot.start} - {slot.end}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              }
            })}
          </div>
        ) : (
          <div className="bg-neutral-900/40 border border-neutral-800/50 border-dashed rounded-2xl p-8 text-center">
            <p className="text-neutral-500 text-sm">You are free today! Enjoy the break or study. 🎉</p>
          </div>
        )}
      </div>

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
