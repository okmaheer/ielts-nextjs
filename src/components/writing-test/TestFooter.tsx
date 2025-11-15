// components/writing-test/TestFooter.tsx
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface TestFooterProps {
  currentTask: number;
  totalTasks: number;
  darkMode: boolean;
  onTaskChange: (taskNumber: number) => void;
  onSubmit: () => void;
}

export default function TestFooter({
  currentTask,
  totalTasks,
  darkMode,
  onTaskChange,
  onSubmit,
}: TestFooterProps) {
  return (
    <footer
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-6 py-4 shadow-lg`}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Left - Task Info */}
        <div
          className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}
        >
          Task {currentTask} of {totalTasks}
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTaskChange(1)}
            disabled={currentTask === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              currentTask === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#06BBCC] hover:bg-[#059aa8] text-white shadow-sm hover:shadow-md'
            }`}
          >
            <ChevronLeft size={18} />
            Task 1
          </button>

          <button
            onClick={() => onTaskChange(2)}
            disabled={currentTask === 2}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              currentTask === 2
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#06BBCC] hover:bg-[#059aa8] text-white shadow-sm hover:shadow-md'
            }`}
          >
            Task 2
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right - Submit Button */}
        <button
          onClick={onSubmit}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <CheckCircle size={18} />
          Submit Test
        </button>
      </div>
    </footer>
  );
}
