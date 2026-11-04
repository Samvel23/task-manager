// src/app/error.tsx
"use client";

import { useEffect } from "react";
import styles from "./styles/error.module.scss";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("TaskFlow route rendering failed.", error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>&#x26A0;</div>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        {error.message || "An unexpected error occurred while loading the page."}
      </p>
      <button onClick={reset} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorPage;
