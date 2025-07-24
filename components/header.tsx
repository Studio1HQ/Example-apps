import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import {
  Plus,
  Moon,
  Sun,
  Inbox,
} from 'lucide-react';
import { VeltNotificationsTool, VeltCommentsSidebar, VeltSidebarButton, useVeltClient } from '@veltdev/react';
import { names, userIds, useUserStore } from "@/helper/userdb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDarkMode } from '@/app/layout';

const Header: React.FC = () => {
  const { user, setUser } = useUserStore();
  const { client } = useVeltClient();

  const predefinedUsers = useMemo(
    () =>
      userIds.map((uid, index) => {
        // Use DiceBear Avatars for demonstration
        const avatarUrls = [
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve",
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Elli",
        ];
        return {
          uid: uid,
          displayName: names[index],
          email: `${names[index].toLowerCase()}@inventory.com`,
          photoUrl: avatarUrls[index],
        };
      }),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const storedUser = localStorage.getItem("user-storage");
      if (!storedUser) {
        setUser(predefinedUsers[0]);
      }
    }
  }, [user, setUser, predefinedUsers]);

  // Velt user identification - moved from VeltInitializer to header (like google-sheet-comments)
  useEffect(() => {
    if (!client || !user) return;
    const veltUser = {
      userId: user.uid,
      organizationId: "inventory-dashboard-new-org",
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoUrl,
    };

    client.identify(veltUser);

    // Add all predefined users to the organization for mentions (like google-sheet-comments approach)
    predefinedUsers.forEach(predefinedUser => {
      if (predefinedUser.uid !== user.uid) {
        const otherVeltUser = {
          userId: predefinedUser.uid,
          organizationId: "inventory-dashboard-new-org",
          name: predefinedUser.displayName,
          email: predefinedUser.email,
          photoUrl: predefinedUser.photoUrl,
        };
        // Add other users to make them available for mentions
        client.identify(otherVeltUser);
      }
    });
  }, [client, user, predefinedUsers]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Apply dark class to body
    const body = document.getElementById('app-body');
    if (body) {
      if (newDarkMode) {
        body.classList.add('dark');
      } else {
        body.classList.remove('dark');
      }
    }

    // Store preference in localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      {/* Velt Comments Sidebar */}
      <VeltCommentsSidebar darkMode={isDarkMode} />

      <header className={styles['header-container']}>
        {/* Top Navigation */}
        <div className={styles['top-nav']}>
          <div className={styles['nav-left']}>
            <div className={styles['version-info']}>

            </div>
            <div className={styles['breadcrumb-main']}>
              <span>Inventory Dashboard</span>
              <span>- Stock Items</span>
            </div>
          </div>
          <div className={styles['nav-right']}>
            <div className={styles['action-group']}>
              {/* Velt Notification Tool */}
              <VeltNotificationsTool darkMode={isDarkMode} />
            </div>
            <div className={styles['button-group']}>
              {/* VeltCommentsSidebar Button */}
              <VeltSidebarButton>
                <button className={styles['ghost-btn']}>
                  <Inbox size={16} />
                  <span>Discussions</span>
                </button>
              </VeltSidebarButton>

              {/* Theme Toggle */}
              <div
                className={`${styles['theme-toggle']} ${isDarkMode ? styles['dark'] : styles['light']}`}
                onClick={toggleDarkMode}
                title="Toggle dark mode"
              >
                <div className={styles['theme-toggle-track']}>
                  <div
                    className={`${styles['theme-toggle-thumb']} ${isDarkMode ? styles['dark'] : styles['light']}`}
                    style={{
                      transform: isDarkMode ? 'translateX(24px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {isDarkMode ? (
                      <Moon size={16} color="#3887fa" />
                    ) : (
                      <Sun size={16} color="#f6c026" />
                    )}
                  </div>
                </div>
              </div>

              <button className={styles['blue-btn']}>
                <Plus size={16} />
                <span>Add Item</span>
              </button>
              {/* User Dropdown */}
              {user && (
                <div className={styles['user-dropdown']} ref={dropdownRef}>
                  <button
                    className={styles['user-btn']}
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <Avatar>
                      <AvatarImage src={user.photoUrl} alt={user.displayName} />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className={styles['user-name']}>{user.displayName}</span>
                    <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen ? styles['rotate-180'] : styles['rotate-0']}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {dropdownOpen && (
                    <div className={styles['user-dropdown-menu']}>
                      {predefinedUsers.map((predefinedUser) => (
                        <div
                          key={predefinedUser.uid}
                          className={styles['user-dropdown-item'] + (user.uid === predefinedUser.uid ? ' ' + styles['user-dropdown-item-active'] : '')}
                          onClick={() => {
                            setUser(predefinedUser);
                            setDropdownOpen(false);
                          }}
                        >
                          <Avatar>
                            <AvatarImage src={predefinedUser.photoUrl} alt={predefinedUser.displayName} />
                            <AvatarFallback>{predefinedUser.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <span>{predefinedUser.displayName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


      </header>
    </>
  );
};

export default Header;
