import { useEffect, useState } from "react";

import {
  type IComment,
  FALLBACK_COMMENTS,
} from "@/graphql";

import { fetchUserComments } from "@/lib/dashboard-data";

interface IDashboardComments {
  reset: () => void;
  isLoading: boolean;
  comments: IComment[];
  error: string | null;
  append: (comment: IComment) => void;
}

export const useDashboardComments = (
  userId: string | null,
): IDashboardComments => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let ignore = false;
    fetchUserComments(userId)
      .then((userComments) => {
        if (ignore) return;
        setComments(userComments);
        setError(null);
        setLoadedUserId(userId);
      })
      .catch((requestError: unknown) => {
        if (ignore) return;
        console.error(
          "TaskFlow user comments request failed; using sample comments.",
          requestError,
        );
        setError(
          requestError instanceof Error
            ? `Comments are unavailable: ${requestError.message}`
            : "Comments are unavailable.",
        );
        setComments(
          FALLBACK_COMMENTS.filter((comment) => comment.userId === userId),
        );
        setLoadedUserId(userId);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  return {
    comments: userId
      ? comments.filter((comment) => comment.userId === userId)
      : [],
    isLoading: userId !== null && loadedUserId !== userId,
    error,
    reset: () => {
      setComments([]);
      setError(null);
      setLoadedUserId(null);
    },
    append: (comment) =>
      setComments((previous) => [
        ...previous,
        { ...comment, userId: userId ?? undefined },
      ]),
  };
};
