'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { useAuth } from '@/context/AuthContext';
import api from '../../../lib/api';

interface RecentLogin {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  loginTime: string;
  timeAgo: string;
}

interface RecentTest {
  id: string;
  testName: string;
  score: number;
  expertScore?: number;
  date: string;
  timeAgo: string;
}

interface ExpertFeedback {
  id: string;
  submissionId: string;
  status: string;
  requestedAt: string;
  timeAgo: string;
}

type NotificationItem = RecentLogin | RecentTest | ExpertFeedback;

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate time ago from date
  const getTimeAgo = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Fetch notifications based on user role
  const fetchNotifications = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const isAdmin = user.isAdmin || user.roles.includes('Admin');

      if (isAdmin) {
        // Fetch admin dashboard data for recent users
        const response = await api.get('/dashboard/admin');
        const data = response.data as Record<string, unknown>;

        // Get recent users (recently created accounts)
        const recentUsers = (data.recentUsers as RecentLogin[]) || [];
        const formattedNotifications: RecentLogin[] = recentUsers
          .slice(0, 5)
          .map((u: RecentLogin) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            profilePicture: u.profilePicture,
            loginTime: u.loginTime,
            timeAgo: getTimeAgo(u.loginTime),
          }));

        setNotifications(formattedNotifications);
      } else {
        // Fetch user dashboard for recent test scores and expert feedback
        const response = await api.get('/dashboard/user');
        const data = response.data as Record<string, unknown>;

        const notificationsList: NotificationItem[] = [];

        // Add recent test scores
        if (data.recentTests && Array.isArray(data.recentTests)) {
          const recentTestsNotifications: RecentTest[] = (
            data.recentTests as RecentTest[]
          )
            .slice(0, 3)
            .map((test: RecentTest) => ({
              id: test.id,
              testName: test.testName,
              score: test.score,
              expertScore: test.expertScore,
              date: test.date,
              timeAgo: getTimeAgo(test.date),
            }));
          notificationsList.push(...recentTestsNotifications);
        }

        // Add expert feedback notifications if available
        if (
          data.expertReviews &&
          typeof data.expertReviews === 'object' &&
          'byStatus' in data.expertReviews
        ) {
          const byStatus = data.expertReviews.byStatus as Record<
            string,
            number
          >;
          if (byStatus.completed > 0) {
            // This would be enhanced if backend provides specific feedback notifications
            // Uncomment when backend provides detailed expert feedback data
            // notifications.push(feedbackNotification);
          }
        }

        setNotifications(notificationsList);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user, getTimeAgo]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications, user]);

  // Hide notification bell if user is not authenticated
  if (!user) {
    return null;
  }

  const isAdmin = user.isAdmin || user.roles.includes('Admin');

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? 'hidden' : 'flex'
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isAdmin ? 'Recent Users' : 'Your Activity'}
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {loading ? (
            <li className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
            </li>
          ) : error ? (
            <li className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <span>{error}</span>
            </li>
          ) : notifications.length === 0 ? (
            <li className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <span>{isAdmin ? 'No recent users' : 'No recent activity'}</span>
            </li>
          ) : (
            notifications.map(notification => {
              const isLoginNotification = 'email' in notification;
              const isTestNotification = 'score' in notification;

              return (
                <li key={notification.id}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                  >
                    <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                      <div className="w-full h-full rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {isLoginNotification && 'name' in notification
                          ? notification.name?.charAt(0).toUpperCase() || '👤'
                          : isTestNotification && 'testName' in notification
                            ? notification.testName?.charAt(0).toUpperCase() ||
                              '📝'
                            : '📋'}
                      </div>
                      {isLoginNotification && (
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                      )}
                    </span>

                    <span className="block flex-1">
                      <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                        {isLoginNotification && 'name' in notification ? (
                          <>
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              {notification.name}
                            </span>
                            <span> joined</span>
                          </>
                        ) : isTestNotification && 'testName' in notification ? (
                          <>
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              {notification.testName}
                            </span>
                            <span> - Score: </span>
                            <span className="font-semibold text-brand-600 dark:text-brand-400">
                              {notification.score?.toFixed(1)}
                            </span>
                            {notification.expertScore && (
                              <>
                                <span> (Expert: </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {notification.expertScore.toFixed(1)}
                                </span>
                                <span>)</span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              Expert Feedback
                            </span>
                          </>
                        )}
                      </span>

                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        {isLoginNotification && 'email' in notification && (
                          <>
                            <span>{notification.email}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          </>
                        )}
                        <span>{notification.timeAgo}</span>
                      </span>
                    </span>
                  </DropdownItem>
                </li>
              );
            })
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
