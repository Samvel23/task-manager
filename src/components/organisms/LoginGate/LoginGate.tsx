"use client";

import type { IUser } from "@/graphql";

import { AuthControls } from "@/components/molecules";

import styles from "@/app/styles/access-gate.module.scss";
import commonStyles from "@/app/styles/dashboard-common.module.scss";

interface ILoginGateProps {
  users: IUser[];
  onLogin: (user: IUser) => void;
  onLogout: () => void;
  statusMessage?: string | null;
}

export const LoginGate = ({
  users,
  onLogin,
  onLogout,
  statusMessage,
}: ILoginGateProps) => {
  return (
    <main className={`${commonStyles.mainContainer} taskPage`}>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/task-page.css" precedence="page" />
      <section className={styles.loginGate} aria-labelledby="login-title">
        <div className={styles.loginCard}>
          <span className={styles.loginMark} aria-hidden="true">
            T
          </span>
          <p className={`${commonStyles.eyebrow} ${styles.loginEyebrow}`}>
            WELCOME TO TASKFLOW
          </p>
          <h1 className={styles.loginTitle} id="login-title">
            Sign in to your workspace
          </h1>
          <p className={styles.loginDescription}>
            Choose your account to see your tasks and conversations.
          </p>
          {statusMessage && (
            <p className={commonStyles.workspaceError} role="status">
              Showing sample accounts: {statusMessage}
            </p>
          )}
          <AuthControls
            users={users}
            currentUser={null}
            onLogin={onLogin}
            onLogout={onLogout}
            mode="gate"
          />
        </div>
      </section>
    </main>
  );
}
