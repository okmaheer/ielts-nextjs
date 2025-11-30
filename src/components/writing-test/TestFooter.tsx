// components/writing-test/TestFooter.tsx
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface TestFooterProps {
  currentTask: number;
  totalTasks: number;
  darkMode: boolean;
  availableTaskNumbers?: number[]; // Array of available task numbers [1, 2] or [1] or [2]
  onTaskChange: (taskNumber: number) => void;
  onSubmit: () => void;
}

export default function TestFooter({
  currentTask,
  totalTasks,
  darkMode,
  availableTaskNumbers = [1, 2], // Default to both tasks
  onTaskChange,
  onSubmit,
}: TestFooterProps) {
  // If only one task is available, don't show navigation
  if (totalTasks === 1) {
    return (
      <footer
        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg`}
      >
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Left - Task Info */}
          <div
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium order-1 sm:order-none`}
          >
            Task {availableTaskNumbers[0]}
          </div>

          {/* Empty center for layout */}
          <div className="order-2 sm:order-none"></div>

          {/* Right - Submit Button */}
          <button
            onClick={onSubmit}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 order-3 sm:order-none"
          >
            <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Submit Task</span>
          </button>
        </div>
      </footer>
    );
  }

  // Check which tasks are completed (not available for navigation)
  const isTask1Completed = !availableTaskNumbers.includes(1);
  const isTask2Completed = !availableTaskNumbers.includes(2);

  return (
    <footer
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg`}
    >
      <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Left - Task Info */}
        <div
          className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm font-medium order-1 sm:order-none`}
        >
          Task {currentTask} of {totalTasks}
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-none w-full sm:w-auto">
          <button
            onClick={() => onTaskChange(1)}
            disabled={currentTask === 1 || isTask1Completed}
            title={
              isTask1Completed ? 'This task has already been submitted' : ''
            }
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
              currentTask === 1 || isTask1Completed
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#06BBCC] hover:bg-[#059aa8] text-white shadow-sm hover:shadow-md'
            }`}
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Task 1</span>
            {isTask1Completed && (
              <CheckCircle size={14} className="sm:w-4 sm:h-4 ml-1" />
            )}
          </button>

          <button
            onClick={() => onTaskChange(2)}
            disabled={currentTask === 2 || isTask2Completed}
            title={
              isTask2Completed ? 'This task has already been submitted' : ''
            }
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
              currentTask === 2 || isTask2Completed
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#06BBCC] hover:bg-[#059aa8] text-white shadow-sm hover:shadow-md'
            }`}
          >
            <span>Task 2</span>
            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            {isTask2Completed && (
              <CheckCircle size={14} className="sm:w-4 sm:h-4 ml-1" />
            )}
          </button>
        </div>

        {/* Right - Submit Button */}
        <button
          onClick={onSubmit}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 order-3 sm:order-none"
        >
          <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Submit Test</span>
        </button>
      </div>
    </footer>
  );
}
