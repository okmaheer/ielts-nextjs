'use client';

import React, { useState } from 'react';
import TestList from '@/components/opencomponents/takewritingtest/TestList';
import { Clock, Target, Sparkles, CheckCircle, UserCheck } from 'lucide-react';

export default function AcademicTestList() {
  const [category, setCategory] = useState<'academic' | 'generalTraining'>(
    'academic'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #06BBCC 0%, #048a99 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                AI Analysis + Expert Review
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Master IELTS Writing
              <span className="block text-cyan-100 mt-2">
                with AI & Human Expertise
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant AI feedback, then receive personalized review from
              IELTS experts. The best of both worlds for faster improvement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-sm sm:text-base text-white">
                  60-minute tests
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
                <span className="text-sm sm:text-base text-white">
                  Real exam format
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
                <span className="text-sm sm:text-base text-white">
                  Expert reviewed
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 48h1440V0S1140 48 720 48 0 0 0 0v48z"
              fill="currentColor"
              className="text-cyan-50"
            />
          </svg>
        </div>
      </section>

      {/* Test List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            className="px-6 sm:px-8 py-6 sm:py-8"
            style={{
              background: 'linear-gradient(135deg, #06BBCC 0%, #048a99 100%)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Available Practice Tests
                </h2>
                <p className="text-white/90">
                  Choose a test and start practicing under real exam conditions
                </p>
              </div>

              {/* Category Toggle */}
              <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <button
                  onClick={() => setCategory('academic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    category === 'academic'
                      ? 'bg-white text-[#06BBCC] shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Academic
                </button>
                <button
                  onClick={() => setCategory('generalTraining')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    category === 'generalTraining'
                      ? 'bg-white text-[#06BBCC] shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  General Training
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <TestList category={category} />
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="mt-16 rounded-2xl shadow-xl p-8 sm:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #06BBCC 0%, #048a99 100%)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Improve Your IELTS Writing?
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students getting AI-powered instant feedback
            verified by expert IELTS instructors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <span>AI instant analysis</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <UserCheck className="w-5 h-5" />
              <span>Expert human review</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5" />
              <span>Proven results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © {new Date().getFullYear()} IELTS Writing Practice Platform. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
