'use client';

import { useAuth } from '@/context/AuthContext';
import { useModal } from './useModal';
import { WritingTest } from '../../lib/services/writingTestService';

export const usePremium = () => {
  const { user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const isUserPaid = user?.isUserPaid ?? false;

  /**
   * Check if user has completed all free tests.
   * A free test (type=1) is completed if it has a submission.
   */
  const hasCompletedAllFreeTests = (tests: WritingTest[]): boolean => {
    const freeTests = tests.filter(t => t.type === 1);
    if (freeTests.length === 0) return false;
    return freeTests.every(
      t => t.submission !== null && t.submission !== undefined
    );
  };

  /**
   * Check if a specific test requires premium access.
   */
  const isPaidTest = (test: WritingTest): boolean => {
    return test.type === 2;
  };

  /**
   * Returns true if the test card should be faded/disabled.
   */
  const isTestLocked = (test: WritingTest): boolean => {
    return isPaidTest(test) && !isUserPaid;
  };

  /**
   * Handle click on a test - opens modal if locked, returns true if should proceed.
   */
  const handleTestClick = (test: WritingTest): boolean => {
    if (isTestLocked(test)) {
      openModal();
      return false;
    }
    return true;
  };

  return {
    isUserPaid,
    isPaidTest,
    isTestLocked,
    hasCompletedAllFreeTests,
    handleTestClick,
    isPremiumModalOpen: isOpen,
    openPremiumModal: openModal,
    closePremiumModal: closeModal,
  };
};
