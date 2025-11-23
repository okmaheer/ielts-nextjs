'use client';

import React, { useState } from 'react';
import TestList from '@/components/opencomponents/takewritingtest/TestList';
import {
  Clock,
  Target,
  Sparkles,
  CheckCircle,
  UserCheck,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import UserDropdown from '@/components/header/UserDropdown';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AcademicTestList() {
  const [category, setCategory] = useState<'academic' | 'generalTraining'>(
    'academic'
  );
  const { isAuthenticated } = useAuth();

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

        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-white">
                IELTS Practice
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md border border-white/20"
                    >
                      <LayoutDashboard size={16} />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <UserDropdown />
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="bg-white hover:bg-white/90 text-[#06BBCC] px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 pt-24">
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
