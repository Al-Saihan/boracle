'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const SIZE = 240;
const CENTER = SIZE / 2;
const NUM_RADIUS = 92;
const HAND_LEN = 92;
const NUM_SIZE = 36;

function getPos(value, max, radius) {
  const deg = (value / max) * 360 - 90;
  const rad = (deg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

function angleFromPointer(e, ref) {
  const rect = ref.getBoundingClientRect();
  const x = e.clientX - rect.left - CENTER;
  const y = e.clientY - rect.top - CENTER;
  let angle = (Math.atan2(x, -y) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return angle;
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTE_LABELS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function ClockTimePicker({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('hour');
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState('AM');
  const [dragging, setDragging] = useState(false);
  const clockRef = useRef(null);

  // Parse "HH:MM" (24h) into state
  const syncFromValue = useCallback(() => {
    if (!value) return;
    const [h, m] = value.split(':').map(Number);
    setHour(h === 0 ? 12 : h > 12 ? h - 12 : h);
    setMinute(m);
    setPeriod(h >= 12 ? 'PM' : 'AM');
  }, [value]);

  const handleOpen = () => {
    syncFromValue();
    setMode('hour');
    setOpen(true);
  };

  const to24 = (h, m, p) => {
    let h24 = p === 'AM' ? (h === 12 ? 0 : h) : (h === 12 ? 12 : h + 12);
    return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    onChange(to24(hour, minute, period));
    setOpen(false);
  };

  const updateFromAngle = useCallback((angle) => {
    if (mode === 'hour') {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      setHour(h);
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      setMinute(m);
    }
  }, [mode]);

  const onPointerDown = (e) => {
    e.preventDefault();
    if (clockRef.current) {
      clockRef.current.setPointerCapture(e.pointerId);
      setDragging(true);
      updateFromAngle(angleFromPointer(e, clockRef.current));
    }
  };
  const onPointerMove = (e) => {
    if (!dragging || !clockRef.current) return;
    updateFromAngle(angleFromPointer(e, clockRef.current));
  };
  const onPointerUp = () => {
    setDragging(false);
    if (mode === 'hour') setTimeout(() => setMode('minute'), 200);
  };

  // Current hand target
  const sel = mode === 'hour' ? hour % 12 : minute;
  const max = mode === 'hour' ? 12 : 60;
  const hand = getPos(sel, max, HAND_LEN);

  // Format for trigger button
  const fmt = (v) => {
    if (!v) return '--:--';
    const [h, m] = v.split(':').map(Number);
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const numbers = mode === 'hour' ? HOURS : MINUTE_LABELS;
  const selectedVal = mode === 'hour' ? hour : minute;

  return (
    <>
      <button
        type="button"
        id={id}
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-medium hover:border-blue-400 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm cursor-pointer"
      >
        <Clock className="w-4 h-4 text-gray-400" />
        {fmt(value)}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="!max-w-[320px] !p-0 !gap-0 rounded-2xl bg-white dark:bg-[#0f172a] border-gray-200 dark:border-blue-800/50">
          <DialogTitle className="sr-only">Select Time</DialogTitle>
          <div className="p-5 pb-2">
            {/* Header label */}
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Select Time
            </p>

            {/* Time display */}
            <div className="flex items-center justify-center gap-0.5 mb-5">
              <button
                type="button"
                onClick={() => setMode('hour')}
                className={`text-5xl font-bold w-[72px] py-1 rounded-lg transition-colors ${
                  mode === 'hour'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {String(hour).padStart(2, '0')}
              </button>
              <span className="text-5xl font-bold text-gray-800 dark:text-gray-200 -mt-1">:</span>
              <button
                type="button"
                onClick={() => setMode('minute')}
                className={`text-5xl font-bold w-[72px] py-1 rounded-lg transition-colors ${
                  mode === 'minute'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {String(minute).padStart(2, '0')}
              </button>

              {/* AM/PM */}
              <div className="flex flex-col ml-2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden self-stretch">
                {['AM', 'PM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`flex-1 px-3 text-lg font-bold transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Clock face */}
            <div
              ref={clockRef}
              className="relative mx-auto cursor-pointer select-none touch-none"
              style={{ width: SIZE, height: SIZE }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800" />

              {/* Hand line + dots (SVG) */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={SIZE}
                height={SIZE}
              >
                <line
                  x1={CENTER} y1={CENTER}
                  x2={hand.x} y2={hand.y}
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-blue-600 dark:text-blue-500"
                />
                <circle
                  cx={CENTER} cy={CENTER} r={4}
                  fill="currentColor"
                  className="text-blue-600 dark:text-blue-500"
                />
                <circle
                  cx={hand.x} cy={hand.y} r={4}
                  fill="currentColor"
                  className="text-blue-600 dark:text-blue-500"
                />
              </svg>

              {/* Numbers */}
              {numbers.map((n) => {
                const pos = getPos(mode === 'hour' ? n % 12 : n, max, NUM_RADIUS);
                const isSelected = n === selectedVal;
                return (
                  <div
                    key={n}
                    className={`absolute flex items-center justify-center rounded-full text-sm font-semibold transition-colors pointer-events-none ${
                      isSelected
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    style={{
                      width: NUM_SIZE,
                      height: NUM_SIZE,
                      left: pos.x - NUM_SIZE / 2,
                      top: pos.y - NUM_SIZE / 2,
                    }}
                  >
                    {mode === 'minute' ? String(n).padStart(2, '0') : n}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-blue-800/50">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
