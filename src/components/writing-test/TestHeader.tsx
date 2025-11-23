// components/writing-test/TestHeader.tsx
'use client';

import { Settings, BookOpen, Clock, Sun, Moon, Type } from 'lucide-react';
import UserDropdown from '@/components/header/UserDropdown';

interface TestHeaderProps {
  timeRemaining: number;
  darkMode: boolean;
  fontSize: number;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  setDarkMode: (mode: boolean) => void;
  setFontSize: (size: number) => void;
  onDashboardClick: () => void;
  onLogout: () => void;
}

export default function TestHeader({
  timeRemaining,
  darkMode,
  fontSize,
  showSettings,
  setShowSettings,
  setDarkMode,
  setFontSize,
  onDashboardClick,
}: TestHeaderProps) {
  const formatTime = (seconds: number): string => {
    // Handle invalid values (NaN, undefined, null, or negative)
    if (isNaN(seconds) || seconds == null || seconds < 0) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 300) return 'text-red-500';
    if (timeRemaining <= 600) return 'text-orange-500';
    return darkMode ? 'text-white' : 'text-gray-800';
  };

  return (
    <header
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 sm:px-6 py-3 sm:py-4 shadow-sm`}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-center gap-4 sm:gap-6 relative">
        {/* Left Spacer for balance */}
        <div className="flex-1"></div>

        {/* Center - Timer */}
        <div className="flex flex-col items-center">
          <div
            className={`text-2xl sm:text-3xl font-bold ${getTimerColor()} ${timeRemaining <= 300 ? 'animate-pulse' : ''}`}
          >
            {formatTime(timeRemaining)}
          </div>
          <div
            className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1 flex items-center gap-1`}
          >
            <Clock size={12} />
            <span className="hidden sm:inline">Time Remaining</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onDashboardClick}
            className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md"
          >
            <BookOpen size={16} className="sm:block" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-2 sm:p-2.5 rounded-lg transition-all`}
            >
              <Settings size={18} className="sm:w-5 sm:h-5" />
            </button>

            {showSettings && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSettings(false)}
                />
                <div
                  className={`absolute right-0 mt-2 w-72 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl p-5 z-50`}
                >
                  <h3 className="text-lg font-semibold mb-4">Settings</h3>
                  <div className="space-y-5">
                    {/* Font Size */}
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Type size={16} />
                        Font Size
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            setFontSize(Math.max(12, fontSize - 2))
                          }
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2 rounded-lg font-semibold transition-all`}
                        >
                          A-
                        </button>
                        <span className="text-sm font-medium min-w-[60px] text-center">
                          {fontSize}px
                        </span>
                        <button
                          onClick={() =>
                            setFontSize(Math.min(24, fontSize + 2))
                          }
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2 rounded-lg font-semibold transition-all`}
                        >
                          A+
                        </button>
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div>
                      <label className="text-sm font-medium mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                          Dark Mode
                        </span>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-[#06BBCC]' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : ''}`}
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
