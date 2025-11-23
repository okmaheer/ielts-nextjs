// app/(others-pages)/take-writing-tests/academic/[testId]/layout.tsx
'use client';
import React from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        .app-header {
          display: none !important;
        }
      `}</style>
      <div className="fixed inset-0 w-screen h-screen overflow-auto bg-white dark:bg-gray-900 z-50">
        {children}
      </div>
    </>
  );
}
