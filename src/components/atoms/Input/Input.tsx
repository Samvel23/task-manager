// src/components/atoms/Input/Input.tsx
"use client";

import {
  useId,
  useState,
  useCallback,
  type Ref,
  type InputHTMLAttributes,
} from "react";

import styles from "./Input.module.scss";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({
  label,
  className = "",
  ref: refProp,
  id,
  ...props
}: IInputProps) => {
  const [width, setWidth] = useState<number>(0);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const handleResizeRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={handleResizeRef}
      className={styles.inputWrapper}
      data-width={width > 0 ? width : undefined}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={refProp}
        id={inputId}
        className={`${styles.field} ${className}`}
        {...props}
      />
    </div>
  );
}
