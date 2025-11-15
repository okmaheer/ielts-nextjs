// components/takewritingtest/Instructions.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
} from 'lucide-react';

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
  testName,
  sections,
  generalRules,
  importantNotes,
  startRoute,
}: InstructionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const totalSteps = 4; // Overview, Sections, Features, Important Notes

  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTest = (): void => {
    if (!agreedToTerms) {
      alert(
        'Please confirm that you have read and understood the instructions.'
      );
      return;
    }
    router.push(startRoute);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className="mb-6 inline-flex items-center justify-center rounded-full p-4"
                style={{ backgroundColor: '#06BBCC20' }}
              >
                <BookOpen className="h-12 w-12" style={{ color: '#06BBCC' }} />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                xWelcome to IELTS {category} {testType} Test
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

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Test Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#06BBCC20' }}
                  >
                    <FileText
                      className="h-4 w-4"
                      style={{ color: '#06BBCC' }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sections.length}{' '}
                      {sections.length === 1 ? 'Section' : 'Sections'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Complete all sections within the time limit
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#06BBCC20' }}
                  >
                    <Target className="h-4 w-4" style={{ color: '#06BBCC' }} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      User-Friendly Interface
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clear layout with accessibility features
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#06BBCC20' }}
                  >
                    <CheckCircle
                      className="h-4 w-4"
                      style={{ color: '#06BBCC' }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      AI + Expert Review
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get instant AI feedback followed by expert evaluation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Test Structure
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Understand the requirements for each section
              </p>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    className="p-6"
                    style={{
                      background:
                        'linear-gradient(135deg, #06BBCC15 0%, #06BBCC05 100%)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      {section.duration && (
                        <span
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                          style={{ backgroundColor: '#06BBCC', color: 'white' }}
                        >
                          <Clock className="h-3.5 w-3.5" />~{section.duration}{' '}
                          min
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                      {section.description}
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        Key Points:
                      </p>
                      {section.requirements.map((requirement, reqIndex) => (
                        <div key={reqIndex} className="flex items-start gap-2">
                          <ChevronRight
                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                            style={{ color: '#06BBCC' }}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {requirement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Test Features
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tools and features available during your test
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {generalRules.map((rule, index) => {
                const IconComponent = iconMap[rule.icon] || FileText;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: '#06BBCC20' }}
                    >
                      <IconComponent
                        className="h-6 w-6"
                        style={{ color: '#06BBCC' }}
                      />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                      {rule.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {rule.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div
                className="mb-4 inline-flex items-center justify-center rounded-full p-4"
                style={{ backgroundColor: '#FFA50020' }}
              >
                <AlertTriangle className="h-12 w-12 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Important Guidelines
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please read these carefully before starting
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/30 dark:bg-orange-900/10">
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

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded  focus:ring-offset-2 dark:border-gray-600"
                  style={{ accentColor: '#06BBCC' }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I have read and understood all the instructions and
                  guidelines. I agree to complete the test under the specified
                  conditions and understand that this test can only be taken
                  once.
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium" style={{ color: '#06BBCC' }}>
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
                backgroundColor: '#06BBCC',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 min-h-[500px]">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={currentStep === 0 ? () => router.back() : handlePrevious}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            {currentStep === 0 ? 'Go Back' : 'Previous'}
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-all hover:shadow-md"
              style={{ backgroundColor: '#06BBCC' }}
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
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
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Test: #{testName} • Make sure you&apos;re ready before starting
          </p>
        </div>
      </div>
    </div>
  );
}
