// src/components/templates/TaskDetailsLayout/TaskDetailsLayout.tsx
"use client";

import type { ReactNode } from "react";

import styles from "./TaskDetailsLayout.module.scss";

interface ITaskDetailsLayoutProps {
  children: ReactNode;
}

export const TaskDetailsLayout = ({
  children,
}: ITaskDetailsLayoutProps) => {
  return <main className={styles.layoutContainer}>{children}</main>;
};
