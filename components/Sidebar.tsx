import React from 'react';
import styles from './Sidebar.module.css';
import { Package, AlertTriangle, Settings, Plus, Archive, Clock, Star } from 'lucide-react';

interface User {
  photoUrl: string;
  name: string;
  email: string;
  team?: string;
  teamColor?: string;
}

interface SidebarProps {
  user?: User;
}

const Sidebar: React.FC<SidebarProps> = () => {


  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Package size={20} />
          <span>Inventory Management</span>
        </div>
      </div>

      {/* Add Item Button */}
      <div className={styles.actionSection}>
        <button className={styles.addButton}>
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>



      {/* Navigation Menu */}
      <nav className={styles.navigation}>
        <div className={styles.sectionHeader}>INVENTORY</div>

        <li className={`${styles.menuItem} ${styles.active}`}>
          <Package size={18} />
          <span>All Items</span>

        </li>
        <li className={styles.menuItem}>
          <Star size={18} />
          <span>Favorites</span>
        </li>
        <li className={styles.menuItem}>
          <AlertTriangle size={18} />
          <span>Low Stock</span>

        </li>
        <li className={styles.menuItem}>
          <Clock size={18} />
          <span>Recent</span>
        </li>
        <li className={styles.menuItem}>
          <Archive size={18} />
          <span>Archived</span>
        </li>



        <div className={styles.divider}></div>

        <div className={styles.sectionHeader}>LABELS</div>
        <li className={styles.menuItem}>
          <div className={styles.colorDot} style={{ backgroundColor: '#22c55e' }}></div>
          <span>In Stock</span>
        </li>
        <li className={styles.menuItem}>
          <div className={styles.colorDot} style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Pending</span>
        </li>
        <li className={styles.menuItem}>
          <div className={styles.colorDot} style={{ backgroundColor: '#ef4444' }}></div>
          <span>Out of Stock</span>
        </li>
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        <button className={styles.settingsBtn}>
          <Settings size={16} />
          <span>Settings</span>
        </button>

      </div>
    </aside>
  );
};

export default Sidebar; 