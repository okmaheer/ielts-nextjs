// components/writing-test/SubmitModal.tsx
import { CheckCircle, Loader2 } from 'lucide-react';

interface SubmitModalProps {
  show: boolean;
  darkMode: boolean;
  task1Words: number;
  task2Words: number;
  timeRemaining: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SubmitModal({
  show,
  darkMode,
  task1Words,
  task2Words,
  timeRemaining,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: SubmitModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold">Submit Test?</h3>
        </div>

        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Are you sure you want to submit your test? You won&apos;t be able to
          make any changes after submission.
        </p>

        <div
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-6 space-y-2`}
        >
          <div className="flex justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Task 1 Words:
            </span>
            <span className="font-semibold">{task1Words} words</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Task 2 Words:
            </span>
            <span className="font-semibold">{task2Words} words</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Time Remaining:
            </span>
            <span className="font-semibold">{timeRemaining}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-5 py-3 rounded-xl font-semibold transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
