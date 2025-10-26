import GridShape from '@/components/common/GridShape';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children}

          {/* Right Side - Brand Panel */}
          <div
            className="lg:w-1/2 w-full h-full lg:grid items-center hidden relative overflow-hidden"
            style={{ backgroundColor: '#06BBCC' }}
          >
            <div className="relative items-center justify-center flex z-10">
              {/* Grid Shape Background */}
              <GridShape />

              <div className="flex flex-col items-center max-w-md px-8">
                {/* Logo/Brand Section */}
                <div className="mb-10 text-center">
                  <h2 className="text-6xl font-bold text-white mb-3">IELTS</h2>
                  <h3 className="text-3xl font-semibold text-white/95">
                    Writing Platform
                  </h3>
                  <div className="w-24 h-1 bg-white/30 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Features Section */}
                <div className="space-y-6 text-white/90 w-full">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 text-lg">
                        AI-Powered Feedback
                      </h4>
                      <p className="text-white/80 text-sm">
                        Get instant, detailed feedback on your IELTS writing
                        tasks
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 text-lg">
                        Practice Tests
                      </h4>
                      <p className="text-white/80 text-sm">
                        Access Task 1 & Task 2 practice materials with scoring
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1 text-lg">
                        Track Your Progress
                      </h4>
                      <p className="text-white/80 text-sm">
                        Monitor your improvement with detailed analytics and
                        reports
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggler */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
