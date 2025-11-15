// utils/navigationFilter.ts
import { NavItem } from '../config/navigation';

/**
 * Check if user has permission to view a navigation item
 * @param itemRoles - Roles required to view the item (empty array = everyone)
 * @param userRoles - User's roles
 * @returns true if user can view the item
 */
export const hasNavigationPermission = (
  itemRoles: string[] | undefined,
  userRoles: string[] | undefined
): boolean => {
  // If no roles specified or empty array, visible to everyone
  if (!itemRoles || itemRoles.length === 0) {
    return true;
  }

  // If user has no roles, they can't access restricted items
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Check if user has any of the required roles
  return itemRoles.some(role => userRoles.includes(role));
};

/**
 * Filter navigation items based on user roles
 * @param items - Navigation items to filter
 * @param userRoles - User's roles
 * @returns Filtered navigation items
 */
export const filterNavigationByRole = (
  items: NavItem[],
  userRoles: string[] | undefined
): NavItem[] => {
  return items
    .filter(item => hasNavigationPermission(item.roles, userRoles))
    .map(item => {
      // If item has sub-items, filter them too
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(subItem =>
          hasNavigationPermission(subItem.roles, userRoles)
        );

        // Only return the parent item if it has visible sub-items
        if (filteredSubItems.length > 0) {
          return {
            ...item,
            subItems: filteredSubItems,
          };
        }

        // If no sub-items are visible, don't show the parent
        return null;
      }

      return item;
    })
    .filter((item): item is NavItem => item !== null);
};
