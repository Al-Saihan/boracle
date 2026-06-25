'use client';
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function DayPicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (day) => {
    onChange(day);
    setOpen(false);
  };

  const formatDay = (dayStr) => {
    if (!dayStr) return 'Select Day';
    return dayStr.charAt(0) + dayStr.slice(1).toLowerCase();
  };

  return (
    <>
      <button
        type="button"
        id={id}
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-medium hover:border-blue-400 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        {formatDay(value)}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="!max-w-[320px] !p-0 !gap-0 rounded-2xl bg-white dark:bg-[#0f172a] border-gray-200 dark:border-blue-800/50">
          <DialogTitle className="sr-only">Select Day</DialogTitle>
          <div className="p-5 pb-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Select Day
            </p>
            <div className="flex flex-col gap-1.5 mb-5">
              {DAYS.map((day) => {
                const isSelected = value === day;
                return (
                  <button
                    key={day}
                    onClick={() => handleSelect(day)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {formatDay(day)}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-blue-800/50">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
