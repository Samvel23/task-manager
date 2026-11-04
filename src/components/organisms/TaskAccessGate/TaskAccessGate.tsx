"use client";

import Link from "next/link";

import { AuthControls } from "@/components/molecules";

import type { IUser } from "@/graphql";

import styles from "@/app/styles/access-gate.module.scss";
import commonStyles from "@/app/styles/dashboard-common.module.scss";


interface ITaskAccessGateProps {
  title: string;
  description: string;
  users?: IUser[];
  onLogin?: (user: IUser) => void;
  onLogout?: () => void;
  isDenied?: boolean;
}

export const TaskAccessGate = ({
  title,
  description,
  users = [],
  onLogin,
  onLogout,
  isDenied = false,
}: ITaskAccessGateProps) => {
  return (
    <main className={commonStyles.mainContainer}>
      <section
        className={styles.loginGate}
        aria-labelledby="task-access-title"
      >
        <div className={styles.loginCard}>
          {!isDenied && (
            <>
              <span className={styles.loginMark} aria-hidden="true">
                T
              </span>
              <p className={`${commonStyles.eyebrow} ${styles.loginEyebrow}`}>
                WELCOME TO TASKFLOW
              </p>
            </>
          )}
          <h1 className={styles.loginTitle} id="task-access-title">
            {title}
          </h1>
          <p className={styles.loginDescription}>{description}</p>
          {isDenied ? (
            <Link href="/">Return to your workspace</Link>
          ) : onLogin && onLogout ? (
            <AuthControls
              users={users}
              currentUser={null}
              onLogin={onLogin}
              onLogout={onLogout}
              mode="gate"
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
