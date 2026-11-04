// src/components/molecules/CommentList/CommentList.tsx
"use client";

import { useOptimistic, useState } from "react";

import { CommentCard } from "@/components/molecules/CommentCard/CommentCard";
import { CommentComposer } from "@/components/molecules/CommentComposer/CommentComposer";

import { fetchGraphQL } from "@/graphql/client";
import type { IComment, IUser } from "@/graphql/types";
import { CREATE_COMMENT_MUTATION } from "@/graphql/queries";

import styles from "./CommentList.module.scss";

interface ICommentListProps {
  comments: IComment[];
  postId: string;
  currentUser?: IUser | null;
  isLoading?: boolean;
  statusMessage?: string | null;
  onCommentsChange: (comment: IComment) => void;
}

const PAGE_SIZE = 5;

export const CommentList = ({
  comments,
  postId,
  currentUser,
  isLoading = false,
  statusMessage,
  onCommentsChange,
}: ICommentListProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, action: IComment) => [...state, action],
  );

  const handleAddComment = async (formData: FormData): Promise<void> => {
    const name = currentUser?.name ?? formData.get("name")?.toString().trim();
    const email = currentUser?.email ?? formData.get("email")?.toString().trim();
    const body = formData.get("body")?.toString().trim();

    if (!name || !email || !body) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    const optimisticComment: IComment = {
      id: `optimistic-${Date.now()}`,
      name,
      email,
      body,
      postId,
    };

    setOptimisticComments(optimisticComment);
    setErrorMessage(null);

    try {
      const result = await fetchGraphQL<{ createComment: IComment }>(
        CREATE_COMMENT_MUTATION,
        { input: { name, email, body } },
      );
      onCommentsChange({ ...result.createComment, postId });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to add this comment.",
      );
    }
  };

  const displayedComments = optimisticComments.slice(0, visibleCount);
  const hasMore = visibleCount < optimisticComments.length;

  return (
    <div className={styles.commentListContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Comments</h3>
        <span className={styles.counter}>
          Showing {displayedComments.length} of {optimisticComments.length}
        </span>
      </div>

      {errorMessage && <p className={styles.commentError} role="alert">{errorMessage}</p>}
      {statusMessage && (
        <p className={styles.commentError} role="status">
          {statusMessage}
        </p>
      )}

      {isLoading ? (
        <p className={styles.hint} role="status">
          Loading comments from your posts…
        </p>
      ) : null}
      {!isLoading && displayedComments.length === 0 ? (
        <p className={styles.hint}>No comments on your posts yet.</p>
      ) : null}
      <div className={styles.list}>
        {displayedComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className={styles.loadMoreButton}
        >
          Load more comments
        </button>
      )}

      <CommentComposer currentUser={currentUser} action={handleAddComment} />
    </div>
  );
}
