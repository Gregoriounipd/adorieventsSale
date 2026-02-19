import { useState } from 'react'
import styles from './Header.module.css'

export default function Header({ saleCount, onMenuToggle, menuOpen }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Adori <span>Events</span>
      </div>

      <div className={styles.actions}>
        <span className={styles.badge}>
          {saleCount} {saleCount === 1 ? 'sala' : 'sale'}
        </span>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={onMenuToggle}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
