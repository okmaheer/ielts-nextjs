// src/config/navigation.ts
import React from 'react';
import {
  BoxCubeIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
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
  {
    name: 'Forms',
    icon: React.createElement(ListIcon),
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Form Elements',
        path: '/form-elements',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
  {
    name: 'Tables',
    icon: React.createElement(TableIcon),
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Basic Tables',
        path: '/basic-tables',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
  {
    name: 'Pages',
    icon: React.createElement(PageIcon),
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Blank Page',
        path: '/blank',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: '404 Error',
        path: '/error-404',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
];

/**
 * Others section navigation items
 */
export const othersItems: NavItem[] = [
  {
    icon: React.createElement(PieChartIcon),
    name: 'Charts',
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Line Chart',
        path: '/line-chart',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Bar Chart',
        path: '/bar-chart',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
  {
    icon: React.createElement(BoxCubeIcon),
    name: 'UI Elements',
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Alerts',
        path: '/alerts',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Avatar',
        path: '/avatars',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Badge',
        path: '/badge',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Buttons',
        path: '/buttons',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Images',
        path: '/images',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Videos',
        path: '/videos',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
  {
    icon: React.createElement(PlugInIcon),
    name: 'Authentication',
    roles: [], // Visible to all
    subItems: [
      {
        name: 'Sign In',
        path: '/signin',
        pro: false,
        roles: [], // Visible to all
      },
      {
        name: 'Sign Up',
        path: '/signup',
        pro: false,
        roles: [], // Visible to all
      },
    ],
  },
];
