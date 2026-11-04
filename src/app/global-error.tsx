"use client";

import { useEffect } from "react";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("TaskFlow root rendering failed.", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main>
          <h1>TaskFlow could not load</h1>
          <p role="alert">
            {error.message || "An unexpected error occurred."}
          </p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
