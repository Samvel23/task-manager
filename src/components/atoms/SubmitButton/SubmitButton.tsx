// src/components/atoms/SubmitButton/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

import styles from "./SubmitButton.module.scss";

interface ISubmitButtonProps {
  label?: string;
  loadingLabel?: string;
  disabled?: boolean;
  variant?: "primary" | "danger" | "quiet";
}

export const SubmitButton = ({
  label = "Submit",
  loadingLabel = "Submitting…",
  disabled = false,
  variant = "primary",
}: ISubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`${styles.submitButton} ${variant === "primary" ? "" : styles[variant]}`}
      aria-busy={pending}
    >
      {pending && (
        <svg className={styles.submitSpinner} viewBox="0 0 24 24" fill="none">
          <circle
            className={styles.spinnerTrack}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className={styles.spinnerPath}
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      <span>{pending ? loadingLabel : label}</span>
    </button>
  );
}
