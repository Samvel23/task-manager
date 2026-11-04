"use client";

import { use } from "react";

import Link from "next/link";

import { Input } from "@/components/atoms";
import { AuthControls } from "@/components/molecules";

import { ThemeContext } from "@/context";

import type { IUser } from "@/graphql";

import styles from "./DashboardHeader.module.scss";

interface IDashboardHeaderProps {
  users: IUser[];
  currentUser: IUser;
  onLogin: (user: IUser) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DashboardHeader = ({
  users,
  currentUser,
  onLogin,
  onLogout,
  searchQuery,
  onSearchChange,
}: IDashboardHeaderProps) => {
  const theme = use(ThemeContext);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link className={styles.brandLink} href="/">
            <span className={styles.brandMark} aria-hidden="true">
              T
            </span>
            <h1 className={styles.title}>TaskFlow</h1>
          </Link>
          <p className={styles.subtitle}>A calmer way to get work done</p>
        </div>
        <div className={styles.headerActions}>
          <AuthControls
            users={users}
            currentUser={currentUser}
            onLogin={onLogin}
            onLogout={onLogout}
          />
          <button
            type="button"
            onClick={theme?.toggleTheme}
            className={styles.themeButton}
            aria-label={`Switch to ${theme?.theme === "dark" ? "light" : "dark"} theme`}
          >
            <span aria-hidden="true">
              {theme?.theme === "dark" ? "☼" : "◐"}
            </span>
            {theme?.theme === "dark" ? "Light theme" : "Dark theme"}
          </button>
        </div>
      </header>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Input
            name="search"
            type="search"
            label="Search tasks"
            placeholder="Search your tasks"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <div className={styles.sessionSummary}>
          <span className={styles.sessionLabel}>SIGNED IN AS</span>
          <span className={styles.sessionName}>{currentUser.name}</span>
          <span className={styles.sessionEmail}>{currentUser.email}</span>
        </div>
      </div>
    </>
  );
}
