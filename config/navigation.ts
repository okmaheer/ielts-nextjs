// src/config/navigation.ts
import React from 'react';
import {
  GridIcon,
  UserCircleIcon,
  TaskIcon,
  CheckCircleIcon,
  DocsIcon,
} from '@/icons/index';

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    external?: boolean; // Opens in new tab
    roles?: string[]; // Roles allowed to see this sub-item
  }[];
  roles?: string[]; // Roles allowed to see this menu item (empty = everyone)
};

/**
 * Main navigation items
 * roles: [] or undefined = visible to all users
 * roles: ['Admin'] = visible only to Admin
 * roles: ['Admin', 'User'] = visible to both Admin and User
 */
export const navItems: NavItem[] = [
  {
    icon: React.createElement(GridIcon),
    name: 'Dashboard',
    path: '/dashboard',
    roles: ['Admin', 'User'], // Visible to all authenticated users
  },
  {
    icon: React.createElement(UserCircleIcon),
    name: 'Users',
    path: '/users',
    roles: ['Admin'], // Only Admin can see
  },
  {
    icon: React.createElement(DocsIcon),
    name: 'Expert Review Requests',
    path: '/admin/expert-reviews',
    roles: ['Admin'], // Only Admin can see
  },
  {
    icon: React.createElement(TaskIcon),
    name: 'Take Writing Tests',
    roles: ['Admin', 'User'], // Visible to all
    subItems: [
      {
        name: 'Academic Tests',
        path: '/take-writing-tests/academic',
        pro: false,
        roles: ['Admin', 'User'], // Visible to all
      },
      {
        name: 'General Training Tests',
        path: '/take-writing-tests/general-training',
        pro: false,
        roles: ['Admin', 'User'], // Visible to all
      },
      {
        name: 'Practice Academic L/R',
        path: 'https://cbt.ieltsprepandpractice.com/academic/test?type=1',
        external: true,
        roles: ['Admin', 'User'],
      },
      {
        name: 'Practice GT L/R',
        path: 'https://cbt.ieltsprepandpractice.com/general-training/test?type=1',
        external: true,
        roles: ['Admin', 'User'],
      },
    ],
  },
  {
    icon: React.createElement(CheckCircleIcon),
    name: 'Test Results',
    path: '/my-test-results',
    roles: [], // Visible to all
  },
  {
    icon: React.createElement(DocsIcon),
    name: 'Expert Reviews',
    path: '/my-expert-reviews',
    roles: ['Admin', 'User'], // Visible to authenticated users
  },
  {
    icon: React.createElement(UserCircleIcon),
    name: 'User Profile',
    path: '/profile',
    roles: [], // Visible to all
  },
];

/**
 * Others section navigation items
 */
export const othersItems: NavItem[] = [];
