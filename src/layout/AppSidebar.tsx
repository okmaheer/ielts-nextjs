'use client';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { ChevronDownIcon, HorizontaLDots } from '../icons/index';
import { navItems, othersItems, type NavItem } from '../../config/navigation';
import { filterNavigationByRole } from '../../lib/navigationFilter';

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  // ✅ FIXED: Use useMemo to prevent infinite re-renders
  const filteredNavItems = useMemo(
    () => filterNavigationByRole(navItems, user?.roles),
    [user?.roles]
  );

  const filteredOthersItems = useMemo(
    () => filterNavigationByRole(othersItems, user?.roles),
    [user?.roles]
  );

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const getMenuKey = (menuType: string, menuName: string) =>
    `${menuType}-${menuName}`;

  const handleSubmenuToggle = useCallback((menuKey: string) => {
    setOpenSubmenu(prevOpenSubmenu => {
      return prevOpenSubmenu === menuKey ? null : menuKey;
    });
  }, []);

  const renderMenuItems = useCallback(
    (items: NavItem[], menuType: 'main' | 'others') => (
      <ul className="flex flex-col gap-4">
        {items.map(nav => {
          const menuKey = getMenuKey(menuType, nav.name);
          const isOpen = openSubmenu === menuKey;

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmenuToggle(menuKey)}
                    className={`menu-item group w-full ${
                      isOpen ? 'menu-item-active' : 'menu-item-inactive'
                    } cursor-pointer ${
                      !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'lg:justify-start'
                    }`}
                  >
                    <span
                      className={`${
                        isOpen
                          ? 'menu-item-icon-active'
                          : 'menu-item-icon-inactive'
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        style={{
                          color: isOpen ? '#06BBCC' : undefined,
                        }}
                      />
                    )}
                  </button>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <div
                      ref={el => {
                        subMenuRefs.current[menuKey] = el;
                      }}
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        height: isOpen
                          ? `${subMenuHeight[menuKey] || 0}px`
                          : '0px',
                      }}
                    >
                      <ul className="mt-2 space-y-1 ml-9">
                        {nav.subItems.map(subItem => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.path}
                              className={`menu-dropdown-item ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-item-active'
                                  : 'menu-dropdown-item-inactive'
                              }`}
                            >
                              {subItem.name}
                              <span className="flex items-center gap-1 ml-auto">
                                {subItem.new && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? 'menu-dropdown-badge-active'
                                        : 'menu-dropdown-badge-inactive'
                                    } menu-dropdown-badge`}
                                  >
                                    new
                                  </span>
                                )}
                                {subItem.pro && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? 'menu-dropdown-badge-active'
                                        : 'menu-dropdown-badge-inactive'
                                    } menu-dropdown-badge`}
                                  >
                                    pro
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                nav.path && (
                  <Link
                    href={nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? 'menu-item-active'
                        : 'menu-item-inactive'
                    }`}
                  >
                    <span
                      className={`${
                        isActive(nav.path)
                          ? 'menu-item-icon-active'
                          : 'menu-item-icon-inactive'
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>
    ),
    [
      openSubmenu,
      isExpanded,
      isHovered,
      isMobileOpen,
      subMenuHeight,
      isActive,
      handleSubmenuToggle,
    ]
  );

  useEffect(() => {
    let submenuMatched = false;

    const allItems = [
      ...filteredNavItems.map(item => ({ ...item, type: 'main' })),
      ...filteredOthersItems.map(item => ({ ...item, type: 'others' })),
    ];

    allItems.forEach(item => {
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (isActive(subItem.path)) {
            const menuKey = getMenuKey(item.type, item.name);
            setOpenSubmenu(menuKey);
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, filteredNavItems, filteredOthersItems]);

  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      const height = subMenuRefs.current[openSubmenu]?.scrollHeight || 0;

      setSubMenuHeight(prevHeights => ({
        ...prevHeights,
        [openSubmenu]: height,
      }));
    }
  }, [openSubmenu, filteredNavItems, filteredOthersItems]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-3 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-center'
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={90}
                height={25}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {filteredNavItems.length > 0 && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'justify-start'
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    'Menu'
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(filteredNavItems, 'main')}
              </div>
            )}

            {filteredOthersItems.length > 0 && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'justify-start'
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    'Others'
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(filteredOthersItems, 'others')}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
