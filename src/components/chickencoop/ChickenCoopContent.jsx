'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Monitor, Loader2, SearchX, Cpu, Zap, Atom, Microscope, Landmark } from 'lucide-react';
import ClockTimePicker from '@/components/chickencoop/ClockTimePicker';
import DayPicker from '@/components/chickencoop/DayPicker';
import { getCache, setCache } from '@/lib/idb';

const CONNECT_CDN_URL = 'https://usis-cdn.eniamza.com/connect.json';
const CACHE_KEY = 'boracle_labfinder_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Department definitions with colors and icons
const DEPARTMENTS = [
  { key: 'CSE', label: 'CSE', color: 'blue', icon: Cpu },
  { key: 'EEE', label: 'EEE', color: 'amber', icon: Zap },
  { key: 'PHY', label: 'PHY', color: 'purple', icon: Atom },
  { key: 'MIC', label: 'MIC', color: 'emerald', icon: Microscope },
  { key: 'ARC', label: 'ARC', color: 'rose', icon: Landmark },
];

// Map department keys to Tailwind color classes
const DEPT_COLORS = {
  CSE: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
    dot: 'bg-blue-500',
    ring: 'ring-blue-500/20',
    checkActive: 'bg-blue-600 border-blue-600',
  },
  EEE: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    checkActive: 'bg-amber-600 border-amber-600',
  },
  PHY: {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
    dot: 'bg-purple-500',
    ring: 'ring-purple-500/20',
    checkActive: 'bg-purple-600 border-purple-600',
  },
  MIC: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
    checkActive: 'bg-emerald-600 border-emerald-600',
  },
  ARC: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-700',
    dot: 'bg-rose-500',
    ring: 'ring-rose-500/20',
    checkActive: 'bg-rose-600 border-rose-600',
  },
};

// Known department prefixes to match courseCode against
const DEPT_PREFIXES = {
  CSE: ['CSE', 'CST'],
  EEE: ['EEE', 'ECE', 'APE'],
  PHY: ['PHY'],
  MIC: ['MIC', 'BIO', 'BTE', 'GEN'],
  ARC: ['ARC'],
};

const JS_DAY_TO_NAME = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

/**
 * Given a courseCode like "CSE321L" or "EEE282", determine which department key it belongs to.
 * Returns the key string or null.
 */
function getDeptFromCourseCode(courseCode) {
  if (!courseCode) return null;
  const upper = courseCode.toUpperCase();
  for (const [dept, prefixes] of Object.entries(DEPT_PREFIXES)) {
    for (const prefix of prefixes) {
      if (upper.startsWith(prefix)) return dept;
    }
  }
  return null;
}

/**
 * Check if a room name ends with "L" (lab room convention).
 */
function isLabRoom(roomName) {
  if (!roomName) return false;
  return roomName.trim().toUpperCase().endsWith('L');
}

/**
 * Convert "HH:MM:SS" or "HH:MM" to minutes since midnight for easy comparison.
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  const parts = timeStr.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

/**
 * Check if a given time (in minutes) falls within a schedule slot.
 */
function isTimeInSlot(selectedMinutes, startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start < 0 || end < 0) return false;
  return selectedMinutes >= start && selectedMinutes < end;
}

/**
 * Get today's day of the week.
 */
function getTodayDayName() {
  const now = new Date();
  return JS_DAY_TO_NAME[now.getDay()] || 'SUNDAY';
}

/**
 * Get current time in HH:MM format.
 */
function getNowTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export default function ChickenCoopContent() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(getTodayDayName);
  const [selectedTime, setSelectedTime] = useState(getNowTimeStr);
  const [selectedDepts, setSelectedDepts] = useState(new Set());

  // Fetch courses with caching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Check IDB cache
      const cached = await getCache(CACHE_KEY);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setCourses(cached);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(CONNECT_CDN_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const arr = Array.isArray(data) ? data : (data.sections || []);
        setCourses(arr);

        // Save to IDB cache
        await setCache(CACHE_KEY, arr, CACHE_TTL);
      } catch (err) {
        setError('Failed to load course data. Please try again later.');
        console.error('ChickenCoop fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Build lab room data: Map<roomName, { depts: Set, schedules: [{day, startTime, endTime, courseCode}] }>
  const labRoomMap = useMemo(() => {
    const map = new Map();

    const addRoom = (roomName, courseCode, schedules) => {
      if (!isLabRoom(roomName) || !schedules) return;
      const room = roomName.trim();
      if (!map.has(room)) {
        map.set(room, { depts: new Set(), schedules: [] });
      }
      const entry = map.get(room);
      const dept = getDeptFromCourseCode(courseCode);
      if (dept) entry.depts.add(dept);

      schedules.forEach(s => {
        entry.schedules.push({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          courseCode,
        });
      });
    };

    courses.forEach(section => {
      // Check roomName (direct lab sections — sectionType LAB / STUDIO)
      if (isLabRoom(section.roomName) && section.sectionSchedule?.classSchedules) {
        addRoom(section.roomName, section.courseCode, section.sectionSchedule.classSchedules);
      }

      // Check labRoomName (theory courses with an associated lab)
      if (section.labRoomName) {
        // labRoomName can contain semicolons for multiple rooms
        const labRooms = section.labRoomName.split(';').map(r => r.trim());
        labRooms.forEach(lr => {
          if (isLabRoom(lr)) {
            const labSchedules = section.labSchedules || [];
            addRoom(lr, section.labCourseCode || section.courseCode, labSchedules);
          }
        });
      }
    });

    return map;
  }, [courses]);

  // Filter: find empty lab rooms
  const results = useMemo(() => {
    const selectedMinutes = timeToMinutes(selectedTime + ':00');

    const allRooms = [];
    for (const [roomName, info] of labRoomMap) {
      // Department filter
      if (selectedDepts.size > 0) {
        const hasMatch = [...info.depts].some(d => selectedDepts.has(d));
        if (!hasMatch) continue;
      }

      // Check if room is occupied at selected day + time
      const isOccupied = info.schedules.some(s =>
        s.day === selectedDay && isTimeInSlot(selectedMinutes, s.startTime, s.endTime)
      );

      // Find the next upcoming class today for context
      let nextClass = null;
      if (!isOccupied) {
        const todaySchedules = info.schedules
          .filter(s => s.day === selectedDay && timeToMinutes(s.startTime) > selectedMinutes)
          .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        if (todaySchedules.length > 0) {
          nextClass = todaySchedules[0];
        }
      }

      // Find current occupying class if occupied
      let occupyingClass = null;
      if (isOccupied) {
        occupyingClass = info.schedules.find(s =>
          s.day === selectedDay && isTimeInSlot(selectedMinutes, s.startTime, s.endTime)
        );
      }

      allRooms.push({
        roomName,
        depts: [...info.depts].sort(),
        isOccupied,
        nextClass,
        occupyingClass,
      });
    }

    // Sort: available first, then by room name
    allRooms.sort((a, b) => {
      if (a.isOccupied !== b.isOccupied) return a.isOccupied ? 1 : -1;
      return a.roomName.localeCompare(b.roomName);
    });

    return allRooms;
  }, [labRoomMap, selectedDay, selectedTime, selectedDepts]);

  const availableCount = results.filter(r => !r.isOccupied).length;
  const occupiedCount = results.filter(r => r.isOccupied).length;

  const toggleDept = (deptKey) => {
    setSelectedDepts(prev => {
      const next = new Set(prev);
      if (next.has(deptKey)) {
        next.delete(deptKey);
      } else {
        next.add(deptKey);
      }
      return next;
    });
  };

  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m.substring(0, 2)} ${ampm}`;
  };

  // Parse room code for building/floor info
  const parseRoomCode = (roomName) => {
    // Format like "09B-12L" → Building 09B, Room 12L
    const parts = roomName.split('-');
    if (parts.length === 2) {
      return { building: parts[0], room: parts[1] };
    }
    return { building: '', room: roomName };
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        {/* Controls Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Date & Time Pickers */}
          <div className="grid grid-cols-2 gap-0">
            <div className="p-4 border-r border-gray-200 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Day
              </label>
              <DayPicker
                id="chickencoop-day-picker"
                value={selectedDay}
                onChange={setSelectedDay}
              />
            </div>
            <div className="p-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Time
              </label>
              <ClockTimePicker
                id="chickencoop-time-picker"
                value={selectedTime}
                onChange={setSelectedTime}
              />
            </div>
          </div>

          {/* Department Filters */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DEPARTMENTS.map(({ key, label, icon: Icon }) => {
                const isActive = selectedDepts.has(key);
                const colors = DEPT_COLORS[key];
                return (
                  <button
                    key={key}
                    id={`chickencoop-filter-${key.toLowerCase()}`}
                    onClick={() => toggleDept(key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${isActive
                      ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm`
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {isActive && (
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                    )}
                  </button>
                );
              })}
              {selectedDepts.size > 0 && (
                <button
                  onClick={() => setSelectedDepts(new Set())}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 mt-4">
        {/* Stats Bar */}
        {!loading && !error && (
          <div className="max-w-3xl mx-auto flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{availableCount}</span>
                available
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-lg font-bold text-red-500 dark:text-red-400">{occupiedCount}</span>
                occupied
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {selectedDay.charAt(0) + selectedDay.slice(1).toLowerCase()} · {formatTimeDisplay(selectedTime)}
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading lab data...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                <SearchX className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Room Cards */}
        {!loading && !error && (
          <div className="max-w-3xl mx-auto">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <SearchX className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No lab rooms found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your department filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map(({ roomName, depts, isOccupied, nextClass, occupyingClass }) => {
                  const { building, room } = parseRoomCode(roomName);
                  return (
                    <div
                      key={roomName}
                      className={`group relative bg-white dark:bg-gray-900 border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${isOccupied
                        ? 'border-red-200 dark:border-red-900/50 opacity-60'
                        : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                        }`}
                    >
                      {/* Room Name & Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Building2 className={`w-4 h-4 ${isOccupied ? 'text-red-400' : 'text-emerald-500'}`} />
                            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                              {roomName}
                            </span>
                          </div>

                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isOccupied
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                          {isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </div>

                      {/* Department Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {depts.map(dept => {
                          const colors = DEPT_COLORS[dept];
                          const DeptIcon = DEPARTMENTS.find(d => d.key === dept)?.icon || Monitor;
                          return (
                            <span
                              key={dept}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                              <DeptIcon className="w-3 h-3" />
                              {dept}
                            </span>
                          );
                        })}
                        {depts.length === 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            <Monitor className="w-3 h-3" />
                            Other
                          </span>
                        )}
                      </div>

                      {/* Context Info */}
                      {!isOccupied && nextClass && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Next: <span className="font-medium text-gray-500 dark:text-gray-400">{nextClass.courseCode}</span> at {formatTimeDisplay(nextClass.startTime)}
                        </p>
                      )}
                      {isOccupied && occupyingClass && (
                        <p className="text-xs text-red-400 dark:text-red-500 mt-1">
                          In use: <span className="font-medium">{occupyingClass.courseCode}</span> until {formatTimeDisplay(occupyingClass.endTime)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
