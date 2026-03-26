"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Users, Zap, XCircle } from 'lucide-react';

const allPossibleSlots = [
  "09:00 AM - 09:50 AM",
  "09:50 AM - 10:40 AM",
  "10:55 AM - 11:45 AM",
  "11:45 AM - 12:35 PM",
  "01:30 PM - 02:20 PM",
  "02:25 PM - 03:15 PM",
  "03:20 PM - 04:10 PM"
];

const masterTimetable = {
  "ISE": ["09:00 AM - 09:50 AM", "11:45 AM - 12:35 PM", "01:30 PM - 02:20 PM"],
  "CSE": ["09:50 AM - 10:40 AM", "10:55 AM - 11:45 AM", "01:30 PM - 02:20 PM"],
  "ECE": ["10:55 AM - 11:45 AM", "02:25 PM - 03:15 PM", "03:20 PM - 04:10 PM"]
};

export default function CollisionEngine() {
  const [branchOne, setBranchOne] = useState("");
  const [branchTwo, setBranchTwo] = useState("");
  
  const branches = Object.keys(masterTimetable);

  const calculateFreeSlots = () => {
    if (!branchOne || !branchTwo) return null;
    
    const busyOne = masterTimetable[branchOne];
    const busyTwo = masterTimetable[branchTwo];
    
    return allPossibleSlots.filter(slot => !busyOne.includes(slot) && !busyTwo.includes(slot));
  };

  const freeSlots = calculateFreeSlots();

  return (
    <div className="bg-[#18181b] border border-white/5 rounded-[2rem] p-6 sm:p-8 w-full shadow-2xl relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#D9A02A]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9A02A]/10 p-2 rounded-xl border border-[#D9A02A]/20">
              <Zap className="w-5 h-5 text-[#D9A02A]" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Collision Engine</h2>
          </div>
          <p className="text-neutral-400 text-sm">
            Cross-reference chaotic schedules across branches to find overlapping free periods.
          </p>
        </div>

        {/* Selection Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider pl-1">Your Branch</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <select
                value={branchOne}
                onChange={(e) => setBranchOne(e.target.value)}
                className="w-full appearance-none bg-[#111] border border-white/10 text-white rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-[#3B82F6]/50 transition-colors shadow-inner cursor-pointer text-sm"
              >
                <option value="" disabled>Select Branch</option>
                {branches.map(b => (
                  <option key={b} value={b}>{b} Engineering</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider pl-1">Friend&apos;s Branch</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              <select
                value={branchTwo}
                onChange={(e) => setBranchTwo(e.target.value)}
                className="w-full appearance-none bg-[#111] border border-white/10 text-white rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-[#D9A02A]/50 transition-colors shadow-inner cursor-pointer text-sm"
              >
                <option value="" disabled>Select Branch</option>
                {branches.map(b => (
                  <option key={b} value={b}>{b} Engineering</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Matrix */}
        {freeSlots && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-6 border-t border-white/5"
          >
            {freeSlots.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Available Overlap</h3>
                  <span className="text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {freeSlots.length} Match{freeSlots.length !== 1 && 'es'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {freeSlots.map((slot, i) => (
                    <motion.div 
                      key={slot}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border border-[#D9A02A]/30 p-4 rounded-2xl flex items-center justify-between group hover:border-[#D9A02A]/60 transition-colors shadow-[0_0_15px_rgba(217,160,42,0.05)] hover:shadow-[0_0_20px_rgba(217,160,42,0.15)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#D9A02A]/10 p-2.5 rounded-full">
                          <Clock className="w-4 h-4 text-[#D9A02A]" />
                        </div>
                        <span className="text-[13px] sm:text-sm font-medium text-white/90 font-mono tracking-tight">{slot}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#2A1616] border border-[#FF453A]/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                <XCircle className="w-8 h-8 text-[#FF453A]" />
                <div>
                  <h3 className="text-base font-bold text-[#FF453A] mb-1">Incompatible Schedules</h3>
                  <p className="text-rose-400/80 text-sm max-w-sm mx-auto">
                    Total gridlock. You both have zero overlapping free time. You will never see each other today.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
