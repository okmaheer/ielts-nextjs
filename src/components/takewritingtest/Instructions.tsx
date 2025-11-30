// components/takewritingtest/Instructions.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileText,
  Target,
  Settings,
  Timer,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import UserDropdown from '@/components/header/UserDropdown';
import { useAuth } from '@/context/AuthContext';

interface Section {
  title: string;
  duration?: number;
  description: string;
  requirements: string[];
}

interface GeneralRule {
  icon: string;
  title: string;
  description: string;
}

interface InstructionsProps {
  testType: 'Writing' | 'Reading' | 'Listening' | 'Speaking';
  category: 'Academic' | 'General Training';
  duration: number;
  testName?: string | null;
  sections: Section[];
  generalRules: GeneralRule[];
  importantNotes: string[];
  startRoute: string;
}

// Icon mapping (allow standard SVG props like style)
const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  Settings,
  Timer,
};

export default function Instructions({
  testType,
  category,
  duration,
  generalRules,
  importantNotes,
  startRoute,
}: InstructionsProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleStartTest = (): void => {
    if (!agreedToTerms) {
      alert(
        'Please confirm that you have read and understood the instructions.'
      );
      return;
    }
    router.push(startRoute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ color: '#06BBCC' }}
            >
              IELTS Practice
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <UserDropdown />
                </>
              ) : (
                <Link
                  href="/signin"
                  className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center">
            <div
              className="mb-6 inline-flex items-center justify-center rounded-full p-4"
              style={{ backgroundColor: '#06BBCC20' }}
            >
              <BookOpen className="h-12 w-12" style={{ color: '#06BBCC' }} />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to IELTS {category} {testType} Test
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Please read all instructions carefully before starting the test
            </p>
            <div
              className="inline-flex items-center gap-2 rounded-full px-6 py-3"
              style={{ backgroundColor: '#06BBCC20' }}
            >
              <Clock className="h-5 w-5" style={{ color: '#06BBCC' }} />
              <span className="font-semibold" style={{ color: '#06BBCC' }}>
                Total Duration: {duration} minutes
              </span>
            </div>
          </div>

          {/* Test Features Section */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Test Features
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {generalRules.map((rule, index) => {
                const IconComponent = iconMap[rule.icon] || FileText;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: '#06BBCC20' }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: '#06BBCC' }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {rule.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* AI-Expert Review Feature */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#06BBCC20' }}
                >
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: '#06BBCC' }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    AI-Expert Review
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get instant AI feedback followed by expert evaluation
                  </p>
                </div>
              </div>

              {/* Flexibility Feature */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#06BBCC20' }}
                >
                  <Target className="h-5 w-5" style={{ color: '#06BBCC' }} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Flexibility
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Practice from anywhere at any time
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes Section */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/30 dark:bg-orange-900/10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Important Guidelines
              </h3>
            </div>
            <ul className="space-y-3">
              {importantNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: '#06BBCC' }}
                  />
                  <span className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* User Agreement Checkbox */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-5 w-5 rounded focus:ring-offset-2 dark:border-gray-600"
                style={{ accentColor: '#06BBCC' }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I have read and understood all the instructions and guidelines.
                I agree to complete the test under the specified conditions and
                understand that this test can only be taken once.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>

            <button
              onClick={handleStartTest}
              disabled={!agreedToTerms}
              className={`flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-all ${
                agreedToTerms
                  ? 'hover:shadow-md'
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{ backgroundColor: agreedToTerms ? '#06BBCC' : '#9CA3AF' }}
            >
              Start Test
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Footer Info */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
